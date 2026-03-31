package com.foodbyte.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.foodbyte.dto.OrderResponse;
import com.foodbyte.entity.OrderStatus;
import com.foodbyte.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(orderService::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }
}
