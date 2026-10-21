/* === API DE CENARIOS DE CREDENCIAMENTO V2 | inicio === */
const cabecalhosJson = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type,x-hss-adm-token',
};

function responder(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: cabecalhosJson });
}

export async function onRequestOptions() {
  return new Response(null, { headers: cabecalhosJson });
}

export async function onRequestGet(contexto) {
  const banco = contexto.env.DB;
  if (!banco) return responder({ sucesso: false, erro: 'Binding DB não configurado.' }, 500);

  const url = new URL(contexto.request.url);
  const incluirInativos = url.searchParams.get('incluirInativos') === '1';
  const consulta = incluirInativos
    ? 'SELECT dados_json FROM cenarios_credenciamento ORDER BY ordem ASC'
    : 'SELECT dados_json FROM cenarios_credenciamento WHERE ativo = 1 ORDER BY ordem ASC';
  const resultado = await banco.prepare(consulta).all();
  const dados = (resultado.results ?? []).map((linha) => JSON.parse(linha.dados_json));

  return responder({ sucesso: true, dados });
}

// Substitui o conjunto completo de cenarios publicado pelo ADM.
// Se a variavel HSS_ADM_TOKEN estiver configurada no Cloudflare, o cabecalho x-hss-adm-token precisa coincidir.
export async function onRequestPost(contexto) {
  const banco = contexto.env.DB;
  if (!banco) return responder({ sucesso: false, erro: 'Binding DB não configurado.' }, 500);

  const tokenEsperado = contexto.env.HSS_ADM_TOKEN;
  if (tokenEsperado && contexto.request.headers.get('x-hss-adm-token') !== tokenEsperado) {
    return responder({ sucesso: false, erro: 'Não autorizado.' }, 401);
  }

  let corpo;
  try {
    corpo = await contexto.request.json();
  } catch {
    return responder({ sucesso: false, erro: 'JSON inválido.' }, 400);
  }

  const cenarios = Array.isArray(corpo?.cenarios) ? corpo.cenarios : [];
  if (cenarios.length === 0 || cenarios.some((cenario) => !cenario?.id || !cenario?.nome || !Array.isArray(cenario?.etapas))) {
    return responder({ sucesso: false, erro: 'Envie ao menos um cenário com id, nome e etapas.' }, 400);
  }

  const comandos = [
    banco.prepare('DELETE FROM cenarios_credenciamento'),
    ...cenarios.map((cenario, indice) =>
      banco
        .prepare(
          `INSERT INTO cenarios_credenciamento (id, ordem, ativo, nome, dados_json, atualizado_em)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        )
        .bind(String(cenario.id), indice, cenario.ativo === false ? 0 : 1, String(cenario.nome), JSON.stringify(cenario)),
    ),
  ];

  await banco.batch(comandos);

  return responder({ sucesso: true, total: cenarios.length });
}
/* === API DE CENARIOS DE CREDENCIAMENTO V2 | fim === */
