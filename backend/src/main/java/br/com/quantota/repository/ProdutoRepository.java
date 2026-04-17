package br.com.quantota.repository;

import br.com.quantota.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByAtivoTrue();
    List<Produto> findByAtivoTrueAndNomeContainingIgnoreCase(String nome);
}
