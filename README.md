# 🛒 QuantoTá?

> Compare preços, economize nas compras e encontre o melhor mercado.

O **QuantoTá?** é uma aplicação web desenvolvida para facilitar a comparação de preços entre mercados, permitindo que os usuários encontrem os melhores valores para seus produtos e organizem listas de compras de forma prática.

Este projeto foi desenvolvido utilizando **Spring Boot** no back-end e **HTML, CSS e JavaScript** no front-end, seguindo a arquitetura Cliente-Servidor.

---

# 📖 Sobre o projeto

O objetivo do QuantoTá? é ajudar consumidores a economizar durante suas compras, oferecendo um sistema simples para pesquisar produtos, comparar preços e visualizar os mercados que oferecem o menor valor.

Além disso, o sistema possui um painel administrativo para gerenciamento de usuários, produtos, mercados e preços cadastrados.

---

# ✨ Funcionalidades

✅ Cadastro de usuários

✅ Login

✅ Pesquisa de produtos

✅ Comparação de preços

✅ Consulta de mercados

✅ Lista de compras

✅ Cálculo do valor estimado da compra

✅ Cadastro de preços

✅ Cadastro de produtos

✅ Gerenciamento de mercados

✅ Aprovação de vendedores

✅ Painel administrativo

✅ Tema claro e escuro

---

# 👥 Perfis de usuários

### 👤 Usuário

* Criar conta
* Fazer login
* Pesquisar produtos
* Comparar preços
* Criar lista de compras
* Consultar mercados

### 🛒 Vendedor

* Solicitar acesso
* Cadastrar produtos
* Atualizar preços
* Gerenciar seus anúncios

### 👨‍💼 Administrador

* Gerenciar usuários
* Aprovar vendedores
* Gerenciar produtos
* Gerenciar mercados
* Gerenciar preços

---

# 🏗 Arquitetura

```text
Usuário
    │
    ▼
Frontend (HTML + CSS + JavaScript)
    │
Requisições HTTP
    │
    ▼
API REST (Spring Boot)
    │
Spring Data JPA
    │
    ▼
Banco de Dados MySQL
```

---

# 🛠 Tecnologias utilizadas

### Front-end

* HTML5
* CSS3
* JavaScript
* React
### Back-end

* Java
* Spring Boot
* Spring Data JPA
* Gradle

### Banco de Dados

* MySQL
* Docker (para conteinerização)
### Ferramentas

* IntelliJ IDEA
* VS Code
* Git
* GitHub

---

# 📁 Estrutura do projeto

```text
QuantoTa/

├── backend/
│   ├── src/
│   ├── gradle/
│   └── build.gradle
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── imagens/
│   └── index.html
│
├── database/
│
├── docs/
│
└── README.md
```

---

# 🚀 Como executar

## 1. Clone o projeto

```bash
git clone https://github.com/SEU-USUARIO/QuantoTa.git
```

---

## 2. Banco de Dados

Crie um banco chamado:

```sql
quantota
```

Configure o arquivo:

```
backend/src/main/resources/application.properties
```

com seu usuário e senha do MySQL.

---

## 3. Executando o Back-end

Abra a pasta **backend** no IntelliJ IDEA.

Execute a classe:

```
QuantotaApplication.java
```

A API ficará disponível em:

```
http://localhost:8080
```

---

## 4. Executando o Front-end

Abra a pasta **frontend**.

Depois:

* Execute utilizando o Live Server

ou

* Abra o arquivo `index.html`.

---

# 🔑 Usuário administrador

```
Email:
admin@quantota.com

Senha:
123456
```

---

# 📌 Próximas melhorias

* Login com JWT
* Senhas criptografadas (BCrypt)
* Upload de imagens
* Histórico de preços
* Favoritar mercados
* Pesquisa por localização
* Dashboard com gráficos

---

# 🎯 Objetivo acadêmico

Este projeto foi desenvolvido como atividade acadêmica para colocar em prática conhecimentos em:

* Programação Web
* Java
* Spring Boot
* APIs REST
* Banco de Dados
* HTML
* CSS
* JavaScript


---

# 👨‍💻 Autor

**Felipe Lima
**Francisco Mikael
**Pietro de Almeida

Técnico de Desenvolvimento de Sistemas — SENAC
-