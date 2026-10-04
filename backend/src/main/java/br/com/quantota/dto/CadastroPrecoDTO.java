package br.com.quantota.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CadastroPrecoDTO {

    @NotNull @Positive
    private Long produtoId;
    @NotNull @Positive
    private Long mercadoId;
    // A autoria é obtida da sessão autenticada.
    @NotNull @DecimalMin("0.01") @Digits(integer = 8, fraction = 2)
    private BigDecimal valor;
    @NotNull @PastOrPresent
    private LocalDate dataColeta;
    private String observacao;
    private java.util.UUID imagemId;
    private boolean alterarImagem;
    public java.util.UUID getImagemId() { return imagemId; }
    public void setImagemId(java.util.UUID id) { imagemId=id; }
    public boolean isAlterarImagem() { return alterarImagem; }
    public void setAlterarImagem(boolean value) { alterarImagem=value; }


    public Long getProdutoId() {
        return produtoId;
    }

    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public Long getMercadoId() {
        return mercadoId;
    }

    public void setMercadoId(Long mercadoId) {
        this.mercadoId = mercadoId;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getDataColeta() {
        return dataColeta;
    }

    public void setDataColeta(LocalDate dataColeta) {
        this.dataColeta = dataColeta;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}