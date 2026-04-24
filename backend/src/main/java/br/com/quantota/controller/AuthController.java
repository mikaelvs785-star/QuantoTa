package br.com.quantota.controller;

import br.com.quantota.dto.CadastroVendedorDTO;
import br.com.quantota.dto.LoginRequestDTO;
import br.com.quantota.dto.LoginResponseDTO;
import br.com.quantota.model.SolicitacaoVendedor;
import br.com.quantota.service.AuthService;
import br.com.quantota.service.SolicitacaoVendedorService;
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

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/cadastro-vendedor")
    public SolicitacaoVendedor cadastrarVendedor(@RequestBody CadastroVendedorDTO dto) {
        return solicitacaoVendedorService.cadastrarVendedor(dto);
    }
}
