package br.com.quantota.repository;
public interface ColecaoRepository extends org.springframework.data.jpa.repository.JpaRepository<br.com.quantota.model.Colecao,Long> {
    java.util.List<br.com.quantota.model.Colecao> findByAtivoTrueOrderByOrdemAscIdAsc();
}
