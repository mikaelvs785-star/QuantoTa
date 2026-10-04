package br.com.quantota.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "precos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "mercado_id")
    private Mercado mercado;

    @ManyToOne
    @JoinColumn(name = "usuario_cadastro_id")
    @JsonIgnore
    private Usuario usuarioCadastro;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate dataColeta;

    private String observacao;
    @Transient private java.util.UUID imagemId;
    @Transient public BigDecimal getPrecoPorMedida() {
        var base=produto == null ? null : produto.getQuantidadeBase();
        return base == null || valor == null ? null : valor.divide(base, 4, java.math.RoundingMode.HALF_UP);
    }
    @Transient public String getUnidadeBase() { return produto == null ? null : produto.getUnidadeBase(); }


    private LocalDateTime dataCadastro;
    private LocalDateTime dataAtualizacao;
}
