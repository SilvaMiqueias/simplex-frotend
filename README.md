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
