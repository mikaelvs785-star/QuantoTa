package br.com.quantota.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
@Data
public class CadastroItemListaDTO {
    @NotNull @Positive private Long produtoId;
    @NotNull @Min(1) @Max(999) private Integer quantidade;
}
