# 📅 Bálsamo Agenda

O **Bálsamo Agenda** é uma solução completa de agendamento online, projetada para facilitar a marcação de serviços, gestão de horários e controle de disponibilidade em tempo real.

## 🚀 Funcionalidades Principais
- **Calendário Interativo:** Visualização e seleção de datas e horários disponíveis.
- **Gestão de Buffer:** Lógica implementada para garantir intervalos entre os agendamentos.
- **Autenticação Segura:** Sistema de login utilizando JWT (JSON Web Tokens) e variáveis de ambiente seguras.
- **Painel Administrativo:** Área exclusiva para gestão de configurações e visualização de agendamentos.
- **API Rest:** Backend robusto preparado para lidar com requisições de agendamento e sincronização.

## 🛠️ Stack Tecnológica
- **Frontend:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** PostgreSQL (via Prisma ORM)
- **Autenticação:** JWT / NextAuth

🤖 Produtividade & IA

Este projeto contou com o auxílio de modelos de linguagem (IA) para otimização de algoritmos de agendamento, refatoração de código e auxílio no debug de middleware e autenticação JWT.

## ⚙️ Configuração do Ambiente
Para rodar o projeto localmente, você precisará configurar as variáveis de ambiente no arquivo `.env`:

```env
DATABASE_URL="sua_url_do_banco"
JWT_SECRET="seu_segredo_jwt"
NEXTAUTH_URL="http://localhost:3000"
```

🏃 Como executar
1. Instale as dependências:
  npm install
2. Execute as migrações do banco de dados:
  npx prisma migrate dev
3. Inicie o servidor de desenvolvimento:
   npm run dev

Este projeto demonstra a aplicação de conceitos avançados de Full Stack e arquitetura de software.

Desenvolvido por Fagner Santos
