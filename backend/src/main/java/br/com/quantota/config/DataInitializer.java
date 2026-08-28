package br.com.quantota.config;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner criarUsuariosTeste(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            criarUsuarioSeNaoExistir(
                    usuarioRepository,
                    passwordEncoder,
                    "Administrador",
                    "admin@quantota.com",
                    "123456",
                    PerfilUsuario.ADMIN
            );

            criarUsuarioSeNaoExistir(
                    usuarioRepository,
                    passwordEncoder,
                    "Cliente Teste",
                    "cliente@quantota.com",
                    "123456",
                    PerfilUsuario.USER
            );

            criarUsuarioSeNaoExistir(
                    usuarioRepository,
                    passwordEncoder,
                    "Vendedor Teste",
                    "vendedor@quantota.com",
                    "123456",
                    PerfilUsuario.VENDEDOR
            );
        };
    }

    private void criarUsuarioSeNaoExistir(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            String nome,
            String email,
            String senha,
            PerfilUsuario perfil
    ) {
        usuarioRepository.findByEmail(email).ifPresentOrElse(usuarioExistente -> {
            if (usuarioExistente.getPerfil() != perfil) {
                usuarioExistente.setPerfil(perfil);
                usuarioRepository.save(usuarioExistente);
            }
        }, () -> {

            Usuario usuario = Usuario.builder()
                    .nome(nome)
                    .email(email)
                    .senha(passwordEncoder.encode(senha))
                    .perfil(perfil)
                    .ativo(true)
                    .build();

            usuarioRepository.save(usuario);

            System.out.println("Usuário de teste criado: " + email);
        });
    }
}
