package br.com.quantota.repository;

import br.com.quantota.model.ListaCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

public interface ListaCompraRepository extends JpaRepository<ListaCompra, Long> {
    @EntityGraph(attributePaths = {"itens", "itens.produto"})
    List<ListaCompra> findByUsuarioId(Long usuarioId);
}
