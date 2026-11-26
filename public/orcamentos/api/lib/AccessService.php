<?php
declare(strict_types=1);

final class AccessService
{
    public static function listForProject(PDO $pdo, string $projectId): array
    {
        $st = $pdo->prepare(
            'SELECT id, project_id, role, factory_key, token, label, revoked, created_at, updated_at
             FROM access_links WHERE project_id = ? ORDER BY created_at'
        );
        $st->execute([$projectId]);
        return $st->fetchAll();
    }

    /** Cria link+código. Devolve o código em claro uma única vez. */
    public static function create(
        PDO $pdo,
        string $projectId,
        string $role,
        ?string $factoryKey,
        string $label = ''
    ): array {
        $allowed = ['khaled', 'filipe', 'factory', 'client'];
        if (!in_array($role, $allowed, true)) {
            Response::error('Papel inválido.');
        }
        if ($role === 'factory' && (!$factoryKey || $factoryKey === '')) {
            Response::error('A vista de fábrica exige uma chave de fábrica.');
        }
        $id = ProjectService::uuid();
        $token = Auth::randomToken(24);
        $code = Auth::randomCode(8);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        $st = $pdo->prepare(
            'INSERT INTO access_links (id, project_id, role, factory_key, token, code_hash, label)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $st->execute([$id, $projectId, $role, $factoryKey, $token, $hash, $label]);
        return [
            'id' => $id,
            'role' => $role,
            'factory_key' => $factoryKey,
            'token' => $token,
            'code' => $code,
            'label' => $label,
            'path' => self::sharePath($pdo, $projectId, $token),
        ];
    }

    /** Ligação de partilha: preferir /orcamentos/<slug>/?v=…; fallback /orcamentos/?v=… */
    public static function sharePath(PDO $pdo, string $projectId, string $token): string
    {
        $proj = ProjectService::get($pdo, $projectId);
        $slug = is_array($proj) ? (string) ($proj['slug'] ?? '') : '';
        if ($slug !== '' && preg_match('/^[a-z0-9][a-z0-9-]*$/', $slug)) {
            return '/orcamentos/' . rawurlencode($slug) . '/?v=' . rawurlencode($token);
        }
        return '/orcamentos/?v=' . rawurlencode($token);
    }

    public static function revoke(PDO $pdo, string $accessId): void
    {
        $st = $pdo->prepare('UPDATE access_links SET revoked = 1 WHERE id = ?');
        $st->execute([$accessId]);
    }

    /** Troca o código; devolve o novo em claro. */
    public static function rotateCode(PDO $pdo, string $accessId): array
    {
        $st = $pdo->prepare('SELECT * FROM access_links WHERE id = ? AND revoked = 0');
        $st->execute([$accessId]);
        $row = $st->fetch();
        if (!$row) {
            Response::error('Ligação não encontrada.', 404);
        }
        $code = Auth::randomCode(8);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        $token = Auth::randomToken(24);
        $up = $pdo->prepare('UPDATE access_links SET code_hash = ?, token = ? WHERE id = ?');
        $up->execute([$hash, $token, $accessId]);
        return [
            'id' => $accessId,
            'role' => $row['role'],
            'factory_key' => $row['factory_key'],
            'token' => $token,
            'code' => $code,
            'label' => $row['label'],
            'path' => self::sharePath($pdo, (string) $row['project_id'], $token),
        ];
    }

    public static function findByToken(PDO $pdo, string $token): ?array
    {
        $st = $pdo->prepare('SELECT * FROM access_links WHERE token = ? AND revoked = 0');
        $st->execute([$token]);
        $row = $st->fetch();
        return $row ?: null;
    }
}
