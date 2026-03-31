package com.foodbyte.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Double price;
    private Boolean available;
    private Long restaurantId;
    private String restaurantName;
    private Long categoryId;
    private String categoryName;
    private Integer popularity;
}
