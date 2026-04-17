package br.com.quantota.service;

import br.com.quantota.model.Mercado;
import br.com.quantota.model.Preco;
import br.com.quantota.model.Produto;
import br.com.quantota.repository.PrecoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PrecoService {

    private final PrecoRepository precoRepository;
    private final ProdutoService produtoService;
    private final MercadoService mercadoService;

    public PrecoService(PrecoRepository precoRepository, ProdutoService produtoService, MercadoService mercadoService) {
        this.precoRepository = precoRepository;
        this.produtoService = produtoService;
        this.mercadoService = mercadoService;
    }

    public List<Preco> listarTodos() {
        return precoRepository.findAll();
    }

    public List<Preco> listarPorProduto(Long produtoId) {
        return precoRepository.findByProdutoIdOrderByValorAsc(produtoId);
    }

    public Preco salvar(Preco preco) {
        Produto produto = produtoService.buscarPorId(preco.getProduto().getId());
        Mercado mercado = mercadoService.buscarPorId(preco.getMercado().getId());
        preco.setProduto(produto);
        preco.setMercado(mercado);
        return precoRepository.save(preco);
    }

    public Preco atualizar(Long id, Preco novoPreco) {
        Preco preco = precoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Preço não encontrado."));
        preco.setValor(novoPreco.getValor());
        preco.setDataColeta(novoPreco.getDataColeta());
        preco.setObservacao(novoPreco.getObservacao());
        if (novoPreco.getProduto() != null && novoPreco.getProduto().getId() != null) {
            preco.setProduto(produtoService.buscarPorId(novoPreco.getProduto().getId()));
        }
        if (novoPreco.getMercado() != null && novoPreco.getMercado().getId() != null) {
            preco.setMercado(mercadoService.buscarPorId(novoPreco.getMercado().getId()));
        }
        return precoRepository.save(preco);
    }

    public void deletar(Long id) {
        precoRepository.deleteById(id);
    }

    public BigDecimal buscarMenorPreco(Long produtoId) {
        return precoRepository.buscarMenorPrecoPorProduto(produtoId).orElse(BigDecimal.ZERO);
    }
}
