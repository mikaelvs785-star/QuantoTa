package br.com.quantota.repository;

import br.com.quantota.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @org.springframework.data.jpa.repository.Query("select distinct p.produto from Preco p where p.mercado.vendedorId = :vendedorId")
    List<Produto> findOfertadosPorVendedor(Long vendedorId);
    List<Produto> findByAtivoTrue();
    List<Produto> findByAtivoTrueAndNomeContainingIgnoreCase(String nome);
}
