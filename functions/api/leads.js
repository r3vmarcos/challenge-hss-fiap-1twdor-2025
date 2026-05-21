// === API DE LEADS COM CLOUDFLARE D1 | inicio ===
export async function onRequestPost(context) {
  try {
    const corpo = await context.request.json();
    const id = crypto.randomUUID();
    const agora = new Date().toISOString();

    if (!context.env.DB) {
      return new Response(JSON.stringify({ erro: 'Binding DB nao configurado.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
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

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (erro) {
    console.error('Erro ao salvar lead ROI', erro);

    return new Response(JSON.stringify({ erro: 'Erro ao salvar lead.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
// === API DE LEADS COM CLOUDFLARE D1 | fim ===
