package br.com.quantota.controller;
import br.com.quantota.service.*;
import br.com.quantota.model.Preco;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/comparacoes")
public class ComparacaoController {
    private final ProdutoService produtos; private final PrecoService precos;
    public ComparacaoController(ProdutoService p,PrecoService pr) { produtos=p; precos=pr; }
    @GetMapping("/embalagens/{id}") public List<Preco> embalagens(@PathVariable Long id) {
        var produto=produtos.buscarPorId(id);
        if (!Boolean.TRUE.equals(produto.getAtivo()) || produto.getGrupoComparacao()==null || produto.getGrupoComparacao().isBlank()
            || produto.getMarca()==null || produto.getMarca().isBlank() || produto.getQuantidadeBase()==null) return List.of();
        var maisBaratas=new LinkedHashMap<Long,Preco>();
        for(var p:precos.listarAtuais()) {
            var outro=p.getProduto();
            if (produto.getGrupoComparacao().equals(outro.getGrupoComparacao()) && produto.getMarca().trim().equalsIgnoreCase(Objects.toString(outro.getMarca(),"").trim())
                && Objects.equals(produto.getUnidadeBase(),outro.getUnidadeBase()) && outro.getQuantidadeBase()!=null)
                maisBaratas.putIfAbsent(outro.getId(),p);
        }
        return maisBaratas.values().stream().sorted(Comparator.comparing(Preco::getPrecoPorMedida).thenComparing(Preco::getId)).toList();
    }
}
