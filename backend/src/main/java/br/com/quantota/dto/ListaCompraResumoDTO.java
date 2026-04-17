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
    private BigDecimal valorEstimado;

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
