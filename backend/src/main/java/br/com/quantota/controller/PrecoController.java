package br.com.quantota.controller;

import br.com.quantota.dto.CadastroPrecoDTO;
import br.com.quantota.model.Preco;
import br.com.quantota.service.PrecoService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/precos")
public class PrecoController {

    private final PrecoService precoService;

    public PrecoController(PrecoService precoService) {
        this.precoService = precoService;
    }

    @GetMapping
    public List<Preco> listar() {
        return precoService.listarTodos();
    }

    @GetMapping("/produto/{id}")
    public List<Preco> listarPorProduto(@PathVariable Long id) {
        return precoService.listarPorProduto(id);
    }

    @PostMapping
    public Preco salvar(@RequestBody CadastroPrecoDTO dto, Authentication authentication) {
        return precoService.salvar(dto, authentication.getName());
    }

    @PutMapping("/{id}")
    public Preco atualizar(@PathVariable Long id, @RequestBody CadastroPrecoDTO dto, Authentication authentication) {
        return precoService.atualizar(id, dto, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id, Authentication authentication) {
        precoService.deletar(id, authentication.getName());
    }
}
