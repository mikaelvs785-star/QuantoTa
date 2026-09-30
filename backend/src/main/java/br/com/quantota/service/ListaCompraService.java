package br.com.quantota.service;

import br.com.quantota.dto.CadastroItemListaDTO;
import br.com.quantota.dto.CadastroListaDTO;
import br.com.quantota.dto.ListaCompraResumoDTO;
import br.com.quantota.model.ItemListaCompra;
import br.com.quantota.model.ListaCompra;
import br.com.quantota.repository.ItemListaCompraRepository;
import br.com.quantota.repository.ListaCompraRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ListaCompraService {
    private final ListaCompraRepository listas;
    private final ItemListaCompraRepository itens;
    private final SessaoService sessao;
    private final ProdutoService produtos;
    private final PrecoService precos;
    public ListaCompraService(ListaCompraRepository listas, ItemListaCompraRepository itens, SessaoService sessao, ProdutoService produtos, PrecoService precos) {
        this.listas = listas; this.itens = itens; this.sessao = sessao; this.produtos = produtos; this.precos = precos;
    }
    @Transactional(readOnly = true)
    public List<ListaCompra> listarTodas() { return listas.findByUsuarioId(sessao.usuarioAtual().getId()); }
    public ListaCompra criarLista(CadastroListaDTO dto) {
        return listas.save(ListaCompra.builder().usuario(sessao.usuarioAtual()).nomeLista(dto.getNomeLista().trim()).dataCriacao(LocalDate.now()).build());
    }
    public ItemListaCompra adicionarItem(Long listaId, CadastroItemListaDTO dto) {
        ListaCompra lista = buscarEntidade(listaId);
        var produto = produtos.buscarPorId(dto.getProdutoId());
        if (!Boolean.TRUE.equals(produto.getAtivo())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto indisponível.");
        var existente = lista.getItens().stream().filter(i -> i.getProduto().getId().equals(produto.getId())).findFirst();
        if (existente.isPresent()) {
            var item = existente.get();
            validarQuantidade(item.getQuantidade() + dto.getQuantidade());
            item.setQuantidade(item.getQuantidade() + dto.getQuantidade());
            return itens.save(item);
        }
        var item = ItemListaCompra.builder().listaCompra(lista).produto(produto).quantidade(dto.getQuantidade()).build();
        lista.getItens().add(item);
        return itens.save(item);
    }
    public ItemListaCompra atualizarItem(Long listaId, Long itemId, Integer quantidade) {
        validarQuantidade(quantidade);
        var item = buscarItem(buscarEntidade(listaId), itemId);
        item.setQuantidade(quantidade);
        return itens.save(item);
    }
    public void removerItem(Long listaId, Long itemId) {
        var lista = buscarEntidade(listaId);
        var item = buscarItem(lista, itemId);
        lista.getItens().remove(item);
        listas.save(lista);
    }
    public void removerLista(Long listaId) { listas.delete(buscarEntidade(listaId)); }
    @Transactional(readOnly = true)
    public ListaCompraResumoDTO buscarResumo(Long listaId) {
        var lista = buscarEntidade(listaId);
        BigDecimal total = BigDecimal.ZERO;
        int semPreco = 0;
        for (var item : lista.getItens()) {
            var menor = precos.buscarMenorPrecoDisponivel(item.getProduto().getId());
            if (menor.isEmpty()) semPreco++;
            else total = total.add(menor.get().multiply(BigDecimal.valueOf(item.getQuantidade())));
        }
        var resumo = ListaCompraResumoDTO.fromEntity(lista, total);
        resumo.setItensSemPreco(semPreco);
        resumo.setEstimativaCompleta(semPreco == 0);
        return resumo;
    }
    public ListaCompra buscarEntidade(Long listaId) {
        Long usuarioId = sessao.usuarioAtual().getId();
        return listas.findById(listaId).filter(l -> l.getUsuario().getId().equals(usuarioId))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lista não encontrada."));
    }
    private ItemListaCompra buscarItem(ListaCompra lista, Long itemId) {
        return lista.getItens().stream().filter(i -> i.getId().equals(itemId)).findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));
    }
    private void validarQuantidade(Integer quantidade) {
        if (quantidade == null || quantidade < 1 || quantidade > 999) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantidade deve ser de 1 a 999.");
    }
}
