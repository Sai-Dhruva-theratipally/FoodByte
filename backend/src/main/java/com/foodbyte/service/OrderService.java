package com.foodbyte.service;

import com.foodbyte.dto.OrderItemResponse;
import com.foodbyte.dto.OrderRequest;
import com.foodbyte.dto.OrderResponse;
import com.foodbyte.entity.Cart;
import com.foodbyte.entity.CartItem;
import com.foodbyte.entity.Order;
import com.foodbyte.entity.OrderItem;
import com.foodbyte.entity.OrderStatus;
import com.foodbyte.entity.User;
import com.foodbyte.exception.NotFoundException;
import com.foodbyte.exception.UnprocessableEntityException;
import com.foodbyte.repository.CartRepository;
import com.foodbyte.repository.OrderItemRepository;
import com.foodbyte.repository.OrderRepository;
import com.foodbyte.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;

    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found for user: " + userId));

        if (cart.getItems().isEmpty()) {
            throw new UnprocessableEntityException("Cannot create order from empty cart");
        }

        // Calculate total amount from cart items
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Create order
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .build();

        Order savedOrder = orderRepository.save(order);

        // Create order items from cart items
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .productId(cartItem.getProductId())
                    .quantity(cartItem.getQuantity())
                    .price(BigDecimal.ZERO) // Price from product service (team to implement)
                    .build();
            orderItemRepository.save(orderItem);
        }

        // Clear the cart
        cartService.clearCart(userId);

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getOrderHistory(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Order does not belong to user");
        }

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse reorderPreviousOrder(Long userId, Long orderId) {
        Order previousOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        if (!previousOrder.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: Order does not belong to user");
        }

        // Add items from previous order back to cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found for user: " + userId));

        for (OrderItem orderItem : previousOrder.getItems()) {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .productId(orderItem.getProductId())
                    .quantity(orderItem.getQuantity())
                    .build();
            // Check if item already exists in cart
            CartItem existingItem = cart.getItems().stream()
                    .filter(item -> item.getProductId().equals(orderItem.getProductId()))
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + orderItem.getQuantity());
            } else {
                cart.getItems().add(cartItem);
            }
        }
        cartRepository.save(cart);

        // Create new order from cart
        return createOrder(userId, OrderRequest.builder().notes("Reorder from order #" + orderId).build());
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found: " + orderId));

        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return mapToOrderResponse(updatedOrder);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProductId())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
