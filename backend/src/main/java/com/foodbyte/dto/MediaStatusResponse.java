package com.foodbyte.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaStatusResponse {
    private boolean configured;
    private boolean pingOk;
    private String folder;
    private String message;
}
