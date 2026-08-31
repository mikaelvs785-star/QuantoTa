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

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Usuario atualizar(
            @PathVariable Long id,
            @RequestBody CadastroUsuarioDTO usuario
    ) {
        return usuarioService.atualizar(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
    }

    @GetMapping("/vendedores")
    public List<Usuario> listarVendedores() {
        return usuarioService.listarVendedores();
    }
}