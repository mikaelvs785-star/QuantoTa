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
        assertEquals(itemId, summary.get("estimativas").get(0).get("itemId").asLong());
        assertEquals(12.50, summary.get("estimativas").get(0).get("precoUnitario").asDouble());
        assertEquals(62.50, summary.get("estimativas").get(0).get("subtotal").asDouble());
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
        assertEquals(0, request("GET", "/precos", null, null, 200).size());
        assertEquals(0, request("GET", "/precos/produto/" + productId, null, alice, 200).size());
        assertTrue(request("GET", "/precos", null, admin, 200).size() >= 3);
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
    @Test @Order(7) void sellerPricesAreLimitedToOwnedMarkets() throws Exception {
        long product = request("POST", "/produtos", "{\"nome\":\"Feijão\",\"ativo\":true}", admin, 200).get("id").asLong();
        long own = request("POST", "/mercados", "{\"nome\":\"Mercado para preços\",\"ativo\":true}", seller, 200).get("id").asLong();
        long other = request("POST", "/mercados", "{\"nome\":\"Mercado de outro vendedor\",\"ativo\":true}", otherSeller, 200).get("id").asLong();
        var permissions = request("GET", "/permissoes", null, seller, 200);
        assertTrue(permissions.get("gerenciarPrecos").asBoolean());
        assertFalse(permissions.get("gerenciarTodosPrecos").asBoolean());
        assertFalse(permissions.get("gerenciarUsuarios").asBoolean());
        assertTrue(permissions.get("mercadosPrecosEditaveis").toString().contains(String.valueOf(own)));
        request("POST", "/precos", priceFor(product, own, "4"), alice, 403);
        request("POST", "/precos", priceFor(product, other, "4"), seller, 403);
        long price = request("POST", "/precos", priceFor(product, own, "8"), seller, 200).get("id").asLong();
        request("PUT", "/precos/" + price, priceFor(product, own, "9"), otherSeller, 403);
        request("PUT", "/precos/" + price, priceFor(product, other, "9"), seller, 403);
        long otherPrice = request("POST", "/precos", priceFor(product, other, "7"), otherSeller, 200).get("id").asLong();
        request("PUT", "/precos/" + otherPrice, priceFor(product, own, "9"), seller, 403);
        request("DELETE", "/precos/" + price, null, otherSeller, 403);
        request("DELETE", "/precos/" + price, null, alice, 403);
        request("PUT", "/precos/" + price, priceFor(product, own, "9.50"), seller, 200);
        var prices = context.getBean(br.com.quantota.repository.PrecoRepository.class);
        assertEquals("seller@test.local", prices.findById(price).orElseThrow().getUsuarioCadastro().getEmail());
        request("DELETE", "/precos/" + price, null, seller, 200);
        request("DELETE", "/precos/" + otherPrice, null, admin, 200);
        assertFalse(prices.existsById(price));
    }
    @Test @Order(8) void transfersAndInactiveMarketsRevokePriceEditingImmediately() throws Exception {
        long product = request("POST", "/produtos", "{\"nome\":\"Sabão\",\"ativo\":true}", admin, 200).get("id").asLong();
        long market = request("POST", "/mercados", "{\"nome\":\"Mercado transferível\",\"ativo\":true}", seller, 200).get("id").asLong();
        long price = request("POST", "/precos", priceFor(product, market, "10"), seller, 200).get("id").asLong();
        long otherId = context.getBean(UsuarioRepository.class).findByEmail("other-seller@test.local").orElseThrow().getId();
        request("PUT", "/mercados/" + market, "{\"nome\":\"Transferido\",\"ativo\":true,\"vendedorId\":" + otherId + "}", admin, 200);
        request("PUT", "/precos/" + price, priceFor(product, market, "11"), seller, 403);
        request("DELETE", "/precos/" + price, null, seller, 403);
        request("PUT", "/precos/" + price, priceFor(product, market, "11"), otherSeller, 200);
        long latest = request("POST", "/precos", priceFor(product, market, "12"), otherSeller, 200).get("id").asLong();
        var current = request("GET", "/precos/atuais", null, null, 200);
        assertEquals(1, java.util.stream.StreamSupport.stream(current.spliterator(), false).filter(p -> p.get("produto").get("id").asLong() == product).count());
        assertTrue(java.util.stream.StreamSupport.stream(current.spliterator(), false).anyMatch(p -> p.get("id").asLong() == latest));
        request("DELETE", "/mercados/" + market, null, admin, 200);
        request("PUT", "/precos/" + price, priceFor(product, market, "11"), otherSeller, 403);
        request("DELETE", "/precos/" + price, null, otherSeller, 403);
        current = request("GET", "/precos/atuais", null, null, 200);
        assertFalse(java.util.stream.StreamSupport.stream(current.spliterator(), false).anyMatch(p -> p.get("produto").get("id").asLong() == product));
        var grants = request("GET", "/permissoes", null, otherSeller, 200).get("mercadosPrecosEditaveis");
        assertFalse(java.util.stream.StreamSupport.stream(grants.spliterator(), false).anyMatch(id -> id.asLong() == market));
    }
    @Test @Order(9) void permissionsAndRegistrationCannotEscalatePrivileges() throws Exception {
        var publicGrants = request("GET", "/permissoes", null, null, 200);
        assertFalse(publicGrants.get("gerenciarPrecos").asBoolean());
        assertFalse(publicGrants.get("usarListas").asBoolean());
        var grants = request("GET", "/permissoes", null, alice, 200);
        assertTrue(grants.get("usarListas").asBoolean()); assertTrue(grants.get("acessarConta").asBoolean());
        assertFalse(grants.get("gerenciarUsuarios").asBoolean());
        request("GET", "/usuarios", null, alice, 403); request("GET", "/usuarios", null, seller, 403);
        var consumer = request("POST", "/auth/register", "{\"nome\":\"Tentativa de admin\",\"email\":\"forged@test.local\",\"senha\":\"teste123\",\"perfil\":\"ADMIN\"}", null, 201);
        assertEquals("USER", consumer.get("perfil").asText());
        request("POST", "/usuarios", "{\"nome\":\"Invasor\",\"email\":\"invasor@test.local\",\"senha\":\"teste123\",\"perfil\":\"ADMIN\"}", seller, 403);
        var created = request("POST", "/usuarios", "{\"nome\":\"Novo vendedor\",\"email\":\"new-seller@test.local\",\"senha\":\"teste123\",\"perfil\":\"VENDEDOR\"}", admin, 200);
        assertEquals("VENDEDOR", created.get("perfil").asText()); assertFalse(created.has("senha"));
        assertTrue(request("GET", "/permissoes", null, admin, 200).get("gerenciarUsuarios").asBoolean());
    }
    static String priceFor(long product, long market, String value) { return "{\"produtoId\":" + product + ",\"mercadoId\":" + market + ",\"valor\":" + value + ",\"dataColeta\":\"" + LocalDate.now() + "\"}"; }
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
