package br.com.quantota.dto;

import br.com.quantota.enums.PerfilUsuario;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private PerfilUsuario perfil;
    private String mensagem;
}
