package br.com.quantota.service;

import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SessaoService {
    private final UsuarioRepository usuarios;
    public SessaoService(UsuarioRepository usuarios) { this.usuarios = usuarios; }
    public Usuario usuarioAtual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Entre na sua conta.");
        return usuarios.findByEmail(auth.getName()).filter(u -> Boolean.TRUE.equals(u.getAtivo()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sessão inválida."));
    }
}
