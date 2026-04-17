package br.com.quantota.controller;

import br.com.quantota.dto.CadastroItemListaDTO;
import br.com.quantota.dto.CadastroListaDTO;
import br.com.quantota.dto.ListaCompraResumoDTO;
import br.com.quantota.model.ItemListaCompra;
import br.com.quantota.model.ListaCompra;
import br.com.quantota.service.ListaCompraService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaCompraController {

    private final ListaCompraService listaCompraService;

    public ListaCompraController(ListaCompraService listaCompraService) {
        this.listaCompraService = listaCompraService;
    }

    @GetMapping
    public List<ListaCompra> listar() {
        return listaCompraService.listarTodas();
    }

    @PostMapping
    public ListaCompra criar(@RequestBody CadastroListaDTO dto) {
        return listaCompraService.criarLista(dto);
    }

    @PostMapping("/{id}/itens")
    public ItemListaCompra adicionarItem(@PathVariable Long id, @RequestBody CadastroItemListaDTO dto) {
        return listaCompraService.adicionarItem(id, dto);
    }

    @GetMapping("/{id}")
    public ListaCompraResumoDTO buscarResumo(@PathVariable Long id) {
        return listaCompraService.buscarResumo(id);
    }
}
