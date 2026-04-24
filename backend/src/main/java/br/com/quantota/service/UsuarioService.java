package br.com.quantota.service;

import br.com.quantota.dto.CadastroUsuarioDTO;
import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.exception.BusinessRuleException;
import br.com.quantota.exception.ResourceNotFoundException;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario cadastrar(CadastroUsuarioDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessRuleException("Já existe um usuário com esse email.");
        }

        PerfilUsuario perfil = dto.getPerfil() == null ? PerfilUsuario.USER : dto.getPerfil();
        boolean ativo = perfil != PerfilUsuario.VENDEDOR;

        Usuario usuario = Usuario.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senha(dto.getSenha())
                .telefone(dto.getTelefone())
                .perfil(perfil)
                .ativo(ativo)
                .build();

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    public List<Usuario> listarVendedores() {
        return usuarioRepository.findByPerfil(PerfilUsuario.VENDEDOR);
    }
}
