package br.com.quantota.controller;
import br.com.quantota.service.ImagemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.*;
import java.util.*;
@RestController @RequestMapping("/imagens")
public class ImagemController {
    private final ImagemService imagens;
    public ImagemController(ImagemService imagens) { this.imagens=imagens; }
    @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String,UUID> enviar(@RequestParam("arquivo") MultipartFile arquivo) { return Map.of("id",imagens.enviar(arquivo)); }
    @GetMapping("/{id}") public ResponseEntity<byte[]> obter(@PathVariable UUID id) {
        var imagem=imagens.buscar(id);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(imagem.getContentType()))
            .header("X-Content-Type-Options","nosniff").cacheControl(CacheControl.maxAge(java.time.Duration.ofDays(365)).cachePublic().immutable()).body(imagem.getConteudo());
    }
}
