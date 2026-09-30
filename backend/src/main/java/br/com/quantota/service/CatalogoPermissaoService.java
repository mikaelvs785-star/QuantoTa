package br.com.quantota.service;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Mercado;
import br.com.quantota.repository.MercadoRepository;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CatalogoPermissaoService {
    private final SessaoService sessao;
    private final UsuarioRepository usuarios;
    private final MercadoRepository mercados;
    public CatalogoPermissaoService(SessaoService sessao, UsuarioRepository usuarios, MercadoRepository mercados) {
        this.sessao = sessao; this.usuarios = usuarios; this.mercados = mercados;
    }
    public record Permissoes(boolean gerenciarProdutos, boolean criarMercado, boolean excluirMercados,
                             boolean gerenciarTodosMercados, List<Long> mercadosEditaveis) {}
    public Permissoes consultar() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken || !auth.isAuthenticated())
            return new Permissoes(false, false, false, false, List.of());
        var usuario = sessao.usuarioAtual();
        boolean admin = usuario.getPerfil() == PerfilUsuario.ADMIN;
        boolean vendedor = usuario.getPerfil() == PerfilUsuario.VENDEDOR;
        var ids = vendedor ? mercados.findByVendedorId(usuario.getId()).stream().map(Mercado::getId).toList() : List.<Long>of();
        return new Permissoes(admin, admin || vendedor, admin, admin, ids);
    }
    public void exigirAdmin() {
        if (sessao.usuarioAtual().getPerfil() != PerfilUsuario.ADMIN) negar();
    }
    public void exigirEdicaoMercado(Mercado mercado) {
        var usuario = sessao.usuarioAtual();
        if (usuario.getPerfil() != PerfilUsuario.ADMIN &&
            (usuario.getPerfil() != PerfilUsuario.VENDEDOR || !usuario.getId().equals(mercado.getVendedorId()))) negar();
    }
    public void prepararNovoMercado(Mercado mercado) {
        var usuario = sessao.usuarioAtual();
        mercado.setId(null);
        if (usuario.getPerfil() == PerfilUsuario.VENDEDOR) {
            mercado.setVendedorId(usuario.getId());
            mercado.setAtivo(true);
        } else {
            exigirAdmin(); validarVendedor(mercado.getVendedorId());
        }
    }
    public void aplicarVendedor(Mercado mercado, Mercado entrada) {
        if (sessao.usuarioAtual().getPerfil() == PerfilUsuario.ADMIN) {
            validarVendedor(entrada.getVendedorId());
            mercado.setVendedorId(entrada.getVendedorId());
            mercado.setAtivo(entrada.getAtivo() == null ? true : entrada.getAtivo());
        } else if (!Boolean.TRUE.equals(mercado.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Mercado inativo: solicite a reativação ao administrador.");
        }
    }
    private void validarVendedor(Long id) {
        if (id != null && usuarios.findById(id).filter(u -> Boolean.TRUE.equals(u.getAtivo()) && u.getPerfil() == PerfilUsuario.VENDEDOR).isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecione um vendedor ativo.");
    }
    private void negar() { throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para esta ação no catálogo."); }
}
