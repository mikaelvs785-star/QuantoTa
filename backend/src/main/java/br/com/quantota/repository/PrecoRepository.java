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
        select p from Preco p
        where p.produto.id = :produtoId
          and p.produto.ativo = true and p.mercado.ativo = true
          and p.valor > 0
          and not exists (
            select newer.id from Preco newer
            where newer.produto.id = p.produto.id and newer.mercado.id = p.mercado.id
              and (newer.dataColeta > p.dataColeta or (newer.dataColeta = p.dataColeta and newer.id > p.id))
          )
        order by p.valor asc
        """)
    List<Preco> buscarPrecosAtuaisPorProduto(Long produtoId);

    @Query("""
        select p from Preco p
        where p.produto.ativo = true and p.mercado.ativo = true
          and p.valor > 0
          and not exists (
            select newer.id from Preco newer
            where newer.produto.id = p.produto.id and newer.mercado.id = p.mercado.id
              and (newer.dataColeta > p.dataColeta or (newer.dataColeta = p.dataColeta and newer.id > p.id))
          )
        order by p.valor asc
        """)
    List<Preco> buscarPrecosAtuais();

    @Query("""
            select p
            from Preco p
            where p.mercado.id = :mercadoId
            order by p.dataColeta desc
            """)
    List<Preco> findByMercadoIdOrderByDataColetaDesc(Long mercadoId);
}
