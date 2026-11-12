package org.zerock.mallapi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    // PDF 30~32쪽: 상품 목록
    @Override
    public PageResponseDTO<ProductDTO> getList(
            PageRequestDTO pageRequestDTO) {

        Pageable pageable = PageRequest.of(
            pageRequestDTO.getPage() - 1,
            pageRequestDTO.getSize(),
            Sort.by("pno").descending()
        );

        Page<Object[]> result = productRepository.selectList(pageable);

        List<ProductDTO> dtoList = result.getContent().stream()
            .map(arr -> {
                Product product = (Product) arr[0];
                ProductImage image = (ProductImage) arr[1];

                ProductDTO dto = ProductDTO.builder()
                    .pno(product.getPno())
                    .pname(product.getPname())
                    .price(product.getPrice())
                    .pdesc(product.getPdesc())
                    .delFlag(product.isDelFlag())
                    .build();

                dto.setUploadFileNames(List.of(image.getFileName()));

                return dto;
            })
            .collect(Collectors.toList());

        return PageResponseDTO.<ProductDTO>withAll()
            .dtoList(dtoList)
            .pageRequestDTO(pageRequestDTO)
            .totalCount(result.getTotalElements())
            .build();
    }

    // PDF 35~37쪽: 상품 등록
    @Override
    public Long register(ProductDTO productDTO) {
        Product product = dtoToEntity(productDTO);
        return productRepository.save(product).getPno();
    }

    // PDF 40~42쪽: 상품 조회
    @Override
    public ProductDTO get(Long pno) {
        Product product = productRepository.selectOne(pno)
            .orElseThrow();

        return entityToDTO(product);
    }

    // PDF 45~47쪽: 상품 수정
    @Override
    public void modify(ProductDTO productDTO) {
        Product product = productRepository
            .selectOne(productDTO.getPno())
            .orElseThrow();

        product.changeName(productDTO.getPname());
        product.changeDesc(productDTO.getPdesc());
        product.changePrice(productDTO.getPrice());

        product.clearList();

        List<String> fileNames = productDTO.getUploadFileNames();

        if (fileNames != null) {
            fileNames.forEach(product::addImageString);
        }

        productRepository.save(product);
    }

    // PDF 50~51쪽: 삭제 표시
    @Override
    public void remove(Long pno) {
        productRepository.updateToDelete(pno, true);
    }

    // PDF 37쪽: DTO → 엔티티
    private Product dtoToEntity(ProductDTO dto) {
        Product product = Product.builder()
            .pname(dto.getPname())
            .price(dto.getPrice())
            .pdesc(dto.getPdesc())
            .build();

        List<String> fileNames = dto.getUploadFileNames();

        if (fileNames != null) {
            fileNames.forEach(product::addImageString);
        }

        return product;
    }

    // PDF 42쪽: 엔티티 → DTO
    private ProductDTO entityToDTO(Product product) {
        ProductDTO dto = ProductDTO.builder()
            .pno(product.getPno())
            .pname(product.getPname())
            .price(product.getPrice())
            .pdesc(product.getPdesc())
            .delFlag(product.isDelFlag())
            .build();

        List<String> fileNames = product.getImageList().stream()
            .map(ProductImage::getFileName)
            .collect(Collectors.toList());

        dto.setUploadFileNames(fileNames);

        return dto;
    }
}