package br.com.quantota.service;

import br.com.quantota.model.Mercado;
import br.com.quantota.repository.MercadoRepository;
import org.springframework.stereotype.Service;
import br.com.quantota.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class MercadoService {

    private final MercadoRepository mercadoRepository;

    private final PermissaoService permissoes;
    private final ImagemService imagens;
    public MercadoService(MercadoRepository mercadoRepository, PermissaoService permissoes, ImagemService imagens) {
        this.imagens=imagens;
        this.mercadoRepository = mercadoRepository;
        this.permissoes = permissoes;
    }

    public void exigirAdmin() { permissoes.exigirAdmin(); }

    public List<Mercado> listarTodos() { return mercadoRepository.findAll(); }

    public List<Mercado> listarAtivos() {
        return mercadoRepository.findByAtivoTrue();
    }

    public Mercado buscarPorId(Long id) {
        return mercadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mercado não encontrado."));
    }

    public Mercado salvar(Mercado mercado) {
        permissoes.prepararNovoMercado(mercado);
        imagens.validarVinculo(mercado.getImagemId(),null);
        if (mercado.getAtivo() == null) {
            mercado.setAtivo(true);
        }
        return mercadoRepository.save(mercado);
    }

    public Mercado atualizar(Long id, Mercado novoMercado) {
        Mercado mercado = buscarPorId(id);
        permissoes.exigirEdicaoMercado(mercado);
        permissoes.aplicarVendedor(mercado, novoMercado);
        imagens.validarVinculo(novoMercado.getImagemId(),mercado.getImagemId());
        mercado.setImagemId(novoMercado.getImagemId());
        mercado.setNome(novoMercado.getNome());
        mercado.setEndereco(novoMercado.getEndereco());
        mercado.setBairro(novoMercado.getBairro());
        mercado.setCidade(novoMercado.getCidade());
        mercado.setEstado(novoMercado.getEstado());
        mercado.setTelefone(novoMercado.getTelefone());
        return mercadoRepository.save(mercado);
    }

    public void deletar(Long id) {
        permissoes.exigirAdmin();
        Mercado mercado = buscarPorId(id);
        mercado.setAtivo(false);
        mercadoRepository.save(mercado);
    }
}
