package br.com.quantota.service;

import br.com.quantota.dto.CadastroVendedorDTO;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoVendedorService {

    public void criarSolicitacao(CadastroVendedorDTO dto) {

        // 🔥 Simulação (depois vira banco)
        System.out.println("==== NOVA SOLICITAÇÃO DE VENDEDOR ====");
        System.out.println("Nome: " + dto.getNome());
        System.out.println("Email: " + dto.getEmail());
        System.out.println("======================================");
    }
}
