<?php
declare(strict_types=1);

/**
 * Uso (apenas CLI):
 *   php set-admin-user.php "email@exemplo.com" /caminho/absoluto/para/password.txt
 *
 * Lê a palavra-passe do ficheiro, grava bcrypt em admin_users e imprime "ok".
 * Nunca imprime a palavra-passe.
 */
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Forbidden\n";
    exit(1);
}

$email = $argv[1] ?? '';
$file = $argv[2] ?? '';

if ($email === '' || $file === '') {
    fwrite(STDERR, "Uso: php set-admin-user.php <email> <ficheiro-password-absoluto>\n");
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
    fwrite(STDERR, "Palavra-passe vazia.\n");
    exit(2);
}

require dirname(__DIR__) . '/bootstrap.php';

try {
    AdminUsers::upsert($pdo, $email, $plain);
} catch (InvalidArgumentException $e) {
    fwrite(STDERR, $e->getMessage() . "\n");
    exit(2);
} catch (Throwable $e) {
    fwrite(STDERR, "Falha ao gravar.\n");
    exit(1);
}

echo "ok\n";
exit(0);
