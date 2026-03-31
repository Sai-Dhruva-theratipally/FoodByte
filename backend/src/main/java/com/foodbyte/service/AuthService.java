package com.foodbyte.service;

import com.foodbyte.dto.JwtResponse;
import com.foodbyte.dto.LoginRequest;
import com.foodbyte.dto.RegisterRequest;
import com.foodbyte.entity.Cart;
import com.foodbyte.entity.Role;
import com.foodbyte.entity.User;
import com.foodbyte.exception.ConflictException;
import com.foodbyte.exception.UnprocessableEntityException;
import com.foodbyte.repository.CartRepository;
import com.foodbyte.repository.UserRepository;
import com.foodbyte.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

        @Value("${app.security.allow-admin-registration:false}")
        private boolean allowAdminRegistration;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered: " + request.getEmail());
        }

                Role desiredRole = request.getRole() == null ? Role.USER : request.getRole();
                if (desiredRole == Role.ADMIN) {
                        if (!allowAdminRegistration) {
                                throw new UnprocessableEntityException("Admin registration is disabled");
                        }
                }

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(desiredRole)
                .build();

        User savedUser = userRepository.save(user);

        // Create associated cart
        Cart cart = Cart.builder()
                .user(savedUser)
                .build();
        cartRepository.save(cart);

        // Generate token with userId
        String token = jwtService.generateTokenFromUsername(savedUser.getEmail(), savedUser.getId());

        return JwtResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().name())
                .type("Bearer")
                .build();
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtService.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }
}
