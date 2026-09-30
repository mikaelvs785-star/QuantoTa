package br.com.quantota.repository;

import br.com.quantota.model.Mercado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MercadoRepository extends JpaRepository<Mercado, Long> {
    List<Mercado> findByVendedorId(Long vendedorId);
    List<Mercado> findByAtivoTrue();
}
