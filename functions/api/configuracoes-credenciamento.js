/* === API DE CONFIGURACOES DE CREDENCIAMENTO | inicio === */
const cabecalhosJson = {
  'content-type': 'application/json; charset=utf-8',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
};

export async function onRequestOptions() {
  return new Response(null, { headers: cabecalhosJson });
}

export async function onRequestGet(contexto) {
  const banco = contexto.env.DB;
  const url = new URL(contexto.request.url);
  const incluirInativos = url.searchParams.get('incluirInativos') === '1';
  const consulta = incluirInativos
    ? 'SELECT * FROM configuracoes_credenciamento ORDER BY nome ASC'
    : 'SELECT * FROM configuracoes_credenciamento WHERE ativo = 1 ORDER BY nome ASC';
  const resultado = await banco.prepare(consulta).all();

  return new Response(JSON.stringify({ sucesso: true, dados: resultado.results ?? [] }), {
    headers: cabecalhosJson,
  });
}

export async function onRequestPost(contexto) {
  const banco = contexto.env.DB;
  const dados = await contexto.request.json();

  await banco
    .prepare(
      `INSERT INTO configuracoes_credenciamento (
        id, ativo, nome, categoria, publico_alvo, cenario_roi, descricao, premissa_site,
        tempo_sem_hss_dias, tempo_com_hss_dias,
        receita_mensal_por_medico, margem_liquida_percentual,
        horas_administrativas_por_credenciamento, custo_hora_administrativa,
        taxa_retrabalho_percentual, custo_retrabalho_por_medico,
        taxa_documentos_vencidos_percentual, custo_documento_vencido,
        custo_mensal_hss, custo_implantacao_hss,
        reducao_administrativa_percentual, reducao_retrabalho_percentual,
        taxa_no_show_atual, taxa_no_show_com_hss,
        percentual_repasse_clinica, custo_operacional_mensal_medico, investimento_inicial_medico,
        atualizado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        ativo = excluded.ativo,
        nome = excluded.nome,
        categoria = excluded.categoria,
        publico_alvo = excluded.publico_alvo,
        cenario_roi = excluded.cenario_roi,
        descricao = excluded.descricao,
        premissa_site = excluded.premissa_site,
        tempo_sem_hss_dias = excluded.tempo_sem_hss_dias,
        tempo_com_hss_dias = excluded.tempo_com_hss_dias,
        receita_mensal_por_medico = excluded.receita_mensal_por_medico,
        margem_liquida_percentual = excluded.margem_liquida_percentual,
        horas_administrativas_por_credenciamento = excluded.horas_administrativas_por_credenciamento,
        custo_hora_administrativa = excluded.custo_hora_administrativa,
        taxa_retrabalho_percentual = excluded.taxa_retrabalho_percentual,
        custo_retrabalho_por_medico = excluded.custo_retrabalho_por_medico,
        taxa_documentos_vencidos_percentual = excluded.taxa_documentos_vencidos_percentual,
        custo_documento_vencido = excluded.custo_documento_vencido,
        custo_mensal_hss = excluded.custo_mensal_hss,
        custo_implantacao_hss = excluded.custo_implantacao_hss,
        reducao_administrativa_percentual = excluded.reducao_administrativa_percentual,
        reducao_retrabalho_percentual = excluded.reducao_retrabalho_percentual,
        taxa_no_show_atual = excluded.taxa_no_show_atual,
        taxa_no_show_com_hss = excluded.taxa_no_show_com_hss,
        percentual_repasse_clinica = excluded.percentual_repasse_clinica,
        custo_operacional_mensal_medico = excluded.custo_operacional_mensal_medico,
        investimento_inicial_medico = excluded.investimento_inicial_medico,
        atualizado_em = CURRENT_TIMESTAMP`,
    )
    .bind(
      dados.id,
      dados.ativo ? 1 : 0,
      dados.nome,
      dados.categoria,
      dados.publicoAlvo ?? 'ambos',
      dados.cenarioRoi ?? 'hospital_credenciando_medico',
      dados.descricao ?? '',
      dados.premissaSite ?? '',
      dados.tempoSemHssDias ?? 0,
      dados.tempoComHssDias ?? 0,
      dados.receitaMensalPorMedico ?? 0,
      dados.margemLiquidaPercentual ?? 0,
      dados.horasAdministrativasPorCredenciamento ?? 0,
      dados.custoHoraAdministrativa ?? 0,
      dados.taxaRetrabalhoPercentual ?? 0,
      dados.custoRetrabalhoPorMedico ?? 0,
      dados.taxaDocumentosVencidosPercentual ?? 0,
      dados.custoDocumentoVencido ?? 0,
      dados.custoMensalHss ?? 0,
      dados.custoImplantacaoHss ?? 0,
      dados.reducaoAdministrativaPercentual ?? 0,
      dados.reducaoRetrabalhoPercentual ?? 0,
      dados.taxaNoShowAtual ?? 0,
      dados.taxaNoShowComHss ?? 0,
      dados.percentualRepasseClinica ?? 0,
      dados.custoOperacionalMensalMedico ?? 0,
      dados.investimentoInicialMedico ?? 0,
    )
    .run();

  return new Response(JSON.stringify({ sucesso: true }), { headers: cabecalhosJson });
}
/* === API DE CONFIGURACOES DE CREDENCIAMENTO | fim === */
