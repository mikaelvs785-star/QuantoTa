package br.com.quantota.controller;

import br.com.quantota.model.Preco;
import br.com.quantota.service.PrecoService;
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
    public Preco salvar(@RequestBody Preco preco) {
        return precoService.salvar(preco);
    }

    @PutMapping("/{id}")
    public Preco atualizar(@PathVariable Long id, @RequestBody Preco preco) {
        return precoService.atualizar(id, preco);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        precoService.deletar(id);
    }
}
