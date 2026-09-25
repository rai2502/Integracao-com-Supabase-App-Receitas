# backend/

Reservado para uma futura API (por exemplo, para buscar receitas de um banco de dados em vez da lista fixa em `frontend/js/script.js`, ou para autenticar usuários e salvar favoritos de verdade).

Hoje o app **não depende** desta pasta — ele funciona 100% como site estático em `frontend/`. Quando esse backend existir, o `frontend/js/script.js` passa a chamar essa API via `fetch()` em vez de usar o array `RECEITAS` fixo.
