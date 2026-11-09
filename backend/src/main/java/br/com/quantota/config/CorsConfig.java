package br.com.quantota.config;

import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(@Value("${app.cors.allowed-origins:http://localhost:5173}") String origins) {
        String[] allowed = java.util.Arrays.stream(origins.split(","))
                .map(String::trim).filter(origin -> !origin.isBlank()).toArray(String[]::new);
        if (allowed.length == 0 || java.util.Arrays.asList(allowed).contains("*")) {
            throw new IllegalArgumentException("Configure origens CORS explícitas em APP_CORS_ALLOWED_ORIGINS");
        }
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowed)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
