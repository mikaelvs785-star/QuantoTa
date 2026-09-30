package br.com.quantota.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class CadastroListaDTO {
    @NotBlank @Size(max = 100) private String nomeLista;
}
