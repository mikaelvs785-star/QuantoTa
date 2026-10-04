package br.com.quantota.controller;
import br.com.quantota.model.Colecao;
import br.com.quantota.repository.ColecaoRepository;
import br.com.quantota.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import java.util.*;
@RestController @RequestMapping("/vitrine") @Transactional
public class VitrineController {
    private final ColecaoRepository colecoes; private final PermissaoService permissoes; private final ImagemService imagens; private final ProdutoService produtos;
    public VitrineController(ColecaoRepository c,PermissaoService p,ImagemService i,ProdutoService pr) { colecoes=c; permissoes=p; imagens=i; produtos=pr; }
    @GetMapping public List<Colecao> publicas() { return colecoes.findByAtivoTrueOrderByOrdemAscIdAsc(); }
    @GetMapping("/gestao") public List<Colecao> todas() { permissoes.exigirAdmin(); return colecoes.findAll(); }
    @PostMapping public Colecao criar(@Valid @RequestBody Colecao entrada) { permissoes.exigirAdmin(); entrada.setId(null); validar(entrada,null); return colecoes.save(entrada); }
    @PutMapping("/{id}") public Colecao editar(@PathVariable Long id,@Valid @RequestBody Colecao entrada) {
        permissoes.exigirAdmin(); var atual=colecoes.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        validar(entrada,atual.getImagemId()); atual.setTitulo(entrada.getTitulo()); atual.setDescricao(entrada.getDescricao()); atual.setImagemId(entrada.getImagemId());
        atual.setProdutoIds(entrada.getProdutoIds()); atual.setAtivo(entrada.isAtivo()); atual.setOrdem(entrada.getOrdem()); return colecoes.save(atual);
    }
    @DeleteMapping("/{id}") public void excluir(@PathVariable Long id) { permissoes.exigirAdmin(); colecoes.deleteById(id); }
    private void validar(Colecao c,UUID atual) {
        imagens.validarVinculo(c.getImagemId(),atual);
        if(c.getProdutoIds()==null || c.getProdutoIds().size()>100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Selecione até 100 produtos.");
        c.getProdutoIds().forEach(produtos::buscarPorId);
    }
}
