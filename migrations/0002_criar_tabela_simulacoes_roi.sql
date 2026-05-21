-- === MIGRATION SIMULACOES ROI | inicio ===
CREATE TABLE IF NOT EXISTS simulacoes_roi (
  id TEXT PRIMARY KEY,
  visao TEXT NOT NULL,
  dados_json TEXT NOT NULL,
  resultado_json TEXT NOT NULL,
  roi_percentual REAL NOT NULL DEFAULT 0,
  ganho_liquido REAL NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_simulacoes_roi_visao ON simulacoes_roi (visao);
CREATE INDEX IF NOT EXISTS idx_simulacoes_roi_criado_em ON simulacoes_roi (criado_em);
-- === MIGRATION SIMULACOES ROI | fim ===
