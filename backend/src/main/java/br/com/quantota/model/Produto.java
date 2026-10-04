package br.com.quantota.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String nome;

    private String categoria;
    private String unidadeMedida;
    private String marca;
    // Grupo explícito de equivalência: não inferir por nome para comparar embalagens.
    private String grupoComparacao;
    @Column(precision = 12, scale = 3)
    private java.math.BigDecimal quantidadeMedida;
    private String tipoMedida;

    @Transient
    public java.math.BigDecimal getQuantidadeBase() {
        if (quantidadeMedida == null || quantidadeMedida.signum() <= 0 || tipoMedida == null) return null;
        return switch (tipoMedida) {
            case "G", "ML" -> quantidadeMedida.divide(java.math.BigDecimal.valueOf(1000));
            case "KG", "L", "UN" -> quantidadeMedida;
            default -> null;
        };
    }
    @Transient
    public String getUnidadeBase() {
        if (tipoMedida == null) return null;
        return switch (tipoMedida) { case "G", "KG" -> "kg"; case "ML", "L" -> "L"; case "UN" -> "un"; default -> null; };
    }

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false)
    private Boolean ativo;
}
