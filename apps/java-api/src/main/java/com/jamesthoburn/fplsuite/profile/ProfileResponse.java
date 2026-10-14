package com.jamesthoburn.fplsuite.profile;

public record ProfileResponse(String displayName, Long fplManagerId) {
    public static ProfileResponse empty() {
        return new ProfileResponse("", null);
    }

    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getDisplayName(),
                profile.getFplManagerId()
        );
    }
}
