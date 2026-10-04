package br.com.quantota.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.*;
@Entity @Table(name="colecoes") @Getter @Setter @NoArgsConstructor
public class Colecao {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @NotBlank @Size(max=100) private String titulo;
    @Size(max=250) private String descricao;
    private UUID imagemId;
    @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="colecao_produtos",joinColumns=@JoinColumn(name="colecao_id"))
    @Column(name="produto_id") private Set<Long> produtoIds=new LinkedHashSet<>();
    private boolean ativo=true;
    private int ordem;
}
