<?php
declare(strict_types=1);

/**
 * Uso (apenas CLI):
 *   php add-admin-code.php "khaled bot" /caminho/absoluto/para/codigo.txt
 *
 * Lê o código do ficheiro, grava o hash bcrypt em admin_codes e imprime "ok".
 * Nunca imprime o código.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden\n";
    exit(1);
}

$label = $argv[1] ?? '';
$file = $argv[2] ?? '';

if ($label === '' || $file === '') {
    fwrite(STDERR, "Uso: php add-admin-code.php <etiqueta> <ficheiro-codigo-absoluto>\n");
    exit(2);
}

if ($file[0] !== '/') {
    fwrite(STDERR, "O caminho do ficheiro deve ser absoluto.\n");
    exit(2);
}

if (!is_file($file) || !is_readable($file)) {
    fwrite(STDERR, "Ficheiro ilegível.\n");
    exit(2);
}

$plain = trim((string) file_get_contents($file));
if ($plain === '') {
    fwrite(STDERR, "Código vazio.\n");
    exit(2);
}

require dirname(__DIR__) . '/bootstrap.php';

try {
    AdminCodes::create($pdo, $label, $plain);
} catch (InvalidArgumentException $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(2);
} catch (Throwable $e) {
    fwrite(STDERR, "Falha ao gravar.\n");
    exit(1);
}

echo "ok\n";
exit(0);
