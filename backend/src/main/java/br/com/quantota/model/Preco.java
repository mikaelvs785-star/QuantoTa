package br.com.quantota.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

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

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate dataColeta;

    private String observacao;
}
