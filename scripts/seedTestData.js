/* Seed script for QuantoTa (idempotent where possible)

Usage:
  node scripts/seedTestData.js

Set environment variables:
  API_URL (default: http://localhost:8080)
  ADMIN_EMAIL (default: admin@quantota.com)
  ADMIN_PASSWORD (default: 123456)
*/

const axios = require("axios");

const API_URL = process.env.API_URL || "http://localhost:8080";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@quantota.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

const apiClient = axios.create({ baseURL: API_URL, timeout: 10000 });

async function login() {
  try {
    const resp = await apiClient.post("/auth/login", { email: ADMIN_EMAIL, senha: ADMIN_PASSWORD });
    return resp.data?.token;
  } catch (err) {
    console.error("Login falhou:", err.response?.status, err.response?.data || err.message);
    return null;
  }
}

async function ensureMarket(token, market) {
  const client = token ? axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } }) : apiClient;
  const list = (await client.get("/mercados")).data || [];
  const found = list.find(m => m.nome === market.nome || m.name === market.nome);
  if (found) return found;
  const resp = await client.post("/mercados", market);
  return resp.data;
}

async function ensureProduct(token, product) {
  const client = token ? axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } }) : apiClient;
  const list = (await client.get("/produtos")).data || [];
  const found = list.find(p => p.nome === product.nome || p.name === product.nome);
  if (found) return found;
  const resp = await client.post("/produtos", product);
  return resp.data;
}

async function createPrice(token, payload) {
  const client = axios.create({ baseURL: API_URL, headers: { Authorization: `Bearer ${token}` } });
  // No dedupe; best-effort check
  const existing = (await client.get("/precos")).data || [];
  const match = existing.find(p => p.produto?.id == payload.produtoId && p.mercado?.id == payload.mercadoId && Number(p.valor) === Number(payload.valor));
  if (match) return match;
  const resp = await client.post("/precos", payload);
  return resp.data;
}

async function main() {
  console.log("API:", API_URL);
  const token = await login();
  if (!token) {
    console.warn("Não foi possível autenticar como ADMIN. Abortando o fluxo de criação protegida. Se o backend estiver usando outro usuário/senha, ajuste as variáveis de ambiente.");
    return;
  }

  console.log("Autenticado. Token obtido (ocultando valor).");

  const mercados = [
    { nome: "Mercado Central", endereco: "Rua A, 100", bairro: "Centro", cidade: "Brasília", estado: "DF", telefone: "(61) 99999-0101", ativo: true },
    { nome: "Supermercado Boa Compra", endereco: "Av. B, 200", bairro: "Asa Sul", cidade: "Brasília", estado: "DF", telefone: "(61) 99999-0202", ativo: true },
    { nome: "Atacadão Econômico", endereco: "Rodovia C, Km 5", bairro: "Industrial", cidade: "Gama", estado: "DF", telefone: "(61) 99999-0303", ativo: true },
  ];

  const produtos = [
    { nome: "Arroz 5kg", categoria: "Mercearia", unidadeMedida: "pacote", marca: "MarcaX", descricao: "Arroz tipo 1", ativo: true },
    { nome: "Feijão 1kg", categoria: "Mercearia", unidadeMedida: "pacote", marca: "MarcaY", descricao: "Feijão carioca", ativo: true },
    { nome: "Leite 1L", categoria: "Laticínios", unidadeMedida: "caixa", marca: "MarcaZ", descricao: "Leite integral", ativo: true },
  ];

  // Ensure markets
  const createdMarkets = [];
  for (const m of mercados) {
    try {
      const cm = await ensureMarket(token, m);
      createdMarkets.push(cm);
      console.log("Market ensured:", cm.nome || cm.name, "id:", cm.id);
    } catch (err) {
      console.error("Erro criando/checando mercado:", err.response?.data || err.message);
    }
  }

  // Ensure products
  const createdProducts = [];
  for (const p of produtos) {
    try {
      const cp = await ensureProduct(token, p);
      createdProducts.push(cp);
      console.log("Product ensured:", cp.nome || cp.name, "id:", cp.id);
    } catch (err) {
      console.error("Erro criando/checando produto:", err.response?.data || err.message);
    }
  }

  // Create prices (associate products and markets)
  const hoje = new Date().toISOString().slice(0,10);
  const pricesToCreate = [
    { produtoId: createdProducts[0]?.id, mercadoId: createdMarkets[0]?.id, valor: 24.9, dataColeta: hoje },
    { produtoId: createdProducts[0]?.id, mercadoId: createdMarkets[1]?.id, valor: 27.5, dataColeta: hoje },
    { produtoId: createdProducts[1]?.id, mercadoId: createdMarkets[0]?.id, valor: 7.9, dataColeta: hoje },
    { produtoId: createdProducts[2]?.id, mercadoId: createdMarkets[2]?.id, valor: 5.5, dataColeta: hoje },
  ];

  for (const p of pricesToCreate) {
    if (!p.produtoId || !p.mercadoId) continue;
    try {
      const cp = await createPrice(token, p);
      console.log("Price created/exists id:", cp.id, "productId:", p.produtoId, "marketId:", p.mercadoId, "valor:", p.valor);
    } catch (err) {
      console.error("Erro criando preco:", err.response?.data || err.message);
    }
  }

  console.log("Seed finalizado.");
}

main().catch(err => { console.error(err); process.exit(1); });
