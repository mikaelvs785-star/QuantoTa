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

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario cadastrar(CadastroUsuarioDTO dto) {
    if (usuarioRepository.existsByEmail(dto.getEmail())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "E-mail já cadastrado"
        );
    }

    if (dto.getPerfil() == PerfilUsuario.ADMIN) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Não é permitido criar outro administrador"
        );
    }

    Usuario usuario = Usuario.builder()
            .nome(dto.getNome())
            .email(dto.getEmail())
            .senha(passwordEncoder.encode(dto.getSenha()))
            .perfil(dto.getPerfil() != null
                    ? dto.getPerfil()
                    : PerfilUsuario.USER)
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
        return usuarioRepository.findByPerfil(PerfilUsuario.VENDEDOR);
    }

    public void deletar(Long id) {
        Usuario usuario = buscarPorId(id);
        impedirAlteracaoDeAdministrador(usuario);
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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "A conta administradora Ã© imutÃ¡vel");
        }
    }
}
