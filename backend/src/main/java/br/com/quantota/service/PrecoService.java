package br.com.quantota.service;

import br.com.quantota.dto.CadastroPrecoDTO;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.model.Preco;
import br.com.quantota.model.Produto;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.PrecoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PrecoService {

    private final PrecoRepository precoRepository;
    private final ProdutoService produtoService;
    private final MercadoService mercadoService;
    private final UsuarioService usuarioService;

    public PrecoService(PrecoRepository precoRepository,
                        ProdutoService produtoService,
                        MercadoService mercadoService,
                        UsuarioService usuarioService) {
        this.precoRepository = precoRepository;
        this.produtoService = produtoService;
        this.mercadoService = mercadoService;
        this.usuarioService = usuarioService;
    }

    public List<Preco> listarTodos() {
        return precoRepository.findAll();
    }

    public List<Preco> listarPorProduto(Long produtoId) {
        return precoRepository.findByProdutoIdOrderByValorAsc(produtoId);
    }

    public Preco salvar(CadastroPrecoDTO dto) {
        Produto produto = produtoService.buscarPorId(dto.getProdutoId());
        Mercado mercado = mercadoService.buscarPorId(dto.getMercadoId());
        Usuario usuario = usuarioService.buscarPorId(dto.getUsuarioCadastroId());

        validarPermissaoCadastro(usuario);

        Preco preco = Preco.builder()
                .produto(produto)
                .mercado(mercado)
                .usuarioCadastro(usuario)
                .valor(dto.getValor())
                .dataColeta(dto.getDataColeta())
                .observacao(dto.getObservacao())
                .dataCadastro(LocalDateTime.now())
                .dataAtualizacao(LocalDateTime.now())
                .build();

        return precoRepository.save(preco);
    }

    public Preco atualizar(Long id, CadastroPrecoDTO dto) {
        Preco preco = precoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Preço não encontrado."));

        Usuario usuario = usuarioService.buscarPorId(dto.getUsuarioCadastroId());
        validarPermissaoCadastro(usuario);

        preco.setValor(dto.getValor());
        preco.setDataColeta(dto.getDataColeta());
        preco.setObservacao(dto.getObservacao());
        preco.setProduto(produtoService.buscarPorId(dto.getProdutoId()));
        preco.setMercado(mercadoService.buscarPorId(dto.getMercadoId()));
        preco.setUsuarioCadastro(usuario);
        preco.setDataAtualizacao(LocalDateTime.now());

        return precoRepository.save(preco);
    }

    public void deletar(Long id) {
        precoRepository.deleteById(id);
    }

    public BigDecimal buscarMenorPreco(Long produtoId) {
        return precoRepository.buscarMenorPrecoPorProduto(produtoId).orElse(BigDecimal.ZERO);
    }

    private void validarPermissaoCadastro(Usuario usuario) {
        if (usuario.getPerfil() != PerfilUsuario.VENDEDOR && usuario.getPerfil() != PerfilUsuario.ADMIN) {
            throw new BusinessRuleException("Apenas vendedor aprovado ou ADMIN podem cadastrar preços.");
        }

        if (usuario.getPerfil() == PerfilUsuario.VENDEDOR && !Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new BusinessRuleException("Vendedor ainda não aprovado.");
        }
    }
}
