package org.zerock.mallapi.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.service.ProductService;
import org.zerock.mallapi.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final CustomFileUtil fileUtil;

    @GetMapping("/list")
    public PageResponseDTO<ProductDTO> list(
            PageRequestDTO pageRequestDTO) {

        return productService.getList(pageRequestDTO);
    }

    @PostMapping("/")
    public Map<String, Long> register(
            @ModelAttribute ProductDTO productDTO) {

        List<String> fileNames =
            fileUtil.saveFiles(productDTO.getFiles());

        productDTO.setUploadFileNames(fileNames);

        Long pno = productService.register(productDTO);

        return Map.of("result", pno);
    }

    @GetMapping("/{pno}")
    public ProductDTO read(@PathVariable(name = "pno") Long pno) {
        return productService.get(pno);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(
            @PathVariable(name = "fileName") String fileName) {

        return fileUtil.getFile(fileName);
    }

    // PDF 48~49쪽: 상품 및 이미지 수정
    @PutMapping("/{pno}")
    public Map<String, String> modify(
            @PathVariable(name = "pno") Long pno,
            @ModelAttribute ProductDTO productDTO) {

        productDTO.setPno(pno);

        List<String> oldFileNames =
            productService.get(pno).getUploadFileNames();

        List<String> uploadedFileNames = new ArrayList<>();

        if (productDTO.getUploadFileNames() != null) {
            uploadedFileNames.addAll(
                productDTO.getUploadFileNames()
            );
        }

        List<String> newFileNames =
            fileUtil.saveFiles(productDTO.getFiles());

        uploadedFileNames.addAll(newFileNames);
        productDTO.setUploadFileNames(uploadedFileNames);

        productService.modify(productDTO);

        List<String> removeFiles = oldFileNames.stream()
            .filter(name -> !uploadedFileNames.contains(name))
            .toList();

        fileUtil.deleteFiles(removeFiles);

        return Map.of("RESULT", "SUCCESS");
    }

    @DeleteMapping("/{pno}")
    public Map<String, String> remove(
            @PathVariable(name = "pno") Long pno) {

        List<String> oldFileNames =
            productService.get(pno).getUploadFileNames();

        productService.remove(pno);
        fileUtil.deleteFiles(oldFileNames);

        return Map.of("RESULT", "SUCCESS");
    }
}