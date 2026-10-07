package br.com.quantota.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="inicio_conteudo") @Getter @Setter
public class InicioConteudo {
    @Id private Long id;
    @Column(nullable=false, columnDefinition="text") private String conteudo;
}
