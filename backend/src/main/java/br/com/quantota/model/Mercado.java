package br.com.quantota.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mercados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String endereco;
    private String bairro;
    private String cidade;
    private String estado;
    private String telefone;

    @Column(nullable = false)
    private Boolean ativo;
}
