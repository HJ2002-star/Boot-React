package org.zerock.mallapi.controller;

import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.zerock.mallapi.dto.*;
import org.zerock.mallapi.service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/change")
    public List<CartItemListDTO> changeCart(@RequestBody CartItemDTO itemDTO, Principal principal) {
        if (itemDTO.getEmail() != null && !principal.getName().equals(itemDTO.getEmail())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인 장바구니만 변경할 수 있습니다.");
        }
        itemDTO.setEmail(principal.getName());
        if (itemDTO.getQty() <= 0) {
            return cartService.remove(itemDTO.getCino());
        }
        return cartService.addOrModify(itemDTO);
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/items")
    public List<CartItemListDTO> getCartItems(Principal principal) {
        return cartService.getCartItems(principal.getName());
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{cino}")
    public List<CartItemListDTO> removeFromCart(@PathVariable("cino") Long cino) {
        return cartService.remove(cino);
    }
}
