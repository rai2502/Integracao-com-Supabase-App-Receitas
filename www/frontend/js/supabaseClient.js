// ============================================================
// supabaseClient.js
// ------------------------------------------------------------
// Este arquivo é o "conector" (Aula 08): a ponte entre o app
// (frontend, rodando no navegador ou dentro do Capacitor) e o
// banco de dados na nuvem (Supabase = BaaS, Backend as a Service).
//
// Ele NÃO guarda nenhuma receita nem lógica de tela — a única
// responsabilidade dele é criar UMA instância do cliente Supabase,
// já autenticada com as credenciais do projeto, e exportar essa
// instância para ser reaproveitada em qualquer outro arquivo.
// ============================================================

import { createClient } from '@supabase/supabase-js';

// As credenciais NUNCA ficam escritas aqui no código.
// Elas vêm das variáveis de ambiente (.env.local), que o Vite injeta
// em tempo de build/dev através de `import.meta.env`.
//
// Regra de segurança importante desta aula:
//   - A "anon public key" pode ficar exposta no app (ela é pública
//     por design e é protegida pelas regras de RLS no Supabase).
//   - A "service_role key" (chave de admin) JAMAIS deve entrar em um
//     app cliente/mobile — essa fica só no backend/servidor.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Checklist simples de configuração: se alguém esquecer de preencher
// o .env.local, é melhor avisar de forma clara no console do que deixar
// o app quebrar silenciosamente com um erro genérico de rede.
const chavesConfiguradas =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('SEU-PROJETO') &&
  !supabaseAnonKey.includes('SUA_CHAVE');

if (!chavesConfiguradas) {
  console.warn(
    '[Supabase] Variáveis de ambiente não configuradas (ou ainda com valores de exemplo).\n' +
    '→ Copie ".env.example" para ".env.local" e preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY\n' +
    '  com os dados do seu projeto (Supabase > Project Settings > API).\n' +
    '→ Depois de editar o .env.local, reinicie o "npm run dev".'
  );
}

// Cria a instância única do cliente Supabase — é ela que o resto do
// app usa para fazer consultas (select, insert, update, delete, auth...).
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'chave-nao-configurada'
);

export const supabaseConfigurado = chavesConfiguradas;
