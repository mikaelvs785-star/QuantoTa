package br.com.quantota.model;

import jakarta.persistence.*;
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
    private String nome;

    private String categoria;
    private String unidadeMedida;
    private String marca;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false)
    private Boolean ativo;
}
