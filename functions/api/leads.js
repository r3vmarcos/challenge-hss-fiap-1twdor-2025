// === API DE LEADS COM CLOUDFLARE D1 | inicio ===
const cabecalhosJson = {
  'Content-Type': 'application/json; charset=utf-8',
};

function responderJson(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: cabecalhosJson,
  });
}

export async function onRequestGet(context) {
  try {
    if (!context.env.DB) {
      return responderJson({ erro: 'Binding DB nao configurado.' }, 500);
    }

    const resultado = await context.env.DB.prepare(
      `SELECT id,nome,email,telefone,instituicao,cargo,porte,visao,mensagem,criado_em,atualizado_em,ativo
       FROM leads_roi
       WHERE ativo = 1
       ORDER BY criado_em DESC`,
    ).all();

    return responderJson({ ok: true, dados: resultado.results ?? [] });
  } catch (erro) {
    console.error('Erro ao listar leads ROI', erro);
    return responderJson({ erro: 'Erro ao listar leads.' }, 400);
  }
}

export async function onRequestPost(context) {
  try {
    const corpo = await context.request.json();
    const id = crypto.randomUUID();
    const agora = new Date().toISOString();

    if (!context.env.DB) {
      return responderJson({ erro: 'Binding DB nao configurado.' }, 500);
    }

    await context.env.DB.prepare(
      `INSERT INTO leads_roi (id,nome,email,telefone,instituicao,cargo,porte,visao,mensagem,criado_em,atualizado_em,ativo) VALUES (?,?,?,?,?,?,?,?,?,?,?,1)`,
    )
      .bind(
        id,
        String(corpo.nome ?? ''),
        String(corpo.email ?? ''),
        String(corpo.telefone ?? ''),
        String(corpo.instituicao ?? ''),
        String(corpo.cargo ?? ''),
        String(corpo.porte ?? ''),
        String(corpo.visao ?? 'empresa'),
        String(corpo.mensagem ?? ''),
        agora,
        agora,
      )
      .run();

    return responderJson({ ok: true, id });
  } catch (erro) {
    console.error('Erro ao salvar lead ROI', erro);

    return responderJson({ erro: 'Erro ao salvar lead.' }, 400);
  }
}
// === API DE LEADS COM CLOUDFLARE D1 | fim ===
