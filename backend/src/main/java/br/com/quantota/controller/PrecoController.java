package br.com.quantota.controller;

import br.com.quantota.dto.CadastroPrecoDTO;
import br.com.quantota.model.Preco;
import br.com.quantota.service.PrecoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/precos")
public class PrecoController {

    private final PrecoService precoService;

    public PrecoController(PrecoService precoService) {
        this.precoService = precoService;
    }

    @GetMapping("/gestao")
    public List<Preco> gestao() { return precoService.listarGestao(); }

    @GetMapping
    public List<Preco> listar() {
        return precoService.listarTodos();
    }

    @GetMapping("/atuais")
    public List<Preco> atuais() { return precoService.listarAtuais(); }

    @GetMapping("/produto/{id}")
    public List<Preco> listarPorProduto(@PathVariable Long id) {
        return precoService.listarPorProduto(id);
    }

    @PostMapping
    public Preco salvar(@Valid @RequestBody CadastroPrecoDTO dto) {
        return precoService.salvar(dto);
    }

    @PutMapping("/{id}")
    public Preco atualizar(@PathVariable Long id, @Valid @RequestBody CadastroPrecoDTO dto) {
        return precoService.atualizar(id, dto);
    }

    @DeleteMapping("/mercado/{mercadoId}/produto/{produtoId}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void removerProdutoDoMercado(@PathVariable Long mercadoId, @PathVariable Long produtoId) {
        precoService.removerProdutoDoMercado(mercadoId, produtoId);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        precoService.deletar(id);
    }
}
