package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptService loginAttempts;

    public AuthService(UsuarioRepository usuarioRepository, JwtService jwtService, PasswordEncoder passwordEncoder, LoginAttemptService loginAttempts) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.loginAttempts = loginAttempts;
    }

    public LoginResponseDTO login(LoginRequestDTO request, HttpServletRequest httpRequest) {
        String client = httpRequest.getRemoteAddr();
        loginAttempts.requireAllowed(client);
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase(java.util.Locale.ROOT))
                .filter(user -> Boolean.TRUE.equals(user.getAtivo()))
                .filter(user -> senhaConfere(request.getSenha(), user.getSenha()))
                .orElse(null);
        if (usuario == null) {
            loginAttempts.recordFailure(client);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha invalidos");
        }
        loginAttempts.clear(client);

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
        if (senha == null || armazenada == null) return false;
        return armazenada.startsWith("$2") && passwordEncoder.matches(senha, armazenada);
    }
}
