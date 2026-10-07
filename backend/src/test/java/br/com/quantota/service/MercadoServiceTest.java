package br.com.quantota.service;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.MercadoRepository;
import br.com.quantota.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MercadoServiceTest {
    private final MercadoRepository repository = mock(MercadoRepository.class);
    private final SessaoService sessao = mock(SessaoService.class);
    private final PermissaoService permissoes = new PermissaoService(sessao, mock(UsuarioRepository.class), repository);
    private final MercadoService service = new MercadoService(repository, permissoes, mock(ImagemService.class));
    private Mercado preparar(PerfilUsuario perfil, Long dono) {
        when(sessao.usuarioAtual()).thenReturn(Usuario.builder().id(10L).perfil(perfil).build());
        Mercado mercado = new Mercado(); mercado.setId(1L); mercado.setVendedorId(dono); mercado.setAtivo(true);
        when(repository.findById(1L)).thenReturn(Optional.of(mercado));
        return mercado;
    }
    @Test void vendedorDesativaProprioMercadoPreservandoHistorico() {
        Mercado mercado = preparar(PerfilUsuario.VENDEDOR, 10L);
        service.deletar(1L);
        assertFalse(mercado.getAtivo());
        verify(repository).save(mercado);
        verify(repository, never()).delete(any());
    }
    @Test void vendedorNaoDesativaMercadoDeOutro() {
        Mercado mercado = preparar(PerfilUsuario.VENDEDOR, 20L);
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.deletar(1L)).getStatusCode().value());
        assertTrue(mercado.getAtivo());
        verify(repository, never()).save(any());
    }
    @Test void adminPodeDesativarMercadoDeQualquerVendedor() {
        Mercado mercado = preparar(PerfilUsuario.ADMIN, 20L);
        service.deletar(1L);
        assertFalse(mercado.getAtivo());
        verify(repository).save(mercado);
    }
    @Test void clienteNaoDesativaMercado() {
        preparar(PerfilUsuario.USER, 10L);
        assertThrows(ResponseStatusException.class, () -> service.deletar(1L));
        verify(repository, never()).save(any());
    }
}
