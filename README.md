# Fogo Baixo — app de receitas

## Aula 08 — Supabase

O app agora se conecta a um banco Supabase na nuvem. Veja o passo a passo
completo (criar o projeto, pegar as chaves, preencher o `.env.local`,
criar a tabela `receitas` e rodar `npm run dev`) em **[SETUP_SUPABASE.md](./SETUP_SUPABASE.md)**.

## Estrutura do projeto

```
receitas-clean/
├── frontend/              ← todo o site (isso é o que vira o app e o que vai pro Pages)
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
├── backend/                ← reservado para uma futura API (hoje vazio, só um README)
├── capacitor.config.json   ← aponta o Capacitor para frontend/
├── package.json
├── .gitignore
└── .github/workflows/deploy-pages.yml   ← publica frontend/ no GitHub Pages a cada push
```

Antes você tinha tudo solto na raiz (`index.html`, `css/`, `js/`) mais a pasta `android/` gigante do Capacitor. Agora o site vive isolado em `frontend/`, o que resolve dois problemas: fica claro o que é código-fonte e o que é gerado, e dá pra apontar o GitHub Pages exatamente para essa pasta.

## Por que o GitHub Pages não estava aparecendo

O Pages só publica automaticamente se você configurar de onde ele deve ler os arquivos. Sem isso, ele não sabe que existe um `index.html` — mesmo que o repositório esteja no ar. Este projeto já vem com um workflow (`.github/workflows/deploy-pages.yml`) que resolve isso sozinho: a cada push na branch `main`, ele publica automaticamente o conteúdo de `frontend/`.

**O que você precisa fazer uma única vez, no GitHub:**
1. Vá em **Settings → Pages** no repositório.
2. Em **Source**, escolha **GitHub Actions** (não "Deploy from a branch").
3. Dê push nesse projeto para a branch `main`.
4. Espere a aba **Actions** do repositório terminar o workflow "Publicar no GitHub Pages" (ícone verde ✅).
5. O link do site aparece em **Settings → Pages**, algo como `https://seuusuario.github.io/nome-do-repo/`.

## Retomando o Capacitor

Como a pasta `android/` gerada localmente **não foi incluída** neste pacote (ela é pesada e é sempre regenerável), você recria ela assim, depois de colocar este projeto na sua máquina:

```powershell
npm install
npx cap add android
npx cap sync
npx cap open android
```

Depois disso, o ciclo de sempre continua igual: sempre que mudar algo em `frontend/`, rode `npx cap sync` de novo antes de testar no Android Studio.

## Subindo pro GitHub

Se esta pasta ainda não é um repositório Git:

```bash
git init
git add .
git commit -m "Estrutura inicial: frontend, backend e Capacitor"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

A pasta `android/` (quando você recriá-la) pode ser commitada normalmente — o `.gitignore` já está configurado para ignorar apenas o que é cache/build (Gradle, `node_modules`, etc.), não o projeto nativo em si.
