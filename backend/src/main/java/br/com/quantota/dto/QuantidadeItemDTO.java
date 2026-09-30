package br.com.quantota.dto;
import jakarta.validation.constraints.*;
public record QuantidadeItemDTO(@NotNull @Min(1) @Max(999) Integer quantidade) {}
