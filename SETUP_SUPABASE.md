# Aula 08 — Conectando o Fogo Baixo ao Supabase

Este guia documenta exatamente o que foi feito no projeto e o que **você**
ainda precisa fazer no seu próprio projeto Supabase para tudo funcionar.

## O que já está pronto no código

| Item pedido na aula | Onde está |
|---|---|
| SDK oficial (`@supabase/supabase-js`) | listado em `package.json` → `dependencies` |
| Variáveis de ambiente (`.env.local`) | `.env.local` (valores de exemplo) e `.env.example` (modelo) |
| Conector (`supabaseClient.js`) | `www/frontend/js/supabaseClient.js` |
| Primeira leitura (SELECT) | função `testarConexaoSupabase()` no final de `www/frontend/js/script.js` |
| Ponto de entrada do Vite | `index.html` (na raiz do projeto) — precisava existir para `npm run dev` funcionar |
| Script de dev | `"dev": "vite"` adicionado em `package.json` |

O `vite.config.js` também foi ajustado: antes ele apontava para uma pasta
`frontend/` que não existia na raiz (o projeto real usa `www/frontend/`), e
não havia `index.html`. Isso foi corrigido para o `npm run dev` e o
`npm run build` funcionarem de verdade, mantendo a saída em `www/dist`
(pasta que o Capacitor já espera, conforme `capacitor.config.json`).

## O que você precisa fazer agora (uma vez só)

### 1. Criar um projeto no Supabase
Acesse [supabase.com](https://supabase.com), crie uma conta/projeto novo
(gratuito) e espere o banco terminar de provisionar.

### 2. Pegar suas credenciais
No painel: **Project Settings → API**. Você vai precisar de dois valores:
- **Project URL** → algo como `https://xxxxxxxxxx.supabase.co`
- **anon public key** → uma chave longa (começa com `eyJ...`)

### 3. Preencher o `.env.local`
Abra o arquivo `.env.local` (já existe na raiz do projeto) e troque os
valores de exemplo pelos seus:

```
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sua-chave-aqui
```

> ⚠️ Nunca commite o `.env.local` — ele já está no `.gitignore`. Quem clonar
> o repositório deve copiar `.env.example` para `.env.local` e preencher
> com as próprias chaves.

### 4. Criar a tabela `receitas` no Supabase
No painel do Supabase, vá em **SQL Editor** e rode:

```sql
create table receitas (
  id bigint generated always as identity primary key,
  nome text not null,
  categoria text,
  tempo text,
  created_at timestamp with time zone default now()
);

-- Sem isso, a leitura pública fica bloqueada por padrão (Row Level Security)
alter table receitas enable row level security;

create policy "Leitura publica"
  on receitas
  for select
  using (true);

-- Alguns registros de teste, só para ver algo chegando na tela
insert into receitas (nome, categoria, tempo) values
  ('Brigadeiro Gourmet', 'doces', '20 min'),
  ('Pão de Queijo Mineiro', 'salgados', '40 min');
```

### 5. Instalar as dependências e rodar
```bash
npm install
npm run dev
```

Abra o app no navegador, aperte **F12** (DevTools) e veja a aba **Console**:
- Se tudo estiver certo, você verá `[Supabase] Registros recebidos da
  tabela "receitas": [...]` e, na tela, logo abaixo do contador de
  receitas, uma linha `✅ Conectado ao Supabase — 2 registro(s) encontrado(s)...`.
- Se faltar configurar o `.env.local`, aparece um aviso amarelo explicando
  o que fazer.
- Se a tabela não existir ou o RLS estiver bloqueando, aparece o erro
  exato devolvido pelo Supabase (assim dá para debugar sem adivinhar).

### 6. Sincronizar com o Capacitor (opcional, para testar no Android)
```bash
npm run build
npx cap sync
npx cap open android
```

## Por que o array `RECEITAS` continua no `script.js`?

Ele continua sendo o **conteúdo padrão/offline** do app — é assim que o
app funciona mesmo sem internet ou antes de você popular a tabela no
Supabase. A consulta `testarConexaoSupabase()` é a "primeira leitura"
pedida na aula: uma prova de que a ponte com o banco na nuvem está
funcionando. Migrar todo o app para renderizar a partir do Supabase
(trocar o `RECEITAS` local pelos dados vindos de `supabase.from('receitas').select('*')`)
é o passo natural da próxima aula, quando o CRUD completo entrar em cena.
