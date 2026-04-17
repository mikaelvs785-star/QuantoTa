package br.com.quantota.controller;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }
}
