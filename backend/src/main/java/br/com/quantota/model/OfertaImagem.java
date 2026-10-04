package br.com.quantota.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="oferta_imagens", uniqueConstraints=@UniqueConstraint(columnNames={"produto_id","mercado_id"}))
@Getter @Setter @NoArgsConstructor
public class OfertaImagem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="produto_id",nullable=false) private Long produtoId;
    @Column(name="mercado_id",nullable=false) private Long mercadoId;
    private java.util.UUID imagemId;
}
