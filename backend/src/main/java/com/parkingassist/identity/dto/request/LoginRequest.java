package com.parkingassist.identity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Credentials submitted to obtain a short-lived access token. */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}