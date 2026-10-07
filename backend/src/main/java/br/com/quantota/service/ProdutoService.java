package br.com.quantota.service;

import br.com.quantota.model.Produto;
import br.com.quantota.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import br.com.quantota.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    private final PermissaoService permissoes;
    public ProdutoService(ProdutoRepository produtoRepository, PermissaoService permissoes) {
        this.produtoRepository = produtoRepository;
        this.permissoes = permissoes;
    }

    public List<Produto> listarGestao() {
        Long vendedorId = permissoes.vendedorAtualId();
        return vendedorId == null ? produtoRepository.findAll() : produtoRepository.findOfertadosPorVendedor(vendedorId);
    }

    public List<Produto> listarTodos() { return produtoRepository.findAll(); }

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
        permissoes.exigirAdmin();
        validarMedida(produto);
        produto.setId(null);
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto novoProduto) {
        permissoes.exigirAdmin();
        validarMedida(novoProduto);
        Produto produto = buscarPorId(id);
        produto.setQuantidadeMedida(novoProduto.getQuantidadeMedida());
        produto.setTipoMedida(novoProduto.getTipoMedida());
        produto.setGrupoComparacao(novoProduto.getGrupoComparacao());
        produto.setNome(novoProduto.getNome());
        produto.setCategoria(novoProduto.getCategoria());
        produto.setUnidadeMedida(novoProduto.getUnidadeMedida());
        produto.setMarca(novoProduto.getMarca());
        produto.setDescricao(novoProduto.getDescricao());
        produto.setAtivo(novoProduto.getAtivo());
        return produtoRepository.save(produto);
    }

    private void validarMedida(Produto p) {
        if (p.getGrupoComparacao() != null) p.setGrupoComparacao(p.getGrupoComparacao().trim());
        if (p.getQuantidadeMedida() == null && (p.getTipoMedida() == null || p.getTipoMedida().isBlank())) {
            p.setTipoMedida(null); return;
        }
        if (p.getQuantidadeMedida() == null || p.getQuantidadeMedida().signum() <= 0
                || p.getQuantidadeMedida().scale() > 3 || p.getQuantidadeMedida().compareTo(new java.math.BigDecimal("999999999")) > 0
                || p.getTipoMedida() == null || !java.util.Set.of("G", "KG", "ML", "L", "UN").contains(p.getTipoMedida())
                || ("UN".equals(p.getTipoMedida()) && p.getQuantidadeMedida().stripTrailingZeros().scale() > 0))
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Informe uma medida positiva e a unidade correta (g, kg, ml, L ou un). Unidades devem ser inteiras.");
        p.setUnidadeMedida(p.getQuantidadeMedida().stripTrailingZeros().toPlainString().replace('.', ',') + " " + p.getTipoMedida().toLowerCase());
    }

    public void deletar(Long id) {
        permissoes.exigirAdmin();
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }
}
