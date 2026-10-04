package br.com.quantota.repository;
import br.com.quantota.model.OfertaImagem;
import java.util.Optional;
public interface OfertaImagemRepository extends org.springframework.data.jpa.repository.JpaRepository<OfertaImagem,Long> {
    Optional<OfertaImagem> findByProdutoIdAndMercadoId(Long produtoId,Long mercadoId);
}
