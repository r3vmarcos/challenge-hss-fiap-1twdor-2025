-- === TABELA DE CENARIOS DE CREDENCIAMENTO V2 | inicio ===
-- Cada cenario guarda etapas (dias sem/com HSS) e premissas padrao por perspectiva em dados_json.
CREATE TABLE IF NOT EXISTS cenarios_credenciamento (
  id TEXT PRIMARY KEY,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo INTEGER NOT NULL DEFAULT 1,
  nome TEXT NOT NULL,
  dados_json TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- === TABELA DE CENARIOS DE CREDENCIAMENTO V2 | fim ===
