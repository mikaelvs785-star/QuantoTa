package br.com.quantota.dto;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.enums.StatusSolicitacao;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private Boolean ativo;
    private StatusSolicitacao statusSolicitacao;
    private String mensagem;
}
