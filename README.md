# 🎮 EduCa$h — Educação Financeira Gamificada

> **EduCa$h** é um jogo 2D isométrico desenvolvido para transformar a educação financeira numa experiência prática, interativa e acessível. O projeto procura tirar investidores iniciantes da "zona cega" e desmistificar o medo de investir através da simulação de tomada de decisões financeiras e gestão de património.

---

## 📌 Funcionalidades do MVP

Nesta versão **MVP (Minimum Viable Product)**, a aplicação conta com as seguintes áreas e mecânicas:

* **🏠 Home:** Tela inicial do sistema com navegação para as áreas principais.
* **📊 Dashboards:** Painel visual para acompanhamento de indicadores financeiros e métricas do jogador.
* **🗺️ Mapa 2D Isométrico (Game):** Navegação e interação visual dentro do ambiente do jogo na aba do mapa.

---

## 🛠️ Tecnologias e Stack

### **Front-end & Game Engine**
* **React** (com **Vite**) — Interface reativa e estrutura de componentes.
* **Tailwind CSS** & **PostCSS** — Estilização rápida e utilitária.
* **Tiled Map Editor** — Criação e design dos mapas e tilesets em visão isométrica (32x32).

### **Back-end & Banco de Dados**
* **SQL (MySQL)** — Modelagem e scripts de base de dados para persistência do jogo (localizados na pasta `/database`, em desenvolvimento).

---

## 📁 Estrutura do Repositório

```text
Projeto Educash/
├── database/          # Scripts SQL e modelagem de dados (em progresso)
├── dist/              # Build otimizado de produção
├── node_modules/      # Dependências do projeto
├── public/            # Ficheiros estáticos (tilesets, imagens e JSONs do Tiled)
├── src/
│   ├── assets/        # Recursos visuais (ícones, imagens, fontes)
│   ├── components/    # Componentes React reutilizáveis
│   ├── contexts/      # Gerenciamento de estado global (React Context API)
│   ├── game/          # Lógica do motor do jogo e mapa 2D
│   ├── pages/         # Telas da aplicação (Home, Dashboard, Mapa)
│   ├── App.css        # Estilos globais do componente App
│   ├── App.jsx        # Componente principal do React
│   ├── index.css      # Configuração global de estilos e diretivas do Tailwind
│   └── main.jsx       # Ponto de entrada do React (Vite)
├── .env               # Variáveis de ambiente locais (ignorado no Git)
├── .gitignore         # Ficheiros e pastas ignorados pelo Git
├── bun.lock            # Lockfile do gestor de pacotes Bun
├── eslint.config.js   # Configuração de linter para padronização do código
├── index.html         # Documento HTML principal da SPA
├── package-lock.json  # Lockfile de dependências npm
├── package.json       # Dependências e scripts do projeto
├── postcss.config.js  # Configurações do PostCSS para processamento do CSS
├── README.md          # Documentação do projeto
├── tailwind.config.js # Configuração customizada do Tailwind CSS
└── vite.config.js     # Configurações do ecossistema Vite
