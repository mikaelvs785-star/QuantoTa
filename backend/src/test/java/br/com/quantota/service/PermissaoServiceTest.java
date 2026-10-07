package br.com.quantota.service;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.MercadoRepository;
import br.com.quantota.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PermissaoServiceTest {
    private final SessaoService sessao = mock(SessaoService.class);
    private final PermissaoService permissoes = new PermissaoService(sessao, mock(UsuarioRepository.class), mock(MercadoRepository.class));
    private void usuario(PerfilUsuario perfil, Long id) {
        when(sessao.usuarioAtual()).thenReturn(Usuario.builder().id(id).perfil(perfil).build());
    }
    @Test void vendedorSoEditaSeuMercado() {
        usuario(PerfilUsuario.VENDEDOR, 10L);
        Mercado proprio = new Mercado(); proprio.setVendedorId(10L); proprio.setAtivo(true);
        Mercado outro = new Mercado(); outro.setVendedorId(20L); outro.setAtivo(true);
        assertDoesNotThrow(() -> permissoes.exigirEdicaoPreco(proprio));
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> permissoes.exigirEdicaoPreco(outro)).getStatusCode().value());
        assertEquals(10L, permissoes.vendedorAtualId());
    }
    @Test void clienteNaoAcessaGestao() {
        usuario(PerfilUsuario.USER, 30L);
        assertThrows(ResponseStatusException.class, permissoes::vendedorAtualId);
    }
    @Test void adminMantemAcessoCompleto() {
        usuario(PerfilUsuario.ADMIN, 1L);
        assertNull(permissoes.vendedorAtualId());
        assertDoesNotThrow(() -> permissoes.exigirEdicaoMercado(new Mercado()));
    }
    @Test void vendedorNaoEscolheOutroDonoAoCriarMercado() {
        usuario(PerfilUsuario.VENDEDOR, 10L);
        Mercado mercado = new Mercado(); mercado.setVendedorId(20L);
        permissoes.prepararNovoMercado(mercado);
        assertEquals(10L, mercado.getVendedorId());
    }
}
