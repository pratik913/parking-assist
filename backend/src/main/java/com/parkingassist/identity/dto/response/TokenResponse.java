package com.parkingassist.identity.dto.response;

/** API representation of an access token; refresh-token support is a separate future flow. */
public record TokenResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        String userId
) {
}