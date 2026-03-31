package com.foodbyte.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    @Size(max = 500, message = "Notes should not exceed 500 characters")
    private String notes;  // Can be extended later with delivery address, special instructions, etc.
}
