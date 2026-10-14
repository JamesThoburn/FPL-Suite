package com.jamesthoburn.fplsuite.profile;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UpdateProfileRequest(@NotBlank @Size(max=80) String displayName, @Positive Long fplManagerId) {
}
