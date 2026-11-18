package br.com.quantota.service;

import br.com.quantota.model.Produto;
import br.com.quantota.repository.ProdutoRepository;
import br.com.quantota.repository.PrecoRepository;
import org.springframework.stereotype.Service;
import br.com.quantota.exception.ResourceNotFoundException;
import br.com.quantota.enums.PerfilUsuario;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final PrecoRepository precos;
    private final ImagemService imagens;
    private final SessaoService sessao;
    private final PermissaoService permissoes;

    public ProdutoService(ProdutoRepository produtoRepository, PermissaoService permissoes,
                          PrecoRepository precos, ImagemService imagens, SessaoService sessao) {
        this.produtoRepository = produtoRepository;
        this.permissoes = permissoes;
        this.precos = precos;
        this.imagens = imagens;
        this.sessao = sessao;
    }

    public List<Produto> listarGestao() {
        Long vendedorId = permissoes.vendedorAtualId();
        return vendedorId == null ? produtoRepository.findAll() : produtoRepository.findOfertadosPorVendedor(vendedorId);
    }

    public List<Produto> listarTodos() { return produtoRepository.findAll(); }
    public List<Produto> listarAtivos() { return produtoRepository.findByAtivoTrue(); }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
    }

    public List<Produto> buscarPorNome(String nome) {
        String termo = normalizarPesquisa(nome);
        return produtoRepository.findByAtivoTrue().stream()
                .filter(produto -> normalizarPesquisa(produto.getNome()).contains(termo))
                .toList();
    }

    private static String normalizarPesquisa(String texto) {
        if (texto == null) return "";
        String semAcentos = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "");
        return semAcentos.toLowerCase(Locale.ROOT);
    }

    public Produto salvar(Produto produto) {
        permissoes.exigirAdmin();
        validarMedida(produto);
        produto.setId(null);
        if (produto.getAtivo() == null) produto.setAtivo(true);
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

    public Produto atualizarImagemComoVendedor(Long id, UUID imagemId) {
        var usuario = sessao.usuarioAtual();
        if (usuario.getPerfil() != PerfilUsuario.VENDEDOR) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Somente vendedores podem alterar a imagem do produto.");
        }
        Produto produto = buscarPorId(id);
        if (!precos.existsByProdutoIdAndMercadoVendedorId(id, usuario.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "Você só pode alterar imagens de produtos ofertados em seus mercados.");
        }
        if (imagemId != null) imagens.validarVinculo(imagemId, produto.getImagemId());
        produto.setImagemId(imagemId);
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
