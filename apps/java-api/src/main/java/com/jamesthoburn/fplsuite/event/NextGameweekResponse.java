package com.jamesthoburn.fplsuite.event;

import java.time.Instant;

public record NextGameweekResponse(int id, String name, Instant deadlineTime) {}
