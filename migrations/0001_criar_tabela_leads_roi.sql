-- === MIGRATION LEADS ROI | inicio ===
CREATE TABLE IF NOT EXISTS leads_roi (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  instituicao TEXT NOT NULL,
  cargo TEXT,
  porte TEXT,
  visao TEXT NOT NULL DEFAULT 'empresa',
  mensagem TEXT,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_leads_roi_email ON leads_roi (email);
CREATE INDEX IF NOT EXISTS idx_leads_roi_criado_em ON leads_roi (criado_em);
-- === MIGRATION LEADS ROI | fim ===
