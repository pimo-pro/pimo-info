<?php
declare(strict_types=1);

final class Migrate
{
    public static function up(PDO $pdo): void
    {
        $pdo->exec("CREATE TABLE IF NOT EXISTS schema_migrations (
            id VARCHAR(64) PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        $migrations = [
            '001_init' => <<<'SQL'
CREATE TABLE IF NOT EXISTS projects (
  id CHAR(36) NOT NULL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'rascunho',
  data_json LONGTEXT NOT NULL,
  archived TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_projects_slug (slug),
  KEY idx_projects_archived (archived),
  KEY idx_projects_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_versions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id CHAR(36) NOT NULL,
  version_no INT UNSIGNED NOT NULL,
  data_json LONGTEXT NOT NULL,
  actor_role VARCHAR(40) NOT NULL,
  actor_label VARCHAR(120) NOT NULL DEFAULT '',
  note VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_proj_ver (project_id, version_no),
  KEY idx_pv_project (project_id),
  CONSTRAINT fk_pv_project FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS access_links (
  id CHAR(36) NOT NULL PRIMARY KEY,
  project_id CHAR(36) NOT NULL,
  role VARCHAR(40) NOT NULL,
  factory_key VARCHAR(80) NULL,
  token CHAR(64) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  label VARCHAR(120) NOT NULL DEFAULT '',
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_access_token (token),
  KEY idx_access_project (project_id),
  CONSTRAINT fk_access_project FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ip_hash CHAR(64) NOT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_la_ip_time (ip_hash, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS uploads (
  id CHAR(36) NOT NULL PRIMARY KEY,
  project_id CHAR(36) NULL,
  stored_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime VARCHAR(120) NOT NULL,
  size_bytes INT UNSIGNED NOT NULL,
  kind VARCHAR(40) NOT NULL DEFAULT 'image',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_uploads_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS approved_prices (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  project_id CHAR(36) NOT NULL,
  item_key VARCHAR(120) NOT NULL,
  factory_key VARCHAR(80) NOT NULL,
  price_eur DECIMAL(12,2) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_approved (project_id, item_key),
  CONSTRAINT fk_ap_project FOREIGN KEY (project_id) REFERENCES projects(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SQL,
            '002_settings' => <<<'SQL'
CREATE TABLE IF NOT EXISTS settings (
  setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SQL,
            '003_admin_codes' => <<<'SQL'
CREATE TABLE IF NOT EXISTS admin_codes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  label VARCHAR(120) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  KEY idx_admin_codes_revoked (revoked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SQL,
        ];

        foreach ($migrations as $id => $sql) {
            $st = $pdo->prepare('SELECT 1 FROM schema_migrations WHERE id = ?');
            $st->execute([$id]);
            if ($st->fetchColumn()) {
                continue;
            }
            $pdo->exec($sql);
            $ins = $pdo->prepare('INSERT INTO schema_migrations (id) VALUES (?)');
            $ins->execute([$id]);
        }
    }
}
