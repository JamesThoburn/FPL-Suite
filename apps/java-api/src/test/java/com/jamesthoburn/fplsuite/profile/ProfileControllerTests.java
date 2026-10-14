package com.jamesthoburn.fplsuite.profile;

import com.jamesthoburn.fplsuite.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProfileController.class)
@TestPropertySource(properties = {
        "app.cors.allowed-origin=http://localhost:3000",
        "supabase.jwt.issuer=https://example.supabase.co/auth/v1",
        "supabase.jwt.jwks-uri=https://example.supabase.co/auth/v1/.well-known/jwks.json"
})
@Import(SecurityConfig.class)
public class ProfileControllerTests {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProfileService profileService;

    @Test
    void rejectsRequestWithoutAuthentication() throws Exception {
        mockMvc.perform(get("/api/v1/profile")).andExpect(status().isUnauthorized());
    }

    @Test
    void readsProfileForVerifiedTokenSubject() throws Exception {
        UUID userId = UUID.randomUUID();
        when(profileService.getProfile(userId)).thenReturn(new ProfileResponse("Jamie", 123456L));

        mockMvc.perform(get("/api/v1/profile")
                .with(jwt().jwt(token ->
                        token.subject(userId.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("Jamie"))
                .andExpect(jsonPath("$.fplManagerId").value(123456));

        verify(profileService).getProfile(userId);
    }

    @Test
    void ignoresUserIdInBodyAndUpdatesOnlyTokenOwner() throws Exception {
        UUID userId = UUID.randomUUID();
        when(profileService.updateProfile(
                eq(userId),
                argThat(request ->
                        request.displayName().equals("Jamie") &&
                        request.fplManagerId().equals(123456L))
        )).thenReturn(new ProfileResponse("Jamie", 123456L));

        mockMvc.perform(put("/api/v1/profile")
                .with(jwt().jwt(token ->
                        token.subject(userId.toString())))
                .contentType("application/json")
                .content("""
                        {
                            "displayName": "Jamie",
                            "fplManagerId": 123456,
                            "userId": "another-user"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.displayName").value("Jamie"));

        verify(profileService).updateProfile(
                eq(userId),
                argThat(request -> request.displayName().equals("Jamie"))
        );
    }

    @Test
    void rejectsInvalidProfileValues() throws Exception {
        UUID userId = UUID.randomUUID();

        mockMvc.perform(put("/api/v1/profile")
                .with(jwt().jwt(token ->
                        token.subject(userId.toString())))
                .contentType("application/json")
                .content("""
                        {
                            "displayName": "   ",
                            "fplManagerId": -4
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(
                        MediaType.APPLICATION_PROBLEM_JSON
                ))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").value(
                        "The profile contains invalid values"
                ));
    }

    @Test
    void rejectsMalformedBearerToken() throws Exception {
        mockMvc.perform(get("/api/v1/profile")
                        .header("Authorization", "Bearer not-a-jwt"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(profileService);
    }

}
