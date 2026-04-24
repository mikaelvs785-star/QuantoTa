package br.com.quantota.controller;

import br.com.quantota.dto.CadastroUsuarioDTO;
import br.com.quantota.model.Usuario;
import br.com.quantota.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario cadastrar(@RequestBody CadastroUsuarioDTO usuario) {
        return usuarioService.cadastrar(usuario);
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/vendedores")
    public List<Usuario> listarVendedores() {
        return usuarioService.listarVendedores();
    }
}
