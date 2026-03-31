package com.foodbyte.controller;

import com.foodbyte.dto.OrderRequest;
import com.foodbyte.dto.OrderResponse;
import com.foodbyte.service.OrderService;
import com.foodbyte.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Validated
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;

    /**
     * Create a new order from cart
     * @param request: OrderRequest - notes (optional)
     * @return: OrderResponse - created order details
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody OrderRequest request) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get order history for user
     * @return: List<OrderResponse> - user's orders
     */
    @GetMapping("/history")
    public ResponseEntity<List<OrderResponse>> getOrderHistory(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        List<OrderResponse> response = orderService.getOrderHistory(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get order details by ID
     * @param orderId: order ID
     * @return: OrderResponse - order details
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        OrderResponse response = orderService.getOrderById(orderId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Reorder previous order (add items back to cart and place new order)
     * @param orderId: previous order ID
     * @return: OrderResponse - new order details
     */
    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<OrderResponse> reorderPreviousOrder(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId) {
        Long userId = jwtUtil.extractUserIdFromToken(token);
        OrderResponse response = orderService.reorderPreviousOrder(userId, orderId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
