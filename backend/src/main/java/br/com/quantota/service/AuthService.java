package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public AuthService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos."));

        if (!usuario.getSenha().equals(request.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos.");
        }

        return LoginResponseDTO.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil())
                .mensagem("Login realizado com sucesso.")
                .build();
    }
}
