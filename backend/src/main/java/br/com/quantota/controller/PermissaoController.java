package br.com.quantota.controller;
import br.com.quantota.service.PermissaoService;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping({"/permissoes", "/catalogo/permissoes"})
public class PermissaoController {
    private final PermissaoService permissoes;
    public PermissaoController(PermissaoService permissoes) { this.permissoes = permissoes; }
    @GetMapping
    public PermissaoService.Permissoes permissoes() { return permissoes.consultar(); }
}
