package br.com.quantota.controller;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.dto.CadastroUsuarioDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.service.UsuarioService;
import br.com.quantota.service.SessaoService;
import jakarta.validation.Valid;
import br.com.quantota.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UsuarioService usuarioService;
    private final SessaoService sessaoService;

    public AuthController(AuthService authService,
                          UsuarioService usuarioService, SessaoService sessaoService) {
        this.authService = authService;
        this.usuarioService = usuarioService;
        this.sessaoService = sessaoService;
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@Valid @RequestBody CadastroUsuarioDTO request) {
        return ResponseEntity.status(201).body(usuarioService.cadastrar(request));
    }
    @GetMapping("/profile")
    public Usuario profile() { return sessaoService.usuarioAtual(); }
}
