<?php
declare(strict_types=1);

final class ProjectService
{
    public static function list(PDO $pdo, bool $includeArchived = false): array
    {
        $sql = 'SELECT id, slug, title, status, archived, created_at, updated_at FROM projects';
        if (!$includeArchived) {
            $sql .= ' WHERE archived = 0';
        }
        $sql .= ' ORDER BY updated_at DESC';
        return $pdo->query($sql)->fetchAll();
    }

    public static function get(PDO $pdo, string $id): ?array
    {
        $st = $pdo->prepare('SELECT * FROM projects WHERE id = ?');
        $st->execute([$id]);
        $row = $st->fetch();
        if (!$row) {
            return null;
        }
        $row['data'] = json_decode($row['data_json'], true) ?: [];
        unset($row['data_json']);
        return $row;
    }

    public static function getBySlug(PDO $pdo, string $slug): ?array
    {
        $st = $pdo->prepare('SELECT * FROM projects WHERE slug = ? AND archived = 0');
        $st->execute([$slug]);
        $row = $st->fetch();
        if (!$row) {
            return null;
        }
        $row['data'] = json_decode($row['data_json'], true) ?: [];
        unset($row['data_json']);
        return $row;
    }

    public static function create(PDO $pdo, array $data, string $actorRole, string $actorLabel): array
    {
        $data = Filter::normalizeImport($data);
        $id = self::uuid();
        $projectMeta = $data['project'] ?? [];
        $title = (string) ($projectMeta['name'] ?? 'Novo orçamento');
        $slugBase = self::slugify((string) ($projectMeta['id'] ?? $title));
        $slug = self::uniqueSlug($pdo, $slugBase);
        $status = self::mapStatus((string) ($projectMeta['status'] ?? 'rascunho'));
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $st = $pdo->prepare(
            'INSERT INTO projects (id, slug, title, status, data_json) VALUES (?, ?, ?, ?, ?)'
        );
        $st->execute([$id, $slug, $title, $status, $json]);
        self::saveVersion($pdo, $id, $data, $actorRole, $actorLabel, 'criação');
        return self::get($pdo, $id);
    }

    public static function save(
        PDO $pdo,
        string $id,
        array $data,
        string $actorRole,
        string $actorLabel,
        string $note = 'gravação',
        ?string $status = null
    ): array {
        $data = Filter::normalizeImport($data);
        $title = (string) (($data['project']['name'] ?? null) ?: 'Orçamento');
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($status !== null) {
            $st = $pdo->prepare('UPDATE projects SET title = ?, status = ?, data_json = ? WHERE id = ? AND archived = 0');
            $st->execute([$title, $status, $json, $id]);
        } else {
            $st = $pdo->prepare('UPDATE projects SET title = ?, data_json = ? WHERE id = ? AND archived = 0');
            $st->execute([$title, $json, $id]);
        }
        if ($st->rowCount() === 0) {
            // still update if only JSON identical? check existence
            $exists = self::get($pdo, $id);
            if (!$exists || !empty($exists['archived'])) {
                Response::error('Projeto não encontrado.', 404);
            }
        }
        self::saveVersion($pdo, $id, $data, $actorRole, $actorLabel, $note);
        return self::get($pdo, $id);
    }

    public static function archive(PDO $pdo, string $id, string $actorRole, string $actorLabel): void
    {
        $proj = self::get($pdo, $id);
        if (!$proj) {
            Response::error('Projeto não encontrado.', 404);
        }
        $st = $pdo->prepare('UPDATE projects SET archived = 1 WHERE id = ?');
        $st->execute([$id]);
        self::saveVersion($pdo, $id, $proj['data'], $actorRole, $actorLabel, 'arquivo');
    }

    public static function duplicate(PDO $pdo, string $id, string $actorRole, string $actorLabel): array
    {
        $proj = self::get($pdo, $id);
        if (!$proj) {
            Response::error('Projeto não encontrado.', 404);
        }
        $data = $proj['data'];
        $data['project']['id'] = ($data['project']['id'] ?? 'copia') . '-copia';
        $data['project']['name'] = ($data['project']['name'] ?? 'Orçamento') . ' (cópia)';
        $data['project']['status'] = 'rascunho';
        $data['factory_quotes'] = [];
        $data['client_choice'] = [
            'material_option_id' => null,
            'set_code' => $data['client_choice']['set_code'] ?? 'recomendado',
            'with_installation' => true,
            'with_equipment' => true,
            'submitted_at' => null,
        ];
        return self::create($pdo, $data, $actorRole, $actorLabel);
    }

    public static function saveVersion(
        PDO $pdo,
        string $projectId,
        array $data,
        string $actorRole,
        string $actorLabel,
        string $note
    ): void {
        $st = $pdo->prepare('SELECT COALESCE(MAX(version_no), 0) FROM project_versions WHERE project_id = ?');
        $st->execute([$projectId]);
        $next = ((int) $st->fetchColumn()) + 1;
        $ins = $pdo->prepare(
            'INSERT INTO project_versions (project_id, version_no, data_json, actor_role, actor_label, note)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $ins->execute([
            $projectId,
            $next,
            json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            $actorRole,
            $actorLabel,
            $note,
        ]);
    }

    public static function versions(PDO $pdo, string $projectId): array
    {
        $st = $pdo->prepare(
            'SELECT id, version_no, actor_role, actor_label, note, created_at
             FROM project_versions WHERE project_id = ? ORDER BY version_no DESC'
        );
        $st->execute([$projectId]);
        return $st->fetchAll();
    }

    public static function restore(PDO $pdo, string $projectId, int $versionNo, string $actorRole, string $actorLabel): array
    {
        $st = $pdo->prepare(
            'SELECT data_json FROM project_versions WHERE project_id = ? AND version_no = ?'
        );
        $st->execute([$projectId, $versionNo]);
        $json = $st->fetchColumn();
        if ($json === false) {
            Response::error('Versão não encontrada.', 404);
        }
        $data = json_decode((string) $json, true) ?: [];
        return self::save($pdo, $projectId, $data, $actorRole, $actorLabel, 'restauro v' . $versionNo);
    }

    public static function mapStatus(string $s): string
    {
        $allowed = [
            'rascunho',
            'semente',
            'enviado_fabricas',
            'precos_fabricas',
            'enviado_cliente',
            'aceite',
        ];
        $map = [
            'draft' => 'rascunho',
            'semente' => 'rascunho',
            'enviado às fábricas' => 'enviado_fabricas',
            'enviado_as_fabricas' => 'enviado_fabricas',
            'preços das fábricas recebidos' => 'precos_fabricas',
            'enviado ao cliente' => 'enviado_cliente',
            'aceite' => 'aceite',
        ];
        $s = $map[$s] ?? $s;
        return in_array($s, $allowed, true) ? ($s === 'semente' ? 'rascunho' : $s) : 'rascunho';
    }

    public static function uuid(): string
    {
        $b = random_bytes(16);
        $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
        $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
    }

    public static function slugify(string $text): string
    {
        $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text) ?: $text;
        $text = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $text) ?? '');
        $text = trim($text, '-');
        return $text !== '' ? substr($text, 0, 80) : 'orcamento';
    }

    private static function uniqueSlug(PDO $pdo, string $base): string
    {
        $slug = $base;
        $i = 2;
        while (true) {
            $st = $pdo->prepare('SELECT 1 FROM projects WHERE slug = ?');
            $st->execute([$slug]);
            if (!$st->fetchColumn()) {
                return $slug;
            }
            $slug = $base . '-' . $i;
            $i++;
        }
    }
}
