package br.com.quantota.controller;

import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.dto.CadastroVendedorDTO;
import br.com.quantota.service.AuthService;
import br.com.quantota.service.SolicitacaoVendedorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final SolicitacaoVendedorService solicitacaoVendedorService;

    public AuthController(AuthService authService,
                          SolicitacaoVendedorService solicitacaoVendedorService) {
        this.authService = authService;
        this.solicitacaoVendedorService = solicitacaoVendedorService;
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // 📝 CADASTRO
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody CadastroVendedorDTO request) {
        solicitacaoVendedorService.criarSolicitacao(request);
        return ResponseEntity.ok("Solicitação enviada com sucesso!");
    }
}