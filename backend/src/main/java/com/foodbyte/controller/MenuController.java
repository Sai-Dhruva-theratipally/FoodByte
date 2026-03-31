package com.foodbyte.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodbyte.dto.ProductResponse;
import com.foodbyte.service.MenuService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> listProducts() {
        return ResponseEntity.ok(menuService.getAllProducts());
    }

    @GetMapping("/{restaurantId}")
    public ResponseEntity<List<ProductResponse>> listProductsByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuService.getProductsByRestaurant(restaurantId));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<ProductResponse>> listPopularProducts() {
        return ResponseEntity.ok(menuService.getPopularProducts());
    }
}
