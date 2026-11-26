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

## URLs por projecto

Cada projecto tem um link estável com base no `slug` (gerado na criação):

`https://pimo.info/orcamentos/<slug>/`

Ex.: `https://pimo.info/orcamentos/mille-etangs-kitchenette/`

- `/orcamentos/` (admin) lista os projectos com o respectivo link — nunca fica vazio.
- Com slug no caminho, o admin abre directamente esse projecto após o login.
- Ligações de partilha: `/orcamentos/<slug>/?v=<token>` (o formato antigo `/orcamentos/?v=<token>` continua válido).
- O `.htaccess` em `public/orcamentos/` faz rewrite de `/orcamentos/<slug>/` para a SPA (`index.html`), com `noindex`.
- Novos projectos recebem o slug automaticamente.
