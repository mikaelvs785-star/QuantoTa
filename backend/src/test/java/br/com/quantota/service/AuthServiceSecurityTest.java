package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;

class AuthServiceSecurityTest {
    @Test void rejectsLegacyPlaintextPassword() {
        var repository = mock(UsuarioRepository.class);
        var jwt = mock(JwtService.class);
        var limiter = new LoginAttemptService();
        var service = new AuthService(repository, jwt, new BCryptPasswordEncoder(), limiter);
        var request = new LoginRequestDTO();
        request.setEmail("legacy@test.local");
        request.setSenha("plaintext-password");
        var http = mock(HttpServletRequest.class);
        when(http.getRemoteAddr()).thenReturn("192.0.2.10");
        when(repository.findByEmail("legacy@test.local")).thenReturn(Optional.of(
                Usuario.builder().email("legacy@test.local").senha("plaintext-password")
                        .ativo(true).perfil(PerfilUsuario.USER).build()));
        assertEquals(401, assertThrows(ResponseStatusException.class,
                () -> service.login(request, http)).getStatusCode().value());
        verify(repository, never()).save(any());
    }
}
