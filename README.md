# Simplex - Gerenciador de Finanças Pessoais

## 📋 Identificação do Projeto

| Campo | Informação |
|-------|------------|
| **Projeto** | Simplex - Gerenciador de Finanças Pessoais |
| **Disciplina** | Programação para Internet |
| **Professor** | Diogo Oliveira Santo |
| **Instituição** | IFG - Instituto Federal de Goiás |
| **Data** | Janeiro/2026 |

### 👥 Integrantes do Grupo

- Pedro Lucas Dutra
- Natanael Ventura
- Davi Souza
- Miqueias Silva
- Hian Motta

---

## 📝 Resumo

O **Simplex** é uma aplicação web completa para gerenciamento de finanças pessoais, desenvolvida com arquitetura cliente-servidor moderna. O sistema permite que usuários controlem suas receitas, despesas, orçamentos e metas financeiras de forma intuitiva e segura.

### Objetivo Principal
Fornecer uma ferramenta prática e visual para que usuários possam:
- Registrar e categorizar transações financeiras
- Definir e acompanhar orçamentos mensais
- Estabelecer metas de economia
- Visualizar relatórios e gráficos de desempenho financeiro
- Converter valores entre diferentes moedas

### Principais Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|-------------|
| **Front-end** | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI, React Query |
| **Back-end** | Java 17, Spring Boot 3.5, Spring Security, JWT |
| **Banco de Dados** | PostgreSQL com Flyway (migrations) |
| **Autenticação** | JWT + MFA (Google Authenticator) |
| **Documentação API** | Swagger/OpenAPI |

---

## 📖 Introdução

### Contexto do Projeto

No cenário econômico atual, o controle financeiro pessoal tornou-se uma habilidade essencial. Muitas pessoas enfrentam dificuldades em organizar suas finanças, resultando em gastos excessivos, falta de planejamento e dificuldade em atingir objetivos financeiros. A ausência de ferramentas adequadas para visualização e controle de receitas e despesas contribui significativamente para esse problema.

### Problema que o Sistema Busca Resolver

O Simplex foi desenvolvido para resolver os seguintes desafios:

1. **Desorganização Financeira**: Dificuldade em categorizar e acompanhar gastos diários
2. **Falta de Visibilidade**: Ausência de dashboards e gráficos que mostrem o panorama financeiro
3. **Planejamento Deficiente**: Dificuldade em estabelecer e acompanhar orçamentos mensais
4. **Metas não Atingidas**: Falta de ferramentas para definir e monitorar objetivos de economia
5. **Segurança**: Necessidade de proteção adequada para dados financeiros sensíveis

### Objetivos Específicos

| Objetivo | Descrição |
|----------|-----------|
| **Gerenciamento de Transações** | Permitir o registro, edição e exclusão de receitas e despesas com categorização |
| **Controle de Orçamentos** | Possibilitar a definição de limites de gastos por categoria |
| **Acompanhamento de Metas** | Oferecer ferramentas para criação e monitoramento de objetivos financeiros |
| **Visualização de Dados** | Apresentar gráficos e relatórios intuitivos sobre a saúde financeira |
| **Autenticação Segura** | Implementar login com JWT e autenticação de dois fatores (MFA) |
| **Conversão de Moedas** | Integrar API externa para conversão entre diferentes moedas |

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Browser)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        SIMPLEX FRONTEND                              │    │
│  │   React 18 + TypeScript + Vite + TailwindCSS + Shadcn/UI            │    │
│  │                                                                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │Dashboard │ │Transações│ │Orçamentos│ │  Metas   │ │Conversão │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  │                              │                                        │    │
│  │                     React Query + Axios                               │    │
│  └──────────────────────────────┼────────────────────────────────────────┘    │
└─────────────────────────────────┼───────────────────────────────────────────┘
                                  │ HTTP/REST (JSON)
                                  │ JWT Token (Authorization Header)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SIMPLEX BACKEND                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Spring Boot 3.5 + Java 17                        │    │
