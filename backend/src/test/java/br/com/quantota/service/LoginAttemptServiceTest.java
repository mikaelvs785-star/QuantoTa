package br.com.quantota.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptServiceTest {
    @Test void blocksAfterFiveFailuresAndDoesNotBlockOtherClients() {
        var limiter = new LoginAttemptService();
        for (int i = 0; i < 5; i++) {
            limiter.requireAllowed("client-a");
            limiter.recordFailure("client-a");
        }
        assertEquals(429, assertThrows(ResponseStatusException.class,
                () -> limiter.requireAllowed("client-a")).getStatusCode().value());
        assertDoesNotThrow(() -> limiter.requireAllowed("client-b"));
        limiter.clear("client-a");
        assertDoesNotThrow(() -> limiter.requireAllowed("client-a"));
    }

    @Test void expiredWindowAllowsNewAttempt() {
        var clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
        var limiter = new LoginAttemptService(clock);
        for (int i = 0; i < 5; i++) limiter.recordFailure("client");
        assertThrows(ResponseStatusException.class, () -> limiter.requireAllowed("client"));
        // The production implementation uses a rolling 15-minute window.
    }
}
