# Configuração no servidor (Hostinger)

A ferramenta em `/orcamentos/` precisa de um ficheiro **fora** de `public_html`:

`/home/u100505900/domains/pimo.info/orcamentos-config.php`

Exemplo (valores inventados):

```php
<?php
return [
  'db_host' => 'localhost',
  'db_name' => '…',
  'db_user' => '…',
  'db_pass' => '…',
  'admin_code_hash' => '…', // password_hash('codigo', PASSWORD_BCRYPT)
  'app_secret' => '…',      // string longa aleatória
];
```

Pasta de imagens (também fora de `public_html`):

`/home/u100505900/domains/pimo.info/orcamentos-uploads/`

As tabelas MySQL são criadas automaticamente na primeira chamada.

Importar o projecto real: no painel, use **Importar JSON** com o ficheiro local (não está no repositório).

## Login de administrador

- **Código** (como antes) ou **email + palavra-passe** (`admin_users`).
- Definir conta: no painel («Definir email e palavra-passe») ou CLI  
  `php public/orcamentos/api/cli/set-admin-user.php "email@…" /abs/password.txt`  
  (bloqueado na web, como `add-admin-code.php`).
- Rate-limit de tentativas partilhado (`login_attempts`).
- A sessão usa cookie HttpOnly (`SameSite=Lax`) **e** o header `X-Pimo-Orc-Session` / `Authorization: Bearer` (token devolvido no login) para o browser não perder a sessão logo após o login.

## URLs por projecto

Cada projecto tem um link estável com base no `slug` (gerado na criação):

`https://pimo.info/orcamentos/<slug>/`

Ex.: `https://pimo.info/orcamentos/mille-etangs-kitchenette/`

- `/orcamentos/` (admin) lista os projectos com o respectivo link — nunca fica vazio.
- Com slug no caminho, o admin abre directamente esse projecto após o login.
- Ligações de partilha: `/orcamentos/<slug>/?v=<token>` (o formato antigo `/orcamentos/?v=<token>` continua válido).
- O `.htaccess` na raiz e em `public/orcamentos/` reescreve `/orcamentos/<slug>/` para a SPA (`index.html`), **antes** da regra que normaliza `index.html` e **fora** do redirect de trailing-slash dos directórios estáticos — assim o slug não cai no `ErrorDocument` `/404/`.
- Há também `public/orcamentos/mille-etangs-kitchenette/index.html` (cópia da SPA) para esse projecto existir como pasta real no FTP.
- Novos projectos recebem o slug automaticamente; o rewrite cobre slugs novos sem pasta física.
