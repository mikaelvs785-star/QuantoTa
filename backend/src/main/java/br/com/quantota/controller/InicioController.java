package br.com.quantota.controller;
import br.com.quantota.model.InicioConteudo;
import br.com.quantota.repository.InicioConteudoRepository;
import br.com.quantota.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
@RestController @RequestMapping("/vitrine/inicio")
public class InicioController {
    public record Categoria(@NotBlank @Size(max=60) String label, @NotBlank @Size(max=100) String query, UUID imagemId) {}
    public record Conteudo(@NotBlank @Size(max=150) String titulo, @NotBlank @Size(max=300) String descricao,
        UUID imagemId, @NotNull @Size(min=1,max=8) List<@NotNull @Valid Categoria> categorias) {}
    private final InicioConteudoRepository repository;
    private final PermissaoService permissoes;
    private final ImagemService imagens;
    private final ObjectMapper mapper;
    public InicioController(InicioConteudoRepository r, PermissaoService p, ImagemService i, ObjectMapper m) {
        repository=r; permissoes=p; imagens=i; mapper=m;
    }
    @GetMapping @Transactional(readOnly=true)
    public Conteudo buscar() throws Exception {
        var row=repository.findById(1L);
        if(row.isPresent()) return mapper.readValue(row.get().getConteudo(),Conteudo.class);
        return new Conteudo("Compre melhor.\nCuide do seu dinheiro.","Compare o preço da embalagem, confira quanto rende e planeje sua compra.",null,
            List.of(new Categoria("Mercearia","arroz",null),new Categoria("Hortifruti","fruta",null),
            new Categoria("Café da manhã","café",null),new Categoria("Limpeza","limpeza",null)));
    }
    @PutMapping @Transactional
    public Conteudo salvar(@Valid @RequestBody Conteudo entrada) throws Exception {
        permissoes.exigirAdmin();
        imagens.validarVinculo(entrada.imagemId(),null);
        for(var categoria:entrada.categorias()) imagens.validarVinculo(categoria.imagemId(),null);
        var row=new InicioConteudo(); row.setId(1L); row.setConteudo(mapper.writeValueAsString(entrada));
        repository.save(row); return entrada;
    }
}
