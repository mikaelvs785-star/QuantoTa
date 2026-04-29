package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public LoginResponseDTO login(LoginRequestDTO request) {

        // 🔥 Simulação simples (substituir por banco depois)
        if ("admin@gmail.com".equals(request.getEmail()) &&
                "123456".equals(request.getSenha())) {

            return new LoginResponseDTO("Login realizado com sucesso!");
        }

        throw new RuntimeException("Email ou senha inválidos");
    }
}