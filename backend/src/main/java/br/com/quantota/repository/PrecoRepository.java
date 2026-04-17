package br.com.quantota.repository;

import br.com.quantota.model.Preco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface PrecoRepository extends JpaRepository<Preco, Long> {
    List<Preco> findByProdutoIdOrderByValorAsc(Long produtoId);

    @Query("""
            select min(p.valor)
            from Preco p
            where p.produto.id = :produtoId
              and p.produto.ativo = true
              and p.mercado.ativo = true
            """)
    Optional<BigDecimal> buscarMenorPrecoPorProduto(Long produtoId);
}
