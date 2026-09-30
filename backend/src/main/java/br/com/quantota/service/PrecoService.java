package br.com.quantota.service;

import br.com.quantota.dto.CadastroPrecoDTO;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.model.Preco;
import br.com.quantota.model.Produto;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.PrecoRepository;
import org.springframework.stereotype.Service;
import br.com.quantota.exception.BusinessRuleException;
import br.com.quantota.exception.ResourceNotFoundException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrecoService {

    private final PrecoRepository precoRepository;
    private final ProdutoService produtoService;
    private final MercadoService mercadoService;
    private final SessaoService sessaoService;

    public PrecoService(PrecoRepository precoRepository,
                        ProdutoService produtoService,
                        MercadoService mercadoService,
                        SessaoService sessaoService) {
        this.precoRepository = precoRepository;
        this.produtoService = produtoService;
        this.mercadoService = mercadoService;
        this.sessaoService = sessaoService;
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
        Usuario usuario = sessaoService.usuarioAtual();

        validarPermissaoCadastro(usuario);
        validarPreco(dto);

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

        Usuario usuario = sessaoService.usuarioAtual();
        validarPermissaoCadastro(usuario);
        validarPreco(dto);

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

    public Optional<BigDecimal> buscarMenorPrecoDisponivel(Long produtoId) {
        return precoRepository.buscarPrecosAtuaisPorProduto(produtoId).stream().map(Preco::getValor).findFirst();
    }
    private void validarPreco(CadastroPrecoDTO dto) {
        if (dto.getValor() == null || dto.getValor().signum() <= 0 || dto.getValor().scale() > 2 || dto.getValor().compareTo(new BigDecimal("99999999.99")) > 0)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um preço positivo com até duas casas decimais.");
        if (dto.getDataColeta() == null || dto.getDataColeta().isAfter(java.time.LocalDate.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma data de coleta válida, não futura.");
        if (!Boolean.TRUE.equals(produtoService.buscarPorId(dto.getProdutoId()).getAtivo()) || !Boolean.TRUE.equals(mercadoService.buscarPorId(dto.getMercadoId()).getAtivo()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto e mercado precisam estar ativos.");
    }

    private void validarPermissaoCadastro(Usuario usuario) {
        if (usuario.getPerfil() != PerfilUsuario.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente administradores podem gerenciar preços.");
        }
    }
}
