package com.jamesthoburn.fplsuite.profile;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        return profileRepository.findById(userId)
                .map(ProfileResponse::from)
                .orElseGet(ProfileResponse::empty);
    }

    @Transactional
    public ProfileResponse updateProfile(
            UUID userId,
            UpdateProfileRequest request
    ) {
        String displayName = request.displayName().strip();

        Profile profile = profileRepository.findById(userId)
                .orElseGet(() -> new Profile(userId, displayName, null));

        profile.update(displayName, request.fplManagerId());
        return ProfileResponse.from(profileRepository.save(profile));
    }
}