│  │                                                                       │    │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   │    │
│  │  │   Controllers   │───▶│    Services     │───▶│  Repositories   │   │    │
│  │  │  (REST API)     │    │ (Business Logic)│    │   (JPA/JDBC)    │   │    │
│  │  └─────────────────┘    └─────────────────┘    └────────┬────────┘   │    │
│  │           │                      │                       │            │    │
│  │  ┌────────▼────────┐    ┌───────▼───────┐               │            │    │
│  │  │ Spring Security │    │   MapStruct   │               │            │    │
│  │  │   JWT + MFA     │    │   (Mappers)   │               │            │    │
│  │  └─────────────────┘    └───────────────┘               │            │    │
│  └─────────────────────────────────────────────────────────┼────────────┘    │
└────────────────────────────────────────────────────────────┼────────────────┘
                                                              │
                      ┌───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│              PostgreSQL Database            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────┐ │
│  │ users  │ │transac-│ │ budget │ │ goal │ │
│  │        │ │  tion  │ │        │ │      │ │
│  └────────┘ └────────┘ └────────┘ └──────┘ │
│                                             │
│         Flyway Migrations                   │
└─────────────────────────────────────────────┘

                      │
                      │ API Externa
                      ▼
┌─────────────────────────────────────────────┐
│         Frankfurter API (Cotações)          │
│     https://api.frankfurter.dev/v1/         │
└─────────────────────────────────────────────┘
```

### Descrição dos Componentes

#### 🎨 Front-end (simplex-frotend)

| Componente | Tecnologia | Função |
|------------|------------|--------|
| **Framework** | React 18 | Biblioteca para construção de interfaces reativas |
| **Linguagem** | TypeScript | Tipagem estática para maior segurança do código |
| **Build Tool** | Vite | Bundler moderno com HMR (Hot Module Replacement) |
| **Estilização** | TailwindCSS | Framework CSS utilitário para design responsivo |
| **Componentes UI** | Shadcn/UI + Radix | Componentes acessíveis e customizáveis |
| **Requisições** | Axios + React Query | Gerenciamento de estado de servidor e cache |
| **Roteamento** | React Router DOM | Navegação SPA (Single Page Application) |
| **Formulários** | React Hook Form + Zod | Validação e gerenciamento de formulários |
| **Gráficos** | Recharts | Visualização de dados financeiros |

#### ⚙️ Back-end (simplex-backend)

| Componente | Tecnologia | Função |
|------------|------------|--------|
| **Framework** | Spring Boot 3.5.7 | Framework para aplicações Java enterprise |
| **Segurança** | Spring Security | Autenticação e autorização |
| **Tokens** | java-jwt 4.4.0 | Geração e validação de JWT |
| **MFA** | Google Authenticator | Autenticação de dois fatores via TOTP |
| **QR Code** | ZXing | Geração de QR codes para setup do MFA |
| **ORM** | Spring Data JPA | Mapeamento objeto-relacional |
| **Migrations** | Flyway | Versionamento do schema do banco |
| **Mapeamento** | MapStruct | Conversão entre entidades e DTOs |
| **Documentação** | Swagger/OpenAPI | Documentação interativa da API |

#### 🗄️ Banco de Dados

| Aspecto | Detalhe |
|---------|---------|
| **SGBD** | PostgreSQL |
| **Entidades Principais** | User, Transaction, Budget, Goal, Role |
| **Relacionamentos** | User → Transactions (1:N), User → Budgets (1:N), User → Goals (1:N) |
| **Migrations** | Gerenciadas pelo Flyway |

#### 🌐 Integração Externa

| API | URL | Função |
|-----|-----|--------|
| **Frankfurter** | https://api.frankfurter.dev/v1/ | Cotações de moedas em tempo real |

### Justificativa Técnica da Stack

#### Por que React + TypeScript?
- **Componentização**: Facilita reuso e manutenção do código
- **Tipagem**: TypeScript previne erros em tempo de desenvolvimento
- **Ecossistema**: Grande quantidade de bibliotecas e comunidade ativa
- **Performance**: Virtual DOM otimiza renderizações

#### Por que Spring Boot + Java?
- **Robustez**: Framework maduro e amplamente testado
- **Segurança**: Spring Security oferece proteção completa
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Mercado**: Alta demanda por desenvolvedores Java/Spring

#### Por que PostgreSQL?
- **Confiabilidade**: ACID compliance e integridade referencial
- **Performance**: Otimizado para consultas complexas
- **Extensibilidade**: Suporte a tipos de dados avançados
- **Open Source**: Sem custos de licenciamento

---

## ⚡ Funcionalidades Implementadas

### 1. Sistema de Autenticação e Autorização

**Descrição e Objetivo**  
Sistema completo de autenticação com suporte a JWT (JSON Web Tokens) e autenticação de dois fatores (MFA) via Google Authenticator. O sistema possui dois perfis de acesso: Administrador e Cliente.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FLUXO DE LOGIN                                   │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /login                                                │
│  2. Preenche email e senha                                               │
│  3. Frontend envia POST /auth/users/login-customer                       │
│  4. Backend valida credenciais (BCrypt)                                  │
│  5. Se MFA habilitado:                                                   │
│     → Retorna token temporário + status "MFA_REQUIRED"                   │
│     → Usuário é redirecionado para /2fa                                  │
│     → Insere código do Google Authenticator                              │
│     → POST /auth/users/mfa/verify                                        │
│     → Backend valida TOTP e retorna JWT definitivo                       │
│  6. Se MFA não habilitado:                                               │
│     → Retorna JWT diretamente                                            │
│  7. Frontend armazena token e redireciona para /dashboard                │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- Spring Security (configuração de endpoints protegidos)
- BCryptPasswordEncoder (hash de senhas)
- java-jwt (geração e validação de tokens)
- Google Authenticator Library (TOTP)
- ZXing (geração de QR Code para setup MFA)

---

### 2. CRUD de Transações Financeiras

**Descrição e Objetivo**  
Funcionalidade central do sistema que permite aos usuários registrar, visualizar, editar e excluir suas transações financeiras (receitas e despesas), com categorização e filtros.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CRIAR NOVA TRANSAÇÃO                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário clica em "Nova Transação" na página /transactions            │
│  2. Modal abre com formulário (React Hook Form + Zod validation)         │
│  3. Preenche: tipo, categoria, valor, descrição, data, método pagamento  │
│  4. Clica em "Salvar"                                                    │
│  5. Frontend envia POST /api/v1/customer/transaction/create              │
│     → Header: Authorization: Bearer {jwt}                                │
│     → Body: { transactionType, category, amount, description, ... }      │
│  6. Backend:                                                             │
│     → Valida token JWT                                                   │
│     → Extrai usuário do token                                            │
│     → TransactionService.createTransaction()                             │
│     → Salva no PostgreSQL via TransactionRepository                      │
│  7. Retorna TransactionDTO com dados salvos                              │
│  8. Frontend atualiza lista (React Query invalidation)                   │
│  9. Toast de sucesso exibido                                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    LISTAR E FILTRAR TRANSAÇÕES                           │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /transactions                                         │
│  2. useEffect dispara GET /api/v1/customer/transaction/find-all          │
│  3. Backend retorna lista de TransactionDTO do usuário                   │
│  4. Frontend renderiza tabela com dados                                  │
│  5. Usuário pode filtrar por:                                            │
│     → Busca textual (descrição)                                          │
│     → Tipo (Receita/Despesa)                                             │
│     → Categoria                                                          │
│  6. Filtros aplicados em tempo real no frontend                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- React Hook Form + Zod (validação de formulários)
- React Query (cache e sincronização)
- Axios (requisições HTTP)
- Spring Data JPA (persistência)
- MapStruct (conversão Entity ↔ DTO)

---

### 3. Gerenciamento de Orçamentos

**Descrição e Objetivo**  
Permite aos usuários definir limites de gastos mensais por categoria, acompanhando visualmente o consumo do orçamento através de gráficos.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CRIAR ORÇAMENTO MENSAL                                │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /budgets                                              │
│  2. Clica em "Novo Orçamento"                                            │
│  3. Preenche: categoria, valor limite, descrição, mês de referência      │
│  4. POST /api/v1/customer/budget/create                                  │
│  5. Backend salva Budget vinculado ao usuário                            │
│  6. Página exibe gráfico comparando orçamento vs gastos reais            │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- Recharts (visualização de gráficos)
- BudgetService + BudgetRepository (lógica de negócio)
- BudgetMapper (conversão de dados)

---

### 4. Definição e Acompanhamento de Metas

**Descrição e Objetivo**  
Funcionalidade que permite aos usuários estabelecer metas financeiras com prazo definido, acompanhando o progresso ao longo do tempo.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       CRIAR META FINANCEIRA                              │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário define meta (ex: "Economizar R$ 5.000 até dezembro")         │
│  2. Preenche: categoria, valor alvo, descrição, data início/fim          │
│  3. POST /api/v1/customer/goal/create                                    │
│  4. Backend salva Goal com período definido                              │
│  5. Dashboard exibe progresso da meta                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- GoalService + GoalRepository
- React Day Picker (seleção de datas)
- Progress components (visualização de progresso)

---

### 5. Dashboard com Visualização de Dados

**Descrição e Objetivo**  
Tela principal que apresenta visão consolidada das finanças do usuário através de cards informativos, gráficos de evolução e lista de transações recentes.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CARREGAR DASHBOARD                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /dashboard                                            │
│  2. Componente Dashboard.tsx monta                                       │
│  3. useEffect verifica role do usuário (ADMIN ou CUSTOMER)               │
│  4. Chama getAllCardCustomer() ou getAllCardAdmin()                      │
│  5. GET /api/v1/customer/dashboard/infos-cards                           │
│  6. Backend DashboardService calcula:                                    │
│     → Total de receitas do mês atual                                     │
│     → Total de despesas do mês atual                                     │
│     → Saldo (receitas - despesas)                                        │
│     → Comparativo com mês anterior (%)                                   │
│  7. GET /api/v1/customer/dashboard/infos-charts                          │
│  8. Backend retorna dados para gráficos de evolução                      │
│  9. Frontend renderiza:                                                  │
│     → 3 DashboardCards (Receitas, Despesas, Saldo)                       │
│     → FinancialChart (gráfico de barras)                                 │
│     → TrendChart (gráfico de tendência)                                  │
│     → TransactionList (últimas transações)                               │
│     → CurrencyRates (cotações de moedas)                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- Recharts (gráficos de barras e linha)
- DashboardService (agregação de dados)
- React Query (cache de dados)
- Componentes Shadcn/UI (cards, tabelas)

---

### 6. Conversão de Moedas (Integração com API Externa)

**Descrição e Objetivo**  
Funcionalidade que permite converter valores entre diferentes moedas utilizando taxas de câmbio obtidas da API Frankfurter.

**Fluxo de Execução**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CONVERTER MOEDAS                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Usuário acessa /currency-converter                                   │
│  2. Seleciona moeda de origem (ex: BRL)                                  │
│  3. Seleciona moeda de destino (ex: USD)                                 │
│  4. Digita valor a converter                                             │
│  5. Frontend calcula conversão usando taxas pré-carregadas               │
│  6. Exibe resultado e taxa de câmbio                                     │
│                                                                          │
│  [Backend - Atualização de Cotações]                                     │
│  → CurrencyService.getRates()                                            │
│  → GET https://api.frankfurter.dev/v1/{date}..{date}?base=BRL            │
│  → Retorna cotações do dia útil anterior                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tecnologias Envolvidas**
- RestTemplate (chamadas HTTP para API externa)
- Frankfurter API (https://api.frankfurter.dev)
- React Select components (seleção de moedas)

---

### Funcionalidades Extras (Bônus)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Tema Claro/Escuro** | Toggle entre temas com persistência (ThemeProvider) |
| **Design Responsivo** | Interface adaptável para desktop e mobile |
| **Toast Notifications** | Feedback visual para ações do usuário (Sonner) |
| **Loading States** | Indicadores de carregamento durante requisições |
| **Perfis de Acesso** | Diferenciação entre Admin e Customer |
| **Swagger UI** | Documentação interativa da API |

---

## 🔧 Implementação e Qualidade do Código

### Estrutura de Arquivos (Frontend)

```
simplex-frotend/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/               # Componentes Shadcn/UI
│   │   ├── DashboardCard.tsx
│   │   ├── FinancialChart.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionModal.tsx
│   │   └── ...
│   ├── context/              # Contextos React
│   │   ├── AuthContext.tsx   # Gerenciamento de autenticação
│   │   ├── LoadingContext.tsx
│   │   └── ProtectedLayout.tsx
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── Transactions.tsx
│   │   ├── Budgets.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── services/             # Camada de serviços (API)
│   │   ├── api.ts
│   │   ├── transactionsService.ts
│   │   ├── BudgetService.ts
│   │   └── ...
│   ├── lib/                  # Utilitários
│   └── App.tsx               # Componente raiz
├── public/                   # Assets estáticos
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

