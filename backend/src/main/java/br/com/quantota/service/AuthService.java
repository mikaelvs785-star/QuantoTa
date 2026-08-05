package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .filter(Usuario::getAtivo)
                .filter(user -> senhaConfere(request.getSenha(), user.getSenha()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha invalidos"));

        if (!usuario.getSenha().startsWith("$2")) {
            usuario.setSenha(passwordEncoder.encode(request.getSenha()));
            usuarioRepository.save(usuario);
        }

        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().name(),
                usuario.getAtivo(),
                "Login realizado com sucesso!",
                jwtService.gerarToken(usuario)
        );
    }

    private boolean senhaConfere(String senha, String armazenada) {
        return armazenada.startsWith("$2") ? passwordEncoder.matches(senha, armazenada) : armazenada.equals(senha);
    }
}
