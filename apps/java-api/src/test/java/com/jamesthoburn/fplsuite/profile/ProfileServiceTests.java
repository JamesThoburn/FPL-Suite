package com.jamesthoburn.fplsuite.profile;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTests {
    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void returnsEmptyProfileWhenNoRowExists() {
        UUID userId = UUID.randomUUID();
        when(profileRepository.findById(userId)).thenReturn(Optional.empty());

        ProfileResponse result = profileService.getProfile(userId);

        assertEquals("", result.displayName());
        assertNull(result.fplManagerId());
        verify(profileRepository).findById(userId);
    }

    @Test
    void savesUpdatesForTheRequestedUserOnly() {
        UUID userId = UUID.randomUUID();
        UUID otherUserId = UUID.randomUUID();
        when(profileRepository.findById(userId)).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileResponse result = profileService.updateProfile(userId, new UpdateProfileRequest("  Jamie  ", 123456L));

        assertEquals("Jamie", result.displayName());
        assertEquals(123456L, result.fplManagerId());
        verify(profileRepository).findById(userId);
        verify(profileRepository, never()).findById(otherUserId);
    }

}
