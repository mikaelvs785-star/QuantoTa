package br.com.quantota.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {
    private static final int MAX_FAILURES = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();
    private final Clock clock;

    public LoginAttemptService() { this(Clock.systemUTC()); }
    LoginAttemptService(Clock clock) { this.clock = clock; }

    public void requireAllowed(String client) {
        Attempt attempt = attempts.get(client);
        if (attempt != null && !expired(attempt) && attempt.failures() >= MAX_FAILURES) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Tente novamente mais tarde.");
        }
    }

    public void recordFailure(String client) {
        attempts.compute(client, (key, previous) -> {
            if (previous == null || expired(previous)) return new Attempt(1, clock.instant());
            return new Attempt(previous.failures() + 1, previous.since());
        });
    }

    public void clear(String client) { attempts.remove(client); }

    private boolean expired(Attempt attempt) {
        return !clock.instant().isBefore(attempt.since().plus(WINDOW));
    }

    private record Attempt(int failures, Instant since) {}
}
