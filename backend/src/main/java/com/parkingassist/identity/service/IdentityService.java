package com.parkingassist.identity.service;

import com.parkingassist.identity.dto.request.LoginRequest;
import com.parkingassist.identity.dto.request.RegisterRequest;
import com.parkingassist.identity.dto.response.TokenResponse;
import com.parkingassist.identity.repository.IdentityRepository;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Owns identity use cases and credential verification; controllers remain transport-only. */
@Service
public class IdentityService {

    private static final long ACCESS_TOKEN_TTL_SECONDS = 900;

    private final IdentityRepository identityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public IdentityService(
            IdentityRepository identityRepository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder
    ) {
        this.identityRepository = identityRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        UUID userId = UUID.randomUUID();

        identityRepository.create(
                userId,
                request.fullName().trim(),
                email,
                passwordEncoder.encode(request.password())
        );

        return issueAccessToken(userId, email);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        IdentityRepository.IdentityRecord user = identityRepository.findByEmail(email)
                .filter(record -> "ACTIVE".equals(record.status()))
                .filter(record -> passwordEncoder.matches(
                        request.password(), record.passwordHash()))
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid email or password."));

        return issueAccessToken(user.id(), user.email());
    }

    private TokenResponse issueAccessToken(UUID userId, String email) {
        Instant issuedAt = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("parking-assist")
                .subject(userId.toString())
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plusSeconds(ACCESS_TOKEN_TTL_SECONDS))
                .claim("email", email)
                .claim("scope", "ROLE_DRIVER")
                .build();

        String token = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims
        )).getTokenValue();

        return new TokenResponse(
                token, "Bearer", ACCESS_TOKEN_TTL_SECONDS, userId.toString());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}