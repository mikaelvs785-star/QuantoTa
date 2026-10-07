package br.com.quantota.controller;
import br.com.quantota.repository.InicioConteudoRepository;
import br.com.quantota.model.InicioConteudo;
import br.com.quantota.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class InicioControllerTest {
    @Test void usaConteudoPadraoSemCriarRegistro() throws Exception {
        var repo=mock(InicioConteudoRepository.class);
        when(repo.findById(1L)).thenReturn(Optional.empty());
        var controller=new InicioController(repo,mock(PermissaoService.class),mock(ImagemService.class),new ObjectMapper());
        assertEquals(4,controller.buscar().categorias().size());
        verify(repo,never()).save(any());
    }
    @Test void exigeAdminAntesDeSalvar() throws Exception {
        var repo=mock(InicioConteudoRepository.class);
        var permissions=mock(PermissaoService.class);
        doThrow(new IllegalStateException("Sem permissão")).when(permissions).exigirAdmin();
        var controller=new InicioController(repo,permissions,mock(ImagemService.class),new ObjectMapper());
        assertThrows(IllegalStateException.class,()->controller.salvar(new InicioController.Conteudo("Título","Descrição",null,List.of())));
        verifyNoInteractions(repo);
    }
    @Test void salvaELeConteudoComImagens() throws Exception {
        var repo=mock(InicioConteudoRepository.class);
        var images=mock(ImagemService.class);
        var mapper=new ObjectMapper();
        var controller=new InicioController(repo,mock(PermissaoService.class),images,mapper);
        var banner=UUID.randomUUID(); var category=UUID.randomUUID();
        var input=new InicioController.Conteudo("Título","Descrição",banner,List.of(new InicioController.Categoria("Arroz","arroz",category)));
        when(repo.save(any())).thenAnswer(invocation->{
            InicioConteudo saved=invocation.getArgument(0);
            when(repo.findById(1L)).thenReturn(Optional.of(saved));
            return saved;
        });
        controller.salvar(input);
        assertEquals(input,controller.buscar());
        verify(images).validarVinculo(banner,null);
        verify(images).validarVinculo(category,null);
    }
}
