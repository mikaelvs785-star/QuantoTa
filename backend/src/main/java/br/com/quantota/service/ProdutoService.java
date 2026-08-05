package br.com.quantota.service;

import br.com.quantota.model.Produto;
import br.com.quantota.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import br.com.quantota.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
    }

    public List<Produto> buscarPorNome(String nome) {
        return produtoRepository.findByAtivoTrueAndNomeContainingIgnoreCase(nome);
    }

    public Produto salvar(Produto produto) {
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto novoProduto) {
        Produto produto = buscarPorId(id);
        produto.setNome(novoProduto.getNome());
        produto.setCategoria(novoProduto.getCategoria());
        produto.setUnidadeMedida(novoProduto.getUnidadeMedida());
        produto.setMarca(novoProduto.getMarca());
        produto.setDescricao(novoProduto.getDescricao());
        produto.setAtivo(novoProduto.getAtivo());
        return produtoRepository.save(produto);
    }

    public void deletar(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }
}
