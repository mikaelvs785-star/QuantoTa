package br.com.quantota.model;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
@Entity @Table(name="imagens") @Getter @Setter @NoArgsConstructor
public class Imagem {
    @Id private UUID id;
    private Long usuarioId;
    @Column(nullable=false) private String contentType;
    @Column(nullable=false, columnDefinition="bytea") @com.fasterxml.jackson.annotation.JsonIgnore private byte[] conteudo;
}
