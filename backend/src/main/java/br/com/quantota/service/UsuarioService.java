package br.com.quantota.service;

import br.com.quantota.dto.CadastroUsuarioDTO;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.exception.ResourceNotFoundException;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class UsuarioService {

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessaoService sessao;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, SessaoService sessao) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessao = sessao;
    }

    public Usuario cadastrar(CadastroUsuarioDTO dto) { return criar(dto, PerfilUsuario.USER); }

    public Usuario cadastrarAdministrativamente(CadastroUsuarioDTO dto) {
        if (sessao.usuarioAtual().getPerfil() != PerfilUsuario.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para cadastrar usuários.");
        return criar(dto, dto.getPerfil() == null ? PerfilUsuario.USER : dto.getPerfil());
    }

    private Usuario criar(CadastroUsuarioDTO dto, PerfilUsuario perfil) {
        String email = dto.getEmail().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome().trim())
                .email(email)
                .senha(passwordEncoder.encode(dto.getSenha()))
                .perfil(perfil)
                .ativo(true)
                .dataCriacao(LocalDateTime.now())
                .build();

        return usuarioRepository.save(usuario);
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> listarVendedores() {
        return usuarioRepository.findByPerfil(PerfilUsuario.VENDEDOR).stream().filter(u -> Boolean.TRUE.equals(u.getAtivo())).toList();
    }

    @org.springframework.transaction.annotation.Transactional
    public void deletar(Long id) {
        Usuario admin = sessao.usuarioAtual();
        if (admin.getPerfil() != PerfilUsuario.ADMIN)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas administradores podem excluir usuários.");
        Usuario usuario = buscarPorId(id);
        impedirAlteracaoDeAdministrador(usuario);
        entityManager.createQuery("select l from ListaCompra l where l.usuario.id = :id", br.com.quantota.model.ListaCompra.class)
                .setParameter("id", id).getResultList().forEach(entityManager::remove);
        entityManager.flush();
        entityManager.createQuery("update Preco p set p.usuarioCadastro = null where p.usuarioCadastro.id = :id")
                .setParameter("id", id).executeUpdate();
        entityManager.createQuery("update Mercado m set m.vendedorId = null, m.ativo = false where m.vendedorId = :id")
                .setParameter("id", id).executeUpdate();
        entityManager.createQuery("update Imagem i set i.usuarioId = :admin where i.usuarioId = :id")
                .setParameter("admin", admin.getId()).setParameter("id", id).executeUpdate();
        usuarioRepository.delete(usuario);
    }

    public Usuario atualizar(Long id, CadastroUsuarioDTO dto) {
        Usuario usuario = buscarPorId(id);
        impedirAlteracaoDeAdministrador(usuario);
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        return usuarioRepository.save(usuario);
    }

    private void impedirAlteracaoDeAdministrador(Usuario usuario) {
        if (usuario.getPerfil() == PerfilUsuario.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A conta administradora é imutável");
        }
    }
}
