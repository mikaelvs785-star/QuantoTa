package br.com.quantota.service;

import br.com.quantota.dto.CadastroUsuarioDTO;
import br.com.quantota.exception.ResourceNotFoundException;
import br.com.quantota.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UsuarioService {

    // 🔥 Simulação de banco em memória
    private final Map<Long, Usuario> usuarios = new HashMap<>();
    private Long sequence = 1L;

    // 📝 CADASTRAR USUÁRIO
    public Usuario cadastrar(CadastroUsuarioDTO dto) {

        Usuario usuario = new Usuario(
                sequence++,
                dto.getNome(),
                dto.getEmail()
        );

        usuarios.put(usuario.getId(), usuario);

        return usuario;
    }

    // 🔍 BUSCAR POR ID
    public Usuario buscarPorId(Long id) {

        Usuario usuario = usuarios.get(id);

        if (usuario == null) {
            throw new ResourceNotFoundException("Usuário não encontrado com ID: " + id);
        }

        return usuario;
    }

    // 📋 LISTAR TODOS
    public List<Usuario> listarTodos() {
        return new ArrayList<>(usuarios.values());
    }

    // ❌ DELETAR USUÁRIO
    public void deletar(Long id) {

        if (!usuarios.containsKey(id)) {
            throw new ResourceNotFoundException("Usuário não encontrado com ID: " + id);
        }

        usuarios.remove(id);
    }

    // ✏️ ATUALIZAR USUÁRIO
    public Usuario atualizar(Long id, CadastroUsuarioDTO dto) {

        Usuario usuario = buscarPorId(id);

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        return usuario;
    }
}