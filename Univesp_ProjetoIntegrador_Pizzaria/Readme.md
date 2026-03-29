🍕 Pizza Delivery - Monorepo
------------------------------

Este projeto é um sistema de delivery de pizzaria completo, composto por um frontend web (React) e um backend API (Node.js).
O fluxo abrange desde a navegação no catálogo e personalização de pizzas até o checkout com integração de CEP e histórico de pedidos.

------------------------------
🚀 Tecnologias

* Frontend: React, TypeScript, Vite, Context API, Tailwind CSS.
* Backend: Node.js, Express, Knex.js, Zod (validação).
* Banco de Dados: PostgreSQL (via Supabase).
* Integrações: ViaCEP (Endereços) e JWT (Autenticação).

------------------------------
📦 Estrutura do Projeto
O projeto utiliza uma estrutura de monorepo dentro da pasta /apps:
1. Backend (API)
Localizado em apps/api, segue uma organização modular:

* Módulos: Divididos em catalog, customers e orders para facilitar a manutenção.
* Bootstrap: Ao iniciar, o servidor executa o ensureSchema() para criar tabelas e seedCatalogIfEmpty() para popular o cardápio inicial.
* CORS: Configurado via allowlist (variável WEB_ORIGIN) para garantir comunicações seguras entre o deploy da API (Render) e do Web (Vercel).
* Regras de Negócio (Pizza Personalizada):
* Suporta de 1 a 3 sabores.
   * Cálculo de preço baseado no maior valor entre os sabores escolhidos + taxa de borda recheada.
   * Validação de duplicatas e limites via backend.

2. Frontend (Web)
Localizado em apps/web, focado em experiência do usuário (UX):

* Estado Global: Gerenciamento de autenticação (AuthContext) e carrinho (CartContext) com persistência no localStorage.
* Integração ViaCEP: No cadastro, o preenchimento do endereço é automatizado ao digitar o CEP.
* Catálogo Dinâmico: Consome a API para listar produtos e abre um modal interativo para a montagem de pizzas personalizadas.
* Checkout Flexível: O usuário pode optar por usar o endereço salvo no perfil ou preencher um novo endereço de entrega para aquele pedido específico.

------------------------------
🛠️ Como rodar o projeto

   1. Clone o repositório:
   
   git clone https://github.com
   
   2. Configure as Variáveis de Ambiente:
   * Na /apps/api, crie um .env com DATABASE_URL (Postgres) e WEB_ORIGIN.
      * Na /apps/web, crie um .env com VITE_API_URL.
   3. Instale as dependências e inicie:
   
   npm install# Para rodar a API
   cd apps/api && npm run dev# Para rodar o Web
   cd apps/web && npm run dev
   
   
------------------------------
📐 Decisões Técnicas

* Imagens Locais: As imagens dos produtos são servidas pelo próprio frontend em /public/images, garantindo que o catálogo sempre tenha fotos disponíveis sem depender de links externos instáveis.
* Validação com Zod: Todos os dados que chegam na API são validados rigorosamente, evitando erros de "dados quebrados" no banco.
* Modelagem de Pizza: Em vez de criar centenas de combinações no banco, usamos um "produto base" + um payload de configuração, tornando o sistema escalável para novos sabores.

------------------------------
📝 Fluxo de Uso

   1. Home: Navegação e adição de itens ao carrinho.
   2. Auth: Login ou Cadastro (com busca de CEP).
   3. Checkout: Revisão de itens e escolha do local de entrega.
   4. Pedidos: Acompanhamento do histórico de compras realizadas.
