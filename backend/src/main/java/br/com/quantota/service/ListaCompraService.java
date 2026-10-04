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
    private final br.com.quantota.repository.MercadoRepository mercados;
    public ListaCompraService(ListaCompraRepository listas, ItemListaCompraRepository itens, SessaoService sessao, ProdutoService produtos, PrecoService precos, br.com.quantota.repository.MercadoRepository mercados) {
        this.mercados=mercados;
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
        var atuais=precos.listarAtuais();
        var porProduto=atuais.stream().collect(java.util.stream.Collectors.groupingBy(p -> p.getProduto().getId()));
        BigDecimal total = BigDecimal.ZERO;
        int semPreco = 0;
        var estimativas = new java.util.ArrayList<ListaCompraResumoDTO.ItemEstimativa>();
        var mercadosUsados=new java.util.HashSet<Long>();
        for (var item : lista.getItens()) {
            var ofertas = porProduto.getOrDefault(item.getProduto().getId(),List.of());
            if (ofertas.isEmpty()) {
                semPreco++;
                estimativas.add(new ListaCompraResumoDTO.ItemEstimativa(item.getId(), null, null, null, null, null, null, null, null));
            } else {
                var oferta = ofertas.get(0);
                var subtotal = oferta.getValor().multiply(BigDecimal.valueOf(item.getQuantidade()));
                total = total.add(subtotal); mercadosUsados.add(oferta.getMercado().getId());
                estimativas.add(new ListaCompraResumoDTO.ItemEstimativa(item.getId(), oferta.getValor(), subtotal,
                        oferta.getMercado().getId(), oferta.getMercado().getNome(), oferta.getImagemId(), oferta.getPrecoPorMedida(), oferta.getUnidadeBase(), oferta.getDataColeta()));
            }
        }
        var totais=new java.util.ArrayList<ListaCompraResumoDTO.TotalMercado>();
        if (!lista.getItens().isEmpty()) for (var mercado:mercados.findByAtivoTrue()) {
            var linhas=new java.util.ArrayList<ListaCompraResumoDTO.ItemMercado>();
            var faltantes=new java.util.ArrayList<String>();
            var subtotal=BigDecimal.ZERO;
            for(var item:lista.getItens()) {
                var oferta=porProduto.getOrDefault(item.getProduto().getId(),List.of()).stream().filter(p -> p.getMercado().getId().equals(mercado.getId())).findFirst();
                if(oferta.isEmpty()) {
                    faltantes.add(item.getProduto().getNome()+" · "+java.util.Objects.toString(item.getProduto().getUnidadeMedida(),""));
                    linhas.add(new ListaCompraResumoDTO.ItemMercado(item.getId(),item.getProduto().getNome(),item.getQuantidade(),null,null,null));
                } else {
                    var p=oferta.get(); var valor=p.getValor().multiply(BigDecimal.valueOf(item.getQuantidade())); subtotal=subtotal.add(valor);
                    linhas.add(new ListaCompraResumoDTO.ItemMercado(item.getId(),item.getProduto().getNome(),item.getQuantidade(),p.getValor(),valor,p.getDataColeta()));
                }
            }
            totais.add(new ListaCompraResumoDTO.TotalMercado(mercado.getId(),mercado.getNome(),mercado.getImagemId(),subtotal,
                faltantes.isEmpty(),lista.getItens().size()-faltantes.size(),faltantes,linhas));
        }
        totais.sort(java.util.Comparator.comparing(ListaCompraResumoDTO.TotalMercado::completa).reversed()
            .thenComparing(ListaCompraResumoDTO.TotalMercado::subtotal).thenComparing(ListaCompraResumoDTO.TotalMercado::mercadoId));
        var melhor=totais.stream().filter(ListaCompraResumoDTO.TotalMercado::completa).findFirst();
        var resumo = ListaCompraResumoDTO.fromEntity(lista, total);
        resumo.setEstimativas(estimativas); resumo.setMercados(totais); resumo.setQuantidadeMercados(mercadosUsados.size());
        resumo.setMercadoMaisBaratoId(melhor.map(ListaCompraResumoDTO.TotalMercado::mercadoId).orElse(null));
        var combinado=total;
        resumo.setDiferencaCompraDividida(semPreco==0 ? melhor.map(m -> m.subtotal().subtract(combinado)).orElse(null) : null);
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
