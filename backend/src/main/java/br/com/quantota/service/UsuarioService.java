package br.com.quantota.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UsuarioService {

    // 🔥 Simulação de banco em memória
    private final Map<String, String> usuarios = new HashMap<>();

    // 📝 Cadastrar usuário
    public void cadastrar(String email, String senha) {

        if (usuarios.containsKey(email)) {
            throw new RuntimeException("Usuário já existe!");
        }

        usuarios.put(email, senha);

        System.out.println("Usuário cadastrado: " + email);
    }

    // 🔐 Validar login
    public boolean autenticar(String email, String senha) {

        if (!usuarios.containsKey(email)) {
            throw new RuntimeException("Usuário não encontrado!");
        }

        String senhaSalva = usuarios.get(email);

        if (!senhaSalva.equals(senha)) {
            throw new RuntimeException("Senha inválida!");
        }

        return true;
    }
    public String buscarPorId(Long id) {
        // simulação
        return "Usuário com ID: " + id;
    }
}