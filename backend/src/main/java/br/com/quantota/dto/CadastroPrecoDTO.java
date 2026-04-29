package br.com.quantota.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CadastroPrecoDTO {

    private Long produtoId;
    private Long mercadoId;
    private Long usuarioCadastroId;
    private BigDecimal valor;
    private LocalDateTime dataColeta;
    private String observacao;

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

    public Long getUsuarioCadastroId() {
        return usuarioCadastroId;
    }

    public void setUsuarioCadastroId(Long usuarioCadastroId) {
        this.usuarioCadastroId = usuarioCadastroId;
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

    public void setDataColeta(LocalDateTime dataColeta) {
        this.dataColeta = dataColeta;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}