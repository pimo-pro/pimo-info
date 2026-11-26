<?php
/**
 * Router para o servidor embutido do PHP (testes locais).
 * Em produção o .htaccess faz o equivalente.
 *
 *   php -S 127.0.0.1:8765 -t public public/router-orcamentos.php
 */
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . $uri;

if ($uri !== '/' && is_file($file)) {
    return false; // servir ficheiro real
}

// /orcamentos/<slug>/ → SPA
if (preg_match('#^/orcamentos/([a-z0-9][a-z0-9-]*)/?$#i', $uri, $m)) {
    $slug = strtolower($m[1]);
    if ($slug !== 'api') {
        $spa = __DIR__ . '/orcamentos/index.html';
        if (is_file($spa)) {
            header('Content-Type: text/html; charset=utf-8');
            header('X-Robots-Tag: noindex, nofollow, noarchive');
            readfile($spa);
            return true;
        }
    }
}

return false;
