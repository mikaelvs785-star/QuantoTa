package br.com.quantota.dto;

public class LoginResponseDTO {

    private Long id;
    private String nome;
    private String email;
    private String perfil;
    private Boolean ativo;
    private String mensagem;
    private String token;

    public LoginResponseDTO(String mensagem) {
        this.mensagem = mensagem;
    }

    public LoginResponseDTO(Long id, String nome, String email, String perfil, Boolean ativo, String mensagem, String token) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.perfil = perfil;
        this.ativo = ativo;
        this.mensagem = mensagem;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getToken() { return token; }

    public void setToken(String token) { this.token = token; }
}
