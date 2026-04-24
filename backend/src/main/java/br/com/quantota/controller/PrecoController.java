package br.com.quantota.controller;

import br.com.quantota.dto.CadastroPrecoDTO;
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
    public Preco salvar(@RequestBody CadastroPrecoDTO dto) {
        return precoService.salvar(dto);
    }

    @PutMapping("/{id}")
    public Preco atualizar(@PathVariable Long id, @RequestBody CadastroPrecoDTO dto) {
        return precoService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        precoService.deletar(id);
    }
}
