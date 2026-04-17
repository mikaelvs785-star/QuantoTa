package br.com.quantota.service;

import br.com.quantota.dto.CadastroItemListaDTO;
import br.com.quantota.dto.CadastroListaDTO;
import br.com.quantota.dto.ListaCompraResumoDTO;
import br.com.quantota.model.ItemListaCompra;
import br.com.quantota.model.ListaCompra;
import br.com.quantota.model.Produto;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.ItemListaCompraRepository;
import br.com.quantota.repository.ListaCompraRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ListaCompraService {

    private final ListaCompraRepository listaCompraRepository;
    private final ItemListaCompraRepository itemListaCompraRepository;
    private final UsuarioService usuarioService;
    private final ProdutoService produtoService;
    private final PrecoService precoService;

    public ListaCompraService(ListaCompraRepository listaCompraRepository,
                              ItemListaCompraRepository itemListaCompraRepository,
                              UsuarioService usuarioService,
                              ProdutoService produtoService,
                              PrecoService precoService) {
        this.listaCompraRepository = listaCompraRepository;
        this.itemListaCompraRepository = itemListaCompraRepository;
        this.usuarioService = usuarioService;
        this.produtoService = produtoService;
        this.precoService = precoService;
    }

    public List<ListaCompra> listarTodas() {
        return listaCompraRepository.findAll();
    }

    public ListaCompra criarLista(CadastroListaDTO dto) {
        Usuario usuario = usuarioService.buscarPorId(dto.getUsuarioId());
        ListaCompra lista = ListaCompra.builder()
                .usuario(usuario)
                .nomeLista(dto.getNomeLista())
                .dataCriacao(LocalDate.now())
                .build();
        return listaCompraRepository.save(lista);
    }

    public ItemListaCompra adicionarItem(Long listaId, CadastroItemListaDTO dto) {
        ListaCompra lista = buscarEntidade(listaId);
        Produto produto = produtoService.buscarPorId(dto.getProdutoId());
        ItemListaCompra item = ItemListaCompra.builder()
                .listaCompra(lista)
                .produto(produto)
                .quantidade(dto.getQuantidade())
                .build();
        return itemListaCompraRepository.save(item);
    }

    public ListaCompraResumoDTO buscarResumo(Long listaId) {
        ListaCompra lista = buscarEntidade(listaId);
        BigDecimal total = BigDecimal.ZERO;

        for (ItemListaCompra item : lista.getItens()) {
            BigDecimal menorPreco = precoService.buscarMenorPreco(item.getProduto().getId());
            total = total.add(menorPreco.multiply(BigDecimal.valueOf(item.getQuantidade())));
        }

        return ListaCompraResumoDTO.fromEntity(lista, total);
    }

    public ListaCompra buscarEntidade(Long listaId) {
        return listaCompraRepository.findById(listaId)
                .orElseThrow(() -> new RuntimeException("Lista de compras não encontrada."));
    }
}
