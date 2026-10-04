package br.com.quantota.dto;

import br.com.quantota.model.ItemListaCompra;
import br.com.quantota.model.ListaCompra;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ListaCompraResumoDTO {
    private Long id;
    private String nomeLista;
    private Long usuarioId;
    private List<ItemListaCompra> itens;
    public record ItemEstimativa(Long itemId, BigDecimal precoUnitario, BigDecimal subtotal, Long mercadoId, String mercado,
        java.util.UUID imagemId, BigDecimal precoPorMedida, String unidadeBase, java.time.LocalDate dataColeta) {}
    public record ItemMercado(Long itemId, String produto, int quantidade, BigDecimal precoUnitario, BigDecimal subtotal, java.time.LocalDate dataColeta) {}
    public record TotalMercado(Long mercadoId, String mercado, java.util.UUID imagemId, BigDecimal subtotal, boolean completa,
        int produtosComPreco, List<String> produtosSemPreco, List<ItemMercado> itens) {}
    private List<TotalMercado> mercados;
    private Long mercadoMaisBaratoId;
    private BigDecimal diferencaCompraDividida;
    private int quantidadeMercados;
    private List<ItemEstimativa> estimativas;
    private BigDecimal valorEstimado;
    private int itensSemPreco;
    private boolean estimativaCompleta;

    public static ListaCompraResumoDTO fromEntity(ListaCompra lista, BigDecimal valorEstimado) {
        return ListaCompraResumoDTO.builder()
                .id(lista.getId())
                .nomeLista(lista.getNomeLista())
                .usuarioId(lista.getUsuario().getId())
                .itens(lista.getItens())
                .valorEstimado(valorEstimado)
                .build();
    }
}
