package com.parkingassist.identity.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Validated public contract for creating a driver account. */
public record RegisterRequest(
        @NotBlank @Size(max = 80) String fullName,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 10, max = 72) String password
) {
}