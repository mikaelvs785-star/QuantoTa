package br.com.quantota.controller;

import br.com.quantota.model.Mercado;
import br.com.quantota.service.MercadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mercados")
public class MercadoController {

    private final MercadoService mercadoService;

    public MercadoController(MercadoService mercadoService) {
        this.mercadoService = mercadoService;
    }

    @GetMapping
    public List<Mercado> listar() {
        return mercadoService.listarAtivos();
    }

    @GetMapping("/{id}")
    public Mercado buscarPorId(@PathVariable Long id) {
        return mercadoService.buscarPorId(id);
    }

    @PostMapping
    public Mercado salvar(@RequestBody Mercado mercado) {
        return mercadoService.salvar(mercado);
    }

    @PutMapping("/{id}")
    public Mercado atualizar(@PathVariable Long id, @RequestBody Mercado mercado) {
        return mercadoService.atualizar(id, mercado);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        mercadoService.deletar(id);
    }
}
