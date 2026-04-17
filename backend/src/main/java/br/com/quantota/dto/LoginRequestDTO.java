package br.com.quantota.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String senha;
}
