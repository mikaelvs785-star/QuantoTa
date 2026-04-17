package br.com.quantota.service;

import br.com.quantota.model.Mercado;
import br.com.quantota.repository.MercadoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MercadoService {

    private final MercadoRepository mercadoRepository;

    public MercadoService(MercadoRepository mercadoRepository) {
        this.mercadoRepository = mercadoRepository;
    }

    public List<Mercado> listarAtivos() {
        return mercadoRepository.findByAtivoTrue();
    }

    public Mercado buscarPorId(Long id) {
        return mercadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mercado não encontrado."));
    }

    public Mercado salvar(Mercado mercado) {
        if (mercado.getAtivo() == null) {
            mercado.setAtivo(true);
        }
        return mercadoRepository.save(mercado);
    }

    public Mercado atualizar(Long id, Mercado novoMercado) {
        Mercado mercado = buscarPorId(id);
        mercado.setNome(novoMercado.getNome());
        mercado.setEndereco(novoMercado.getEndereco());
        mercado.setBairro(novoMercado.getBairro());
        mercado.setCidade(novoMercado.getCidade());
        mercado.setEstado(novoMercado.getEstado());
        mercado.setTelefone(novoMercado.getTelefone());
        mercado.setAtivo(novoMercado.getAtivo());
        return mercadoRepository.save(mercado);
    }

    public void deletar(Long id) {
        mercadoRepository.deleteById(id);
    }
}
