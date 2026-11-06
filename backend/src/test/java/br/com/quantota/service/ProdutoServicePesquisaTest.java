package br.com.quantota.service;

import br.com.quantota.model.Produto;
import br.com.quantota.repository.ProdutoRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProdutoServicePesquisaTest {
    private final ProdutoRepository repository = mock(ProdutoRepository.class);
    private final ProdutoService service = new ProdutoService(repository, mock(PermissaoService.class));

    @Test
    void encontraCafeMesmoSemAcento() {
        Produto cafe = new Produto();
        cafe.setNome("Café torrado e moído");
        cafe.setAtivo(true);
        when(repository.findByAtivoTrue()).thenReturn(List.of(cafe));

        assertEquals(List.of(cafe), service.buscarPorNome("cafe"));
        assertEquals(List.of(cafe), service.buscarPorNome("CAFÉ"));
    }

    @Test
    void naoRetornaProdutosSemCorrespondencia() {
        Produto cafe = new Produto();
        cafe.setNome("Café");
        when(repository.findByAtivoTrue()).thenReturn(List.of(cafe));

        assertEquals(List.of(), service.buscarPorNome("arroz"));
    }
}
