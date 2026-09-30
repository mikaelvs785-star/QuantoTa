package br.com.quantota.service;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Deve realizar login com sucesso quando os dados forem válidos")
    void deveRealizarLoginComSucesso() {

        // ARRANGE
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("usuario@email.com");
        request.setSenha("123456");

        Usuario usuario = Usuario.builder()
                .id(1L)
                .nome("Usuario Teste")
                .email("usuario@email.com")
                .senha("$2senhaCriptografada")
                .perfil(PerfilUsuario.USER)
                .ativo(true)
                .build();

        when(usuarioRepository.findByEmail("usuario@email.com"))
                .thenReturn(Optional.of(usuario));

        when(passwordEncoder.matches("123456", "$2senhaCriptografada"))
                .thenReturn(true);

        when(jwtService.gerarToken(usuario))
                .thenReturn("token-teste");

        // ACT
        LoginResponseDTO resposta = authService.login(request);

        // ASSERT
        assertNotNull(resposta);
        assertEquals(1L, resposta.getId());
        assertEquals("Usuario Teste", resposta.getNome());
        assertEquals("usuario@email.com", resposta.getEmail());
        assertEquals("USER", resposta.getPerfil());
        assertTrue(resposta.getAtivo());
        assertEquals(
                "Login realizado com sucesso!",
                resposta.getMensagem()
        );
        assertEquals("token-teste", resposta.getToken());

        // VERIFY
        verify(usuarioRepository)
                .findByEmail("usuario@email.com");

        verify(passwordEncoder)
                .matches("123456", "$2senhaCriptografada");

        verify(jwtService)
                .gerarToken(usuario);
    }

    @Test
    @DisplayName("Deve rejeitar login quando a senha for inválida")
    void deveRejeitarLoginQuandoSenhaForInvalida() {

        // ARRANGE
        LoginRequestDTO request = new LoginRequestDTO();
        request.setEmail("usuario@email.com");
        request.setSenha("senhaErrada");

        Usuario usuario = Usuario.builder()
                .id(1L)
                .nome("Usuario Teste")
                .email("usuario@email.com")
                .senha("$2senhaCriptografada")
                .perfil(PerfilUsuario.USER)
                .ativo(true)
                .build();

        when(usuarioRepository.findByEmail("usuario@email.com"))
                .thenReturn(Optional.of(usuario));

        when(passwordEncoder.matches(
                "senhaErrada",
                "$2senhaCriptografada"
        )).thenReturn(false);

        // ACT + ASSERT
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(request)
        );

        assertEquals(
                HttpStatus.UNAUTHORIZED,
                exception.getStatusCode()
        );

        assertEquals(
                "Email ou senha invalidos",
                exception.getReason()
        );

        // VERIFY
        verify(usuarioRepository)
                .findByEmail("usuario@email.com");

        verify(passwordEncoder)
                .matches("senhaErrada", "$2senhaCriptografada");

        verify(jwtService, never())
                .gerarToken(any(Usuario.class));
    }
}