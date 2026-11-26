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
