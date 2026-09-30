package br.com.quantota.controller;
import br.com.quantota.service.CatalogoPermissaoService;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/catalogo")
public class CatalogoController {
    private final CatalogoPermissaoService permissoes;
    public CatalogoController(CatalogoPermissaoService permissoes) { this.permissoes = permissoes; }
    @GetMapping("/permissoes")
    public CatalogoPermissaoService.Permissoes permissoes() { return permissoes.consultar(); }
}
