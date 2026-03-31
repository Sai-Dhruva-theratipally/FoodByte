package com.foodbyte.controller;

import com.foodbyte.dto.CartItemRequest;
import com.foodbyte.dto.CartItemResponse;
import com.foodbyte.dto.CartResponse;
import com.foodbyte.service.CartService;
import com.foodbyte.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Validated
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    /**
     * Add item to cart
     * @param request: CartItemRequest - productId, quantity
     * @return: CartItemResponse - added item details
     */
    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addItemToCart(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        CartItemResponse response = cartService.addItemToCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get user's cart
     * @return: CartResponse - list of items in cart
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        CartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update cart item quantity
     * @param id: CartItem ID
     * @param quantity: new quantity
     * @return: CartItemResponse - updated item details
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        CartItemResponse response = cartService.updateCartItem(userId, id, quantity);
        return ResponseEntity.ok(response);
    }

    /**
     * Remove item from cart
     * @param id: CartItem ID
     * @return: success message
     */
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<Void> removeItemFromCart(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        cartService.removeItemFromCart(userId, id);
        return ResponseEntity.noContent().build();
    }
}
