package com.foodbyte.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.foodbyte.dto.RestaurantRequest;
import com.foodbyte.dto.RestaurantResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminRestaurantService {

    private final RestaurantService restaurantService;

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        return restaurantService.createRestaurant(request);
    }

    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request) {
        return restaurantService.updateRestaurant(id, request);
    }

    public void deleteRestaurant(Long id) {
        restaurantService.deleteRestaurant(id);
    }
}
