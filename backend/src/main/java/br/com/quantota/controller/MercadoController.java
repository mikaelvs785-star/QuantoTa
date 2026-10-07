package br.com.quantota.controller;

import br.com.quantota.model.Mercado;
import br.com.quantota.service.MercadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/mercados")
public class MercadoController {

    private final MercadoService mercadoService;

    public MercadoController(MercadoService mercadoService) {
        this.mercadoService = mercadoService;
    }

    @GetMapping("/gestao")
    public List<Mercado> gestao() { return mercadoService.listarGestao(); }

    @GetMapping
    public List<Mercado> listar(Authentication auth) {
        boolean admin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return admin ? mercadoService.listarTodos() : mercadoService.listarAtivos();
    }

    @GetMapping("/{id}")
    public Mercado buscarPorId(@PathVariable Long id) {
        return mercadoService.buscarPorId(id);
    }

    @GetMapping("/{id}/vendedor")
    public java.util.Map<String, Object> vendedor(@PathVariable Long id) {
        mercadoService.exigirAdmin();
        Long vendedor = mercadoService.buscarPorId(id).getVendedorId();
        return java.util.Map.of("vendedorId", vendedor == null ? "" : vendedor);
    }

    @PostMapping
    public Mercado salvar(@Valid @RequestBody Mercado mercado) {
        return mercadoService.salvar(mercado);
    }

    @PutMapping("/{id}")
    public Mercado atualizar(@PathVariable Long id, @Valid @RequestBody Mercado mercado) {
        return mercadoService.atualizar(id, mercado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        mercadoService.deletar(id);
    }
}
