package org.zerock.mallapi.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.mallapi.domain.*;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.repository.*;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    @Override
    public List<CartItemListDTO> addOrModify(CartItemDTO dto) {
        checkOwner(dto.getEmail());
        if (dto.getQty() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수량은 1 이상이어야 합니다.");
        }
        if (dto.getCino() != null) {
            CartItem item = ownedItem(dto.getCino());
            item.changeQty(dto.getQty());
            cartItemRepository.saveAndFlush(item);
            return getCartItems(dto.getEmail());
        }
        if (dto.getPno() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "상품 번호가 필요합니다.");
        }
        Product product = productRepository.findById(dto.getPno())
            .filter(p -> !p.isDelFlag())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상품이 없습니다."));
        Cart cart = cartRepository.getCartOfMember(dto.getEmail()).orElseGet(() -> {
            Member owner = memberRepository.findById(dto.getEmail()).orElseThrow();
            return cartRepository.save(Cart.builder().owner(owner).build());
        });
        CartItem item = cartItemRepository.getItemOfPno(dto.getEmail(), dto.getPno());
        if (item == null) {
            item = CartItem.builder().cart(cart).product(product).qty(dto.getQty()).build();
        } else {
            item.changeQty(dto.getQty());
        }
        cartItemRepository.saveAndFlush(item);
        return getCartItems(dto.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CartItemListDTO> getCartItems(String email) {
        checkOwner(email);
        return cartItemRepository.getItemsOfCartDTOByEmail(email);
    }

    @Override
    public List<CartItemListDTO> remove(Long cino) {
        CartItem item = ownedItem(cino);
        String email = item.getCart().getOwner().getEmail();
        cartItemRepository.delete(item);
        cartItemRepository.flush();
        return getCartItems(email);
    }

    private CartItem ownedItem(Long cino) {
        if (cino == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "장바구니 아이템 번호가 필요합니다.");
        }
        CartItem item = cartItemRepository.findById(cino)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "장바구니 아이템이 없습니다."));
        checkOwner(item.getCart().getOwner().getEmail());
        return item;
    }

    private void checkOwner(String email) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !auth.getName().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 장바구니만 변경하거나 조회할 수 있습니다.");
        }
    }
}
