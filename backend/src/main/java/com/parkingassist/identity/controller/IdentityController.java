package com.parkingassist.identity.controller;

import com.parkingassist.identity.dto.request.LoginRequest;
import com.parkingassist.identity.dto.request.RegisterRequest;
import com.parkingassist.identity.dto.response.TokenResponse;
import com.parkingassist.identity.service.IdentityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** HTTP adapter for identity use cases; business logic belongs to IdentityService. */
@RestController
@RequestMapping("/api/v1/auth")
public class IdentityController {

    private final IdentityService identityService;

    public IdentityController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public TokenResponse register(@Valid @RequestBody RegisterRequest request) {
        return identityService.register(request);
    }

    @PostMapping("/login")
    public TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return identityService.login(request);
    }
}