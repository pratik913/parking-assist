package com.parkingassist.identity.repository;

import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Persistence adapter for identity records.
 * SQL stays here so HTTP and business layers do not depend on database details.
 */
@Repository
public class IdentityRepository {

    private final JdbcTemplate jdbcTemplate;

    public IdentityRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void create(UUID id, String fullName, String email, String passwordHash) {
        jdbcTemplate.update("""
                INSERT INTO app_user (id, full_name, email, password_hash)
                VALUES (?, ?, ?, ?)
                """, id, fullName, email, passwordHash);
    }

    public Optional<IdentityRecord> findByEmail(String email) {
        return jdbcTemplate.query("""
                SELECT id, email, password_hash, status
                FROM app_user
                WHERE email = ?
                """, (resultSet, rowNumber) -> new IdentityRecord(
                        resultSet.getObject("id", UUID.class),
                        resultSet.getString("email"),
                        resultSet.getString("password_hash"),
                        resultSet.getString("status")
                ), email).stream().findFirst();
    }

    public record IdentityRecord(
            UUID id,
            String email,
            String passwordHash,
            String status
    ) {
    }
}