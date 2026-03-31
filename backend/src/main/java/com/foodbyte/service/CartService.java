package com.foodbyte.service;

import com.foodbyte.dto.CartItemRequest;
import com.foodbyte.dto.CartItemResponse;
import com.foodbyte.dto.CartResponse;
import com.foodbyte.entity.Cart;
import com.foodbyte.entity.CartItem;
import com.foodbyte.entity.User;
import com.foodbyte.exception.NotFoundException;
import com.foodbyte.repository.CartItemRepository;
import com.foodbyte.repository.CartRepository;
import com.foodbyte.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    private Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found for user: " + userId));
    }

    @Transactional
    public CartItemResponse addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getCartByUserId(userId);

        // Check if item already exists in cart
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(request.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setUpdatedAt(System.currentTimeMillis());
            cartItemRepository.save(existingItem);
            return mapToCartItemResponse(existingItem);
        }

        // Add new item to cart
        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .productId(request.getProductId())
                .quantity(request.getQuantity())
                .build();

        CartItem savedItem = cartItemRepository.save(cartItem);
        return mapToCartItemResponse(savedItem);
    }

    public CartResponse getCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        
        List<CartItemResponse> items = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .build();
    }

    @Transactional
    public CartItemResponse updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = getCartByUserId(userId);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cartItemRepository.deleteById(itemId);
            throw new RuntimeException("Item removed from cart");
        }

        cartItem.setQuantity(quantity);
        cartItem.setUpdatedAt(System.currentTimeMillis());
        CartItem updatedItem = cartItemRepository.save(cartItem);

        return mapToCartItemResponse(updatedItem);
    }

    @Transactional
    public void removeItemFromCart(Long userId, Long itemId) {
        Cart cart = getCartByUserId(userId);

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Cart item not found: " + itemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cartItemRepository.deleteAll(cart.getItems());
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProductId())
                .quantity(cartItem.getQuantity())
                .createdAt(cartItem.getCreatedAt())
                .updatedAt(cartItem.getUpdatedAt())
                .build();
    }
}