### Padrões de Código Adotados

#### TypeScript
- Tipagem explícita em interfaces e funções
- Uso de `type` para DTOs e `interface` para componentes
- Strict mode habilitado

#### React
- Componentes funcionais com hooks
- Separação de responsabilidades (pages, components, services)
- Context API para estado global (Auth, Loading, Theme)

#### Nomenclatura
- **Componentes**: PascalCase (`DashboardCard.tsx`)
- **Funções**: camelCase (`getAllTransactions`)
- **Constantes**: UPPER_SNAKE_CASE (`ENDPOINTS_WITH_AUTHENTICATION`)
- **Arquivos de serviço**: camelCase (`transactionsService.ts`)

### Controle de Versão (Git)

#### Padrão de Commits
```
docs: adiciona documentação do projeto
feat: implementa funcionalidade de login
fix: corrige validação de formulário
refactor: reorganiza estrutura de componentes
style: ajusta espaçamento no dashboard
```

#### Estrutura do Repositório
- Branch principal: `master`
- README.md com documentação completa
- .gitignore configurado para Node.js

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ e npm/bun
- Java 17+
- PostgreSQL 14+
- Git

### Frontend

```bash
# Clonar repositório
git clone https://github.com/SilvaMiqueias/simplex-frotend.git
cd simplex-frotend

# Instalar dependências
npm install
# ou
bun install

# Executar em desenvolvimento
npm run dev
# ou
bun dev

# Acessar em http://localhost:5173
```

### Backend

```bash
# Clonar repositório
git clone https://github.com/SilvaMiqueias/simplex-backend.git
cd simplex-backend

# Configurar banco de dados
# Criar database 'financial' no PostgreSQL

# Configurar application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/financial
# spring.datasource.username=seu_usuario
# spring.datasource.password=sua_senha

# Executar
./gradlew bootRun

# API disponível em http://localhost:8080
# Swagger UI em http://localhost:8080/swagger-ui.html
```

### Variáveis de Ambiente

#### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/financial
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
jwt.secret=sua-chave-secreta-aqui
```

#### Frontend
```typescript
// src/services/api.ts
export const api = axios.create({
  baseURL: "http://localhost:8080",
});
```

---

## 📚 Referências

- [React Documentation](https://react.dev/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Frankfurter API](https://www.frankfurter.app/)
- [JWT.io](https://jwt.io/)

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da disciplina de Programação para Internet do IFG.
