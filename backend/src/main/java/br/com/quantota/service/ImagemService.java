package br.com.quantota.service;
import br.com.quantota.model.Imagem;
import br.com.quantota.repository.ImagemRepository;
import br.com.quantota.enums.PerfilUsuario;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;
import java.util.Objects;
import java.io.*;
import javax.imageio.ImageIO;
@Service
public class ImagemService {
    private final ImagemRepository imagens;
    private final SessaoService sessao;
    public ImagemService(ImagemRepository imagens, SessaoService sessao) { this.imagens=imagens; this.sessao=sessao; }
    public Imagem buscar(UUID id) { return imagens.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem não encontrada.")); }
    public void validarVinculo(UUID id, UUID atual) {
        if (id == null || Objects.equals(id, atual)) return;
        var imagem=buscar(id); var usuario=sessao.usuarioAtual();
        if (usuario.getPerfil()!=PerfilUsuario.ADMIN && !usuario.getId().equals(imagem.getUsuarioId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Envie uma imagem com sua própria conta.");
    }
    public UUID enviar(MultipartFile arquivo) {
        var usuario=sessao.usuarioAtual();
        if (usuario.getPerfil()!=PerfilUsuario.ADMIN && usuario.getPerfil()!=PerfilUsuario.VENDEDOR)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas responsáveis pelo catálogo podem enviar imagens.");
        if (arquivo.isEmpty() || arquivo.getSize()>3*1024*1024) throw invalida();
        try (var input=ImageIO.createImageInputStream(arquivo.getInputStream())) {
            var readers=ImageIO.getImageReaders(input);
            if (!readers.hasNext()) throw invalida();
            var reader=readers.next();
            try {
                if (!java.util.Set.of("JPEG", "JPG", "PNG").contains(reader.getFormatName().toUpperCase())) throw invalida();
                reader.setInput(input);
                int w=reader.getWidth(0), h=reader.getHeight(0);
                if (w<1 || h<1 || w>4096 || h>4096 || (long)w*h>12000000) throw invalida();
                var decoded=reader.read(0);
                var out=new ByteArrayOutputStream();
                // Reencodificação elimina metadados e conteúdo que não pertence à imagem.
                ImageIO.write(decoded,"png",out);
                if (out.size()>8*1024*1024) throw invalida();
                var imagem=new Imagem(); imagem.setId(UUID.randomUUID()); imagem.setUsuarioId(usuario.getId());
                imagem.setContentType("image/png"); imagem.setConteudo(out.toByteArray());
                return imagens.save(imagem).getId();
            } finally { reader.dispose(); }
        } catch (IOException | IllegalArgumentException e) { throw invalida(); }
    }
    private ResponseStatusException invalida() { return new ResponseStatusException(HttpStatus.BAD_REQUEST,"Envie uma foto JPG ou PNG de até 3 MB e 4096 pixels por lado."); }
}
