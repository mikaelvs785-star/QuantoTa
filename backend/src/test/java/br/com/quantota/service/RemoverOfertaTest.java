package br.com.quantota.service;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.model.Produto;
import br.com.quantota.model.Usuario;
import br.com.quantota.model.OfertaImagem;
import br.com.quantota.repository.*;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RemoverOfertaTest {
    private final PrecoRepository precos = mock(PrecoRepository.class);
    private final OfertaImagemRepository fotos = mock(OfertaImagemRepository.class);
    private final ProdutoService produtos = mock(ProdutoService.class);
    private final MercadoService mercados = mock(MercadoService.class);
    private final SessaoService sessao = mock(SessaoService.class);
    private final PermissaoService permissoes = new PermissaoService(sessao, mock(UsuarioRepository.class), mock(MercadoRepository.class));
    private final PrecoService service = new PrecoService(precos, produtos, mercados, sessao, permissoes, fotos, mock(ImagemService.class));
    private void preparar(Long dono) {
        when(sessao.usuarioAtual()).thenReturn(Usuario.builder().id(10L).perfil(PerfilUsuario.VENDEDOR).build());
        Mercado mercado = new Mercado(); mercado.setVendedorId(dono);
        when(mercados.buscarPorId(1L)).thenReturn(mercado);
        when(produtos.buscarPorId(2L)).thenReturn(new Produto());
    }
    @Test void removeTodoHistoricoEApenasFotoDoParAutorizado() {
        preparar(10L);
        OfertaImagem foto = new OfertaImagem();
        when(fotos.findByProdutoIdAndMercadoId(2L, 1L)).thenReturn(Optional.of(foto));
        service.removerProdutoDoMercado(1L, 2L);
        verify(precos).deleteByProdutoIdAndMercadoId(2L, 1L);
        verify(fotos).delete(foto);
        verify(produtos, never()).deletar(anyLong());
    }
    @Test void naoRemoveDadosDeOutroVendedor() {
        preparar(20L);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.removerProdutoDoMercado(1L, 2L)).getStatusCode().value());
        verifyNoInteractions(precos, fotos);
    }
}
