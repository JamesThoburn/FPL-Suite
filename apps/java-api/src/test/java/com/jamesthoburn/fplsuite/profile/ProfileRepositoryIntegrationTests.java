package com.jamesthoburn.fplsuite.profile;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=none",
        "spring.sql.init.mode=never"
})
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
@Testcontainers
@Import(ProfileService.class)
class ProfileRepositoryIntegrationTests {
    @Container
    private static final PostgreSQLContainer POSTGRES =
            new PostgreSQLContainer("postgres:17-alpine")
                    .withDatabaseName("fpl_suite_test")
                    .withUsername("test")
                    .withPassword("test");

    @Autowired
    private ProfileService profileService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @DynamicPropertySource
    static void configureDatabase(DynamicPropertyRegistry properties) {
        properties.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        properties.add("spring.datasource.username", POSTGRES::getUsername);
        properties.add("spring.datasource.password", POSTGRES::getPassword);
        properties.add(
                "spring.datasource.driver-class-name",
                POSTGRES::getDriverClassName
        );
    }

    @Test
    void createsAndReadsOnlyTheRequestedUsersProfile() {
        UUID userA = UUID.randomUUID();
        UUID userB = UUID.randomUUID();

        jdbcTemplate.update(
                """
                INSERT INTO profiles (user_id, display_name, fpl_manager_id)
                VALUES (?, ?, ?)
                """,
                userB,
                "Other user",
                777L
        );

        ProfileResponse initial = profileService.getProfile(userA);
        assertEquals("", initial.displayName());
        assertNull(initial.fplManagerId());

        ProfileResponse saved = profileService.updateProfile(
                userA,
                new UpdateProfileRequest("User A", 123L)
        );

        assertEquals("User A", saved.displayName());
        assertEquals(123L, saved.fplManagerId());

        ProfileResponse otherUsersProfile = profileService.getProfile(userB);
        assertEquals("Other user", otherUsersProfile.displayName());
        assertEquals(777L, otherUsersProfile.fplManagerId());
    }

    @Test
    void updatesExistingProfileWithoutChangingItsOwner() {
        UUID userId = UUID.randomUUID();

        jdbcTemplate.update(
                """
                INSERT INTO profiles (user_id, display_name, fpl_manager_id)
                VALUES (?, ?, ?)
                """,
                userId,
                "Before",
                100L
        );

        ProfileResponse updated = profileService.updateProfile(
                userId,
                new UpdateProfileRequest("After", 200L)
        );

        assertEquals("After", updated.displayName());
        assertEquals(200L, updated.fplManagerId());

        UUID storedOwner = jdbcTemplate.queryForObject(
                "SELECT user_id FROM profiles WHERE user_id = ?",
                UUID.class,
                userId
        );
        assertEquals(userId, storedOwner);
    }
}