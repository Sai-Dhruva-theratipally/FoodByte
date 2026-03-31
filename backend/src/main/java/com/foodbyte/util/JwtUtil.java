package com.foodbyte.util;

import com.foodbyte.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtService jwtService;

    public Long extractUserIdFromToken(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtService.getUserIdFromToken(token);
    }
}
