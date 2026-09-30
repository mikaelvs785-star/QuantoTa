package br.com.quantota.controller;

import br.com.quantota.dto.*;
import br.com.quantota.model.ItemListaCompra;
import br.com.quantota.model.ListaCompra;
import br.com.quantota.service.ListaCompraService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaCompraController {
    private final ListaCompraService service;
    public ListaCompraController(ListaCompraService service) { this.service = service; }
    @GetMapping public List<ListaCompra> listar() { return service.listarTodas(); }
    @PostMapping public ListaCompra criar(@Valid @RequestBody CadastroListaDTO dto) { return service.criarLista(dto); }
    @PostMapping("/{id}/itens") public ItemListaCompra adicionar(@PathVariable Long id, @Valid @RequestBody CadastroItemListaDTO dto) { return service.adicionarItem(id, dto); }
    @PutMapping("/{id}/itens/{itemId}") public ItemListaCompra atualizar(@PathVariable Long id, @PathVariable Long itemId, @Valid @RequestBody QuantidadeItemDTO dto) { return service.atualizarItem(id, itemId, dto.quantidade()); }
    @DeleteMapping("/{id}/itens/{itemId}") public void remover(@PathVariable Long id, @PathVariable Long itemId) { service.removerItem(id, itemId); }
    @DeleteMapping("/{id}") public void removerLista(@PathVariable Long id) { service.removerLista(id); }
    @GetMapping("/{id}") public ListaCompraResumoDTO resumo(@PathVariable Long id) { return service.buscarResumo(id); }
}
