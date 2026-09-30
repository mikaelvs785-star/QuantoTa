package br.com.quantota;

import br.com.quantota.enums.PerfilUsuario;
import br.com.quantota.model.Usuario;
import br.com.quantota.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.net.URI;
import java.net.http.*;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ApiFlowTest {
    static ConfigurableApplicationContext context;
    static String base, alice, bob, admin, seller, otherSeller;
    static long listId, productId, marketId, itemId;
    static final ObjectMapper json = new ObjectMapper();
    static final HttpClient client = HttpClient.newHttpClient();
    @BeforeAll static void start() throws Exception {
        context = startServer(0);
        base = "http://localhost:" + ((ServletWebServerApplicationContext) context).getWebServer().getPort();
        request("POST", "/auth/register", "{\"nome\":\"Alice\",\"email\":\"alice@test.local\",\"senha\":\"teste123\"}", null, 201);
        request("POST", "/auth/register", "{\"nome\":\"Bob\",\"email\":\"bob@test.local\",\"senha\":\"teste123\"}", null, 201);
        alice = login("alice@test.local"); bob = login("bob@test.local"); admin = login("admin@test.local");
        seller = login("seller@test.local"); otherSeller = login("other-seller@test.local");
    }
    public static ConfigurableApplicationContext startServer(int port) {
        var app = new SpringApplication(QuantotaApplication.class);
        var ctx = app.run("--server.port=" + port, "--app.jwt.secret=VGhpc0lzQVNlY3VyZUFuZFN1ZmZpY2llbnRseUxvbmdEZXZlbG9wbWVudEtleTEyMzQ1Njc4OTA=", "--spring.datasource.url=jdbc:h2:mem:quantota;MODE=PostgreSQL;DB_CLOSE_DELAY=-1",
                "--spring.datasource.driver-class-name=org.h2.Driver", "--spring.datasource.username=sa", "--spring.datasource.password=",
                "--spring.jpa.hibernate.ddl-auto=create-drop", "--spring.sql.init.mode=never", "--spring.jpa.show-sql=false", "--logging.level.root=WARN");
        var repository = ctx.getBean(UsuarioRepository.class);
        repository.save(Usuario.builder().nome("Admin de teste").email("admin@test.local")
            .senha(ctx.getBean(PasswordEncoder.class).encode("teste123")).perfil(PerfilUsuario.ADMIN).ativo(true).build());
        for (String email : java.util.List.of("seller@test.local", "other-seller@test.local")) {
            repository.save(Usuario.builder().nome(email.startsWith("other") ? "Outro vendedor" : "Vendedor de teste").email(email)
                .senha(ctx.getBean(PasswordEncoder.class).encode("teste123")).perfil(PerfilUsuario.VENDEDOR).ativo(true).build());
        }
        return ctx;
    }
    public static void main(String[] args) { startServer(8080); }
    @AfterAll static void stop() { if (context != null) context.close(); }
    @Test @Order(1) void registrationAndAccess() throws Exception {
        var profile = request("GET", "/auth/profile", null, alice, 200);
        assertFalse(profile.has("senha"));
        request("POST", "/auth/register", "{\"nome\":\"Alice\",\"email\":\"ALICE@test.local\",\"senha\":\"teste123\"}", null, 409);
        request("POST", "/usuarios", "{}", null, 403);
        request("POST", "/produtos", "{}", alice, 403);
        request("GET", "/listas", null, null, 403);
    }
    @Test @Order(2) void catalogueAndValidatedPrices() throws Exception {
        productId = request("POST", "/produtos", "{\"nome\":\"Arroz\",\"categoria\":\"Mercearia\",\"marca\":\"Marca A\",\"unidadeMedida\":\"5 kg\",\"ativo\":true}", admin, 200).get("id").asLong();
        marketId = request("POST", "/mercados", "{\"nome\":\"Mercado A\",\"cidade\":\"Brasília\",\"estado\":\"DF\",\"ativo\":true}", admin, 200).get("id").asLong();
        request("POST", "/precos", pricePayload("0", LocalDate.now()), admin, 400);
        request("POST", "/precos", pricePayload("10.123", LocalDate.now()), admin, 400);
        request("POST", "/precos", pricePayload("10", LocalDate.now().plusDays(1)), admin, 400);
        request("POST", "/precos", pricePayload("3", LocalDate.now().minusDays(1)), admin, 200);
        var price = request("POST", "/precos", pricePayload("12.50", LocalDate.now()), admin, 200);
        assertFalse(price.has("usuarioCadastro"));
        var savedPrice = context.getBean(br.com.quantota.repository.PrecoRepository.class).findById(price.get("id").asLong()).orElseThrow();
        assertEquals("admin@test.local", savedPrice.getUsuarioCadastro().getEmail());
    }
    @Test @Order(3) void listsAreOwnedPersistentAndMergeDuplicates() throws Exception {
        listId = request("POST", "/listas", "{\"nomeLista\":\"Semana\",\"usuarioId\":999}", alice, 200).get("id").asLong();
        request("GET", "/listas/" + listId, null, bob, 404);
        request("DELETE", "/listas/" + listId, null, bob, 404);
        request("POST", "/listas/" + listId + "/itens", itemPayload(1), bob, 404);
        request("POST", "/listas/" + listId + "/itens", itemPayload(0), alice, 400);
        itemId = request("POST", "/listas/" + listId + "/itens", itemPayload(2), alice, 200).get("id").asLong();
        var item = request("POST", "/listas/" + listId + "/itens", itemPayload(3), alice, 200);
        assertEquals(itemId, item.get("id").asLong()); assertEquals(5, item.get("quantidade").asInt());
        assertFalse(item.has("listaCompra"));
        var lists = request("GET", "/listas", null, alice, 200);
        assertEquals(1, lists.size()); assertEquals(1, lists.get(0).get("itens").size()); assertFalse(lists.get(0).has("usuario"));
        assertEquals(0, request("GET", "/listas", null, bob, 200).size());
        var summary = request("GET", "/listas/" + listId, null, alice, 200);
        assertEquals(62.50, summary.get("valorEstimado").asDouble());
        assertTrue(summary.get("estimativaCompleta").asBoolean());
        request("PUT", "/listas/" + listId + "/itens/" + itemId, "{\"quantidade\":1.5}", alice, 400);
        request("PUT", "/listas/" + listId + "/itens/" + itemId, "{\"quantidade\":1000}", alice, 400);
        request("PUT", "/listas/" + listId + "/itens/" + itemId, "{\"quantidade\":2}", bob, 404);
        request("PUT", "/listas/" + listId + "/itens/" + itemId, "{\"quantidade\":2}", alice, 200);
    }
    @Test @Order(4) void latestPriceWinsAndMissingPriceIsExplicit() throws Exception {
        request("POST", "/precos", pricePayload("15", LocalDate.now()), admin, 200);
        assertEquals(30, request("GET", "/listas/" + listId, null, alice, 200).get("valorEstimado").asDouble());
        var noPriceProduct = request("POST", "/produtos", "{\"nome\":\"Café sem preço\",\"ativo\":true}", admin, 200).get("id").asLong();
        request("POST", "/listas/" + listId + "/itens", "{\"produtoId\":" + noPriceProduct + ",\"quantidade\":1}", alice, 200);
        var summary = request("GET", "/listas/" + listId, null, alice, 200);
        assertFalse(summary.get("estimativaCompleta").asBoolean()); assertEquals(1, summary.get("itensSemPreco").asInt()); assertEquals(30, summary.get("valorEstimado").asDouble());
        request("DELETE", "/listas/" + listId + "/itens/" + itemId, null, bob, 404);
        request("DELETE", "/listas/" + listId + "/itens/" + itemId, null, alice, 200);
        assertEquals(1, request("GET", "/listas", null, alice, 200).get(0).get("itens").size());
    }
    @Test @Order(5) void inactiveProductsStayVisibleToAdminAndAccountRevocationWorks() throws Exception {
        request("DELETE", "/produtos/" + productId, null, admin, 200);
        assertEquals(1, request("GET", "/produtos", null, null, 200).size());
        assertEquals(2, request("GET", "/produtos", null, admin, 200).size());
        var repository = context.getBean(UsuarioRepository.class);
        var user = repository.findByEmail("bob@test.local").orElseThrow(); user.setAtivo(false); repository.save(user);
        request("GET", "/listas", null, bob, 403);
    }
    @Test @Order(6) void cataloguePermissionsAndSellerOwnership() throws Exception {
        assertFalse(request("GET", "/catalogo/permissoes", null, null, 200).get("gerenciarProdutos").asBoolean());
        assertFalse(request("GET", "/catalogo/permissoes", null, alice, 200).get("criarMercado").asBoolean());
        assertTrue(request("GET", "/catalogo/permissoes", null, admin, 200).get("gerenciarProdutos").asBoolean());
        request("POST", "/mercados", "{\"nome\":\"Mercado bloqueado\"}", alice, 403);
        request("POST", "/produtos", "{\"nome\":\"Produto bloqueado\"}", seller, 403);
        long sellerId = context.getBean(UsuarioRepository.class).findByEmail("seller@test.local").orElseThrow().getId();
        long otherId = context.getBean(UsuarioRepository.class).findByEmail("other-seller@test.local").orElseThrow().getId();
        var own = request("POST", "/mercados", "{\"id\":" + marketId + ",\"nome\":\"Mercado do vendedor\",\"vendedorId\":" + otherId + ",\"ativo\":false}", seller, 200);
        long ownId = own.get("id").asLong(); assertNotEquals(marketId, ownId); assertTrue(own.get("ativo").asBoolean());
        assertFalse(own.has("vendedorId"));
        var repository = context.getBean(br.com.quantota.repository.MercadoRepository.class);
        assertEquals(sellerId, repository.findById(ownId).orElseThrow().getVendedorId());
        assertEquals(ownId, request("GET", "/catalogo/permissoes", null, seller, 200).get("mercadosEditaveis").get(0).asLong());
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Tentativa de outro vendedor\",\"ativo\":true}", otherSeller, 403);
        request("PUT", "/mercados/" + marketId, "{\"nome\":\"Tentativa sem vínculo\",\"ativo\":true}", seller, 403);
        request("DELETE", "/mercados/" + ownId, null, seller, 403);
        request("GET", "/mercados/" + ownId + "/vendedor", null, seller, 403);
        request("GET", "/mercados/" + ownId + "/vendedor", null, null, 401);
        assertEquals(sellerId, request("GET", "/mercados/" + ownId + "/vendedor", null, admin, 200).get("vendedorId").asLong());
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Mercado atualizado pelo dono\",\"vendedorId\":" + otherId + ",\"ativo\":false}", seller, 200);
        assertTrue(repository.findById(ownId).orElseThrow().getAtivo());
        assertEquals(sellerId, repository.findById(ownId).orElseThrow().getVendedorId());
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Mercado transferido\",\"vendedorId\":" + otherId + ",\"ativo\":true}", admin, 200);
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Ex-dono bloqueado\",\"ativo\":true}", seller, 403);
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Novo dono\",\"ativo\":true}", otherSeller, 200);
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Vínculo inválido\",\"vendedorId\":999999,\"ativo\":true}", admin, 400);
        request("DELETE", "/mercados/" + ownId, null, admin, 200);
        request("PUT", "/mercados/" + ownId, "{\"nome\":\"Reativação proibida\",\"ativo\":true}", otherSeller, 403);
        assertFalse(repository.findById(ownId).orElseThrow().getAtivo());
    }
    static String pricePayload(String value, LocalDate date) { return "{\"produtoId\":" + productId + ",\"mercadoId\":" + marketId + ",\"usuarioCadastroId\":999,\"valor\":" + value + ",\"dataColeta\":\"" + date + "\"}"; }
    static String itemPayload(int quantity) { return "{\"produtoId\":" + productId + ",\"quantidade\":" + quantity + "}"; }
    static String login(String email) throws Exception { return request("POST", "/auth/login", "{\"email\":\"" + email + "\",\"senha\":\"teste123\"}", null, 200).get("token").asText(); }
    static JsonNode request(String method, String path, String body, String token, int status) throws Exception {
        var builder = HttpRequest.newBuilder(URI.create(base + path)).header("Content-Type", "application/json");
        if (token != null) builder.header("Authorization", "Bearer " + token);
        var response = client.send(builder.method(method, body == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(status, response.statusCode(), method + " " + path + " " + response.body());
        return response.body().isBlank() ? json.nullNode() : json.readTree(response.body());
    }
}
