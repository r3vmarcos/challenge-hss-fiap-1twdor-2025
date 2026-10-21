/* === IA DE CENARIOS COM GEMINI | inicio === */
// Modulo compartilhado: roda na Cloudflare Pages Function (remoto) e no middleware do Vite (local).
// A chave nunca vai para o navegador; so este modulo conversa com o Gemini.

export const MODELO_PADRAO = 'gemini-3.6-flash';
const URL_GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAXIMO_MENSAGENS = 40;
const MAXIMO_CARACTERES = 2000;
const MAXIMO_TENTATIVAS = 9;
// Acima disso o visitante desiste; melhor cair para a proxima chave/modelo.
const TEMPO_LIMITE_TENTATIVA_MS = 30000;
// Teto da resposta inteira, somando as reservas: um 503 volta em ~1 s, mas modelos lentos podem levar 30 s cada.
const TEMPO_LIMITE_TOTAL_MS = 75000;
const TEMPO_MINIMO_TENTATIVA_MS = 5000;

const cabecalhosJson = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};
/* === IA DE CENARIOS COM GEMINI | fim === */

/* === INSTRUCOES DO ASSISTENTE | inicio === */
const INSTRUCOES = `Você é o assistente de simulação da Health Sync Solutions (HSS) e conversa em português do Brasil.

O QUE A HSS FAZ
A HSS é uma plataforma de credenciamento médico. Ela oferece onboarding digital do médico, cadastro único reutilizável
(o médico não recomeça do zero em outra instituição), triagem e validação estruturada de credenciais com checklist,
status e rastreabilidade de pendências, monitoramento de vencimento de documentos e integração com sistemas.
A HSS reduz fricção administrativa, papelada, retrabalho e falta de visibilidade.
A HSS NÃO acelera nem substitui: registro no CRM, RQE, abertura de empresa/PJ, licença sanitária, CNES, adequação de imóvel,
análise da comissão/diretoria técnica, negociação e assinatura de contrato, decisão de rede da operadora, configuração interna
dos sistemas do hospital. Nessas etapas use hssAtua=false e diasComHss igual a diasSemHss.

SEU TRABALHO
Montar, por meio de perguntas, um cenário de credenciamento para a calculadora de ROI. A calculadora faz todas as contas:
você só coleta e organiza as premissas. Nunca prometa resultado; os prazos com HSS são hipóteses de simulação.

COMO CONDUZIR (a calculadora pede só o principal; seja breve)
- Faça UMA pergunta curta por vez, em linguagem simples. Ofereça SEMPRE exatamente 4 sugestões de resposta rápida em "sugestoes", curtas e diferentes entre si. Cada sugestão é UMA opção só: nunca junte duas com "ou" ou "/" (em vez de "Hospital ou clínica", ofereça "Hospital" e "Clínica" separadas). Inclua uma opção como "Não sei" ou "Outro" quando fizer sentido.
- Pergunte só o essencial, nesta ordem e sem repetir o que já foi respondido (no máximo 5 perguntas):
  1) onde é o credenciamento (hospital, clínica, convênio/operadora, pronto atendimento/plantão, várias instituições, consultório) e quem simula (médico, instituição ou os dois);
  2) proponha as etapas e os prazos típicos do caso e peça só confirmação ou ajuste;
  3) a agenda: consultas (ou atendimentos por plantão) por dia e dias por semana;
  4) o valor recebido por consulta e quanto fica com o médico;
  5) se for médico: recém-formado ou quer incluir o curso de medicina? Se for instituição: quantos médicos credencia por mês?
- Todo o resto (impostos, horas de papelada, retrabalho, custo da equipe, custos de entrada, preço da HSS) preencha com as referências de mercado abaixo, sem perguntar.
- Se a pessoa disser "não sei", use a referência de mercado, diga qual valor usou e siga em frente.
- Se a pessoa fugir do assunto, responda em uma frase e volte ao cenário.

REFERÊNCIAS DE MERCADO NO BRASIL (out/2026; use quando a pessoa não informar)
- Consulta por convênio paga pela operadora: R$ 122 a R$ 140. Particular: mediana de R$ 400 a R$ 500 em especialidades, R$ 300 a R$ 350 em clínica geral. Mix típico de clínica (70% convênio): cerca de R$ 190.
- Repasse: médico fica com 70% quando emite o próprio documento, 60% quando a clínica fatura, 100% no consultório próprio. Pronto atendimento: plantão de 12 h paga R$ 1.200 a R$ 1.600 com 25 a 35 atendimentos (use valor por atendimento de R$ 120 e parte do médico de 40%).
- Agenda: consultas de 20 a 25 min (14 a 18 por turno de 6 h); faltas de 10% a 20% em clínicas privadas (ocupação 75%); agenda nova 50% a 70%; pronto atendimento 90%.
- Prazo de recebimento: convênio 30 a 60 dias; hospital recebe das operadoras em cerca de 80 dias e repassa depois; particular 0 a 30 dias.
- Impostos de PJ: Simples Anexo III 6% (com Fator R), Anexo V 15,5%, Lucro Presumido 13% a 17%. Padrão: 13%.
- Custos para ficar apto: anuidade do CRM R$ 948 (2026), ACLS cerca de R$ 1.090, seguro de responsabilidade civil R$ 4.000 a R$ 14.000 por ano, certificado digital R$ 120 a R$ 260, abertura de PJ R$ 500 a R$ 1.800. Médico já atuante: cerca de R$ 2.000; recém-formado: cerca de R$ 8.000.
- Curso de medicina: mensalidade média de R$ 9.500 a R$ 10.866 (use 10000) por 72 meses.
- Equipe: custo da hora cerca de R$ 45; 8 h por credenciamento sem HSS e 3 h com HSS; retrabalho 35% sem HSS e 15% com HSS; custo de cada retrabalho R$ 150 (instituição) e cerca de 1 h do médico.
- HSS (preço não público, hipótese): valor fixo de R$ 350 por médico credenciado, sem mensalidade nem implantação.
- Prazos de credenciamento: referências internacionais falam em 60 a 120 dias para hospitais e 90 a 120 dias para operadoras.

QUANDO CONCLUIR
Defina "concluido": true e preencha "cenario" por completo. Em "mensagem", resuma em 2 ou 3 frases o que foi montado,
diga quais valores vieram de referências de mercado e lembre que tudo pode ser ajustado na calculadora.
Enquanto não concluir, "cenario" deve ser null.

REGRAS DO CENÁRIO
- nome: até 60 caracteres. resumoSite: 1 frase para o visitante. limite: o que a HSS não acelera neste caso (1 frase).
- perspectivas: "medico", "instituicao" ou os dois.
- etapas: de 2 a 8, em ordem; dias corridos inteiros; diasComHss <= diasSemHss; nota curta explicando a hipótese.
  Reduções típicas nas etapas em que a HSS atua: coleta/envio de documentos 50% a 70%, triagem 50%, correções 60%, contrato/cadastro operacional 20% a 35%.
- premissas: valores em reais sem símbolo, percentuais de 0 a 100, horas e dias como números. Preencha TODOS os campos:
  consultasPorDia, diasAtendimentoSemana (1 a 7), ocupacaoPercentual, ticketMedio, parcelaMedicoPercentual, prazoRecebimentoDias, mesesAnalise (12; 60 com curso),
  retrabalhoSemHssPercentual, retrabalhoComHssPercentual, impostosPercentual, custoConsultaMedico, custoEntrada, horasMedicoSemHss (16; 20 a 24 para várias instituições),
  horasMedicoComHss (4 a 6), valorHoraMedico (ganho líquido por consulta × consultas por hora), custoRetrabalhoMedico (cerca de 1 h do médico), mensalidadeHssMedico (0),
  mensalidadeCurso e mesesCurso (0 se não incluir o curso), medicosPorMes, custoConsultaInstituicao (15 a 20), horasEquipeSemHss, horasEquipeComHss,
  custoHoraEquipe, custoRetrabalhoInstituicao, valorCredenciamentoHss (valor da HSS por médico credenciado).

Responda sempre e somente com o JSON do esquema.`;
/* === INSTRUCOES DO ASSISTENTE | fim === */

/* === INSTRUCOES DA CARREIRA | inicio === */
// Modo "carreira": monta o perfil de formacao (gastos do curso e atendimentos depois de formado), sem HSS.
const INSTRUCOES_CARREIRA = `Você é o assistente de simulação da Health Sync Solutions (HSS) e conversa em português do Brasil.

SEU TRABALHO
Montar, por meio de perguntas, um perfil de formação em medicina para a calculadora "ROI da carreira médica":
quanto custa a graduação e quanto tempo de profissão paga esse investimento. A calculadora faz todas as contas:
você só coleta e organiza as premissas. Esta calculadora não envolve a HSS; não fale de credenciamento.
Nunca prometa resultado; é uma simulação.

COMO CONDUZIR (seja breve)
- Faça UMA pergunta curta por vez, em linguagem simples. Ofereça SEMPRE exatamente 4 sugestões de resposta rápida em "sugestoes", curtas e diferentes entre si. Cada sugestão é UMA opção só: nunca junte duas com "ou" ou "/" (em vez de "Hospital ou clínica", ofereça "Hospital" e "Clínica" separadas). Inclua uma opção como "Não sei" ou "Outro" quando fizer sentido.
- Pergunte só o essencial, nesta ordem e sem repetir o que já foi respondido (no máximo 5 perguntas):
  1) universidade pública ou particular, e se é capital, interior ou cidade média;
  2) a mensalidade do 1º ano (se particular) e quantos anos de curso faltam ou o curso inteiro (padrão 6);
  3) o custo de vida por mês durante o curso;
  4) depois de formado: onde vai atender (plantão em pronto atendimento, consultório, convênio, vários lugares),
     quantos atendimentos por plantão ou dia e quantos plantões ou dias por mês;
  5) o custo de vida por mês depois de formado (se não souber, use o mesmo do curso).
- Todo o resto (reajuste, materiais, preparatório, valor por atendimento, repasse, impostos) preencha com as referências abaixo, sem perguntar.
- Se a pessoa disser "não sei", use a referência de mercado, diga qual valor usou e siga em frente.
- Se a pessoa fugir do assunto, responda em uma frase e volte ao perfil.

REFERÊNCIAS DE MERCADO (estudo de custos da graduação em medicina 2025-2026)
- Mensalidade do 1º ano: pública 0; particular no interior R$ 5.800 a R$ 7.500; mediana nacional R$ 11.415; ponta na capital cerca de R$ 14.500 (teto acima de R$ 15.700).
- Reajuste anual: 5% (projeção conservadora). Duração: 6 anos.
- Custo de vida por mês: interior R$ 2.250 a R$ 2.500; padrão R$ 3.500; metrópole R$ 5.000.
- Materiais e equipamentos no curso inteiro: R$ 18.000 (essencial), R$ 22.000 (padrão), R$ 30.000 (avançado).
- Preparatório e provas de residência: R$ 8.000 (digital), R$ 10.000 a R$ 20.000 (híbrido), R$ 42.000 (presencial premium); 0 se não fizer.
- Atendimentos: pronto atendimento 25 a 35 por plantão de 12 h, valor R$ 120 por atendimento e 40% para o médico; 8 a 15 plantões por mês.
  Consultório ou UBS: 14 a 18 por turno de 6 h. Convênio: R$ 122 a R$ 140 por consulta, 60% a 70% para o médico. Particular: R$ 300 a R$ 500; consultório próprio 100%.
- Impostos de PJ: Simples Anexo III 6%, Anexo V 15,5%, Lucro Presumido 13% a 17%. Padrão: 13%.
- Ganho líquido de um generalista recém-formado: R$ 10 mil a R$ 15 mil por mês.

QUANDO CONCLUIR
Defina "concluido": true e preencha "perfil" por completo. Em "mensagem", resuma em 2 ou 3 frases o que foi montado,
diga quais valores vieram de referências de mercado e lembre que tudo pode ser ajustado na calculadora.
Enquanto não concluir, "perfil" deve ser null.

REGRAS DO PERFIL
- nome: até 40 caracteres (ex.: "Particular em cidade média"). resumo: 1 frase curta.
- Valores em reais sem símbolo, percentuais de 0 a 100. anosCurso de 1 a 10.
- locais: de 1 a 5, um por lugar de atendimento, com nome curto, atendimentosPorDia, diasAtendimentoMes (1 a 31),
  valorAtendimento, parcelaMedicoPercentual e impostosPercentual.

Responda sempre e somente com o JSON do esquema.`;
/* === INSTRUCOES DA CARREIRA | fim === */

/* === ESQUEMA DA RESPOSTA | inicio === */
const CAMPOS_NUMERICOS = [
  'consultasPorDia', 'diasAtendimentoSemana', 'ocupacaoPercentual', 'ticketMedio', 'parcelaMedicoPercentual',
  'prazoRecebimentoDias', 'mesesAnalise', 'retrabalhoSemHssPercentual', 'retrabalhoComHssPercentual',
  'impostosPercentual', 'custoConsultaMedico', 'custoEntrada', 'horasMedicoSemHss', 'horasMedicoComHss',
  'valorHoraMedico', 'custoRetrabalhoMedico', 'mensalidadeHssMedico', 'mensalidadeCurso', 'mesesCurso',
  'medicosPorMes', 'custoConsultaInstituicao', 'horasEquipeSemHss', 'horasEquipeComHss', 'custoHoraEquipe',
  'custoRetrabalhoInstituicao', 'valorCredenciamentoHss',
];

const ESQUEMA_RESPOSTA = {
  type: 'object',
  properties: {
    mensagem: { type: 'string' },
    sugestoes: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    concluido: { type: 'boolean' },
    cenario: {
      type: 'object',
      nullable: true,
      properties: {
        nome: { type: 'string' },
        resumoSite: { type: 'string' },
        limite: { type: 'string' },
        perspectivas: { type: 'array', items: { type: 'string', enum: ['medico', 'instituicao'] } },
        etapas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nome: { type: 'string' },
              diasSemHss: { type: 'integer' },
              diasComHss: { type: 'integer' },
              hssAtua: { type: 'boolean' },
              nota: { type: 'string' },
            },
            required: ['nome', 'diasSemHss', 'diasComHss', 'hssAtua'],
          },
        },
        premissas: {
          type: 'object',
          properties: Object.fromEntries(CAMPOS_NUMERICOS.map((campo) => [campo, { type: 'number' }])),
        },
      },
      required: ['nome', 'perspectivas', 'etapas', 'premissas'],
    },
  },
  required: ['mensagem', 'sugestoes', 'concluido'],
};

const CAMPOS_CARREIRA = ['mensalidadeInicial', 'reajusteAnualPercentual', 'anosCurso', 'custoVidaMensal', 'materiais', 'preparatorioResidencia', 'custoVidaFormado'];
const CAMPOS_LOCAL = ['atendimentosPorDia', 'diasAtendimentoMes', 'valorAtendimento', 'parcelaMedicoPercentual', 'impostosPercentual'];

const ESQUEMA_CARREIRA = {
  type: 'object',
  properties: {
    mensagem: { type: 'string' },
    sugestoes: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
    concluido: { type: 'boolean' },
    perfil: {
      type: 'object',
      nullable: true,
      properties: {
        nome: { type: 'string' },
        resumo: { type: 'string' },
        ...Object.fromEntries(CAMPOS_CARREIRA.map((campo) => [campo, { type: 'number' }])),
        locais: {
          type: 'array',
          items: {
            type: 'object',
            properties: { nome: { type: 'string' }, ...Object.fromEntries(CAMPOS_LOCAL.map((campo) => [campo, { type: 'number' }])) },
            required: ['nome', ...CAMPOS_LOCAL],
          },
        },
      },
      required: ['nome', ...CAMPOS_CARREIRA, 'locais'],
    },
  },
  required: ['mensagem', 'sugestoes', 'concluido'],
};

// Instrucoes, esquema e campo do resultado de cada modo do assistente.
const MODOS = {
  cenario: { instrucoes: INSTRUCOES, esquema: ESQUEMA_RESPOSTA, campo: 'cenario' },
  carreira: { instrucoes: INSTRUCOES_CARREIRA, esquema: ESQUEMA_CARREIRA, campo: 'perfil' },
};
/* === ESQUEMA DA RESPOSTA | fim === */

/* === TENTATIVAS (CHAVE + MODELO) | inicio === */
// Le GEMINI_API_KEY / GEMINI_MODELO e as reservas GEMINI_API_KEY_2 / GEMINI_MODELO_2 ... _9.
// A ordem e a ordem de uso: a primeira e a principal, as demais so entram quando a anterior falha.
export function montarTentativasGemini(fonte = {}) {
  const tentativas = [];

  for (let indice = 1; indice <= MAXIMO_TENTATIVAS; indice += 1) {
    const sufixo = indice === 1 ? '' : `_${indice}`;
    const chave = String(fonte[`GEMINI_API_KEY${sufixo}`] ?? '').trim();
    if (!chave) continue;
    const modelo = String(fonte[`GEMINI_MODELO${sufixo}`] ?? '').trim() || MODELO_PADRAO;
    tentativas.push({ chave, modelo });
  }

  return tentativas;
}
/* === TENTATIVAS (CHAVE + MODELO) | fim === */

/* === APOIO | inicio === */
function responder(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), { status, headers: cabecalhosJson });
}

// O Gemini exige que a conversa comece pelo usuario e alterne papeis; mensagens seguidas do mesmo autor sao unidas.
function montarConteudos(mensagens, perspectiva, modo) {
  const abertura =
    modo === 'carreira'
      ? 'Quero montar o meu perfil de formação em medicina para a calculadora de ROI da carreira.'
      : perspectiva === 'medico'
        ? 'Quero montar um cenário de credenciamento. Sou médico.'
        : perspectiva === 'instituicao'
          ? 'Quero montar um cenário de credenciamento. Represento um hospital ou clínica.'
          : 'Quero montar um cenário de credenciamento para a calculadora (perfis médico e instituição).';
  const conteudos = [{ role: 'user', parts: [{ text: abertura }] }];

  for (const mensagem of mensagens) {
    const papel = mensagem.autor === 'ia' ? 'model' : 'user';
    const ultimo = conteudos[conteudos.length - 1];
    if (ultimo.role === papel) {
      ultimo.parts[0].text += `\n${mensagem.texto}`;
    } else {
      conteudos.push({ role: papel, parts: [{ text: mensagem.texto }] });
    }
  }

  return conteudos;
}

function validarMensagens(valor) {
  if (!Array.isArray(valor) || valor.length === 0 || valor.length > MAXIMO_MENSAGENS) return null;

  const mensagens = valor
    .filter((item) => item && typeof item.texto === 'string' && item.texto.trim())
    .map((item) => ({ autor: item.autor === 'ia' ? 'ia' : 'visitante', texto: item.texto.trim().slice(0, MAXIMO_CARACTERES) }));

  return mensagens.length > 0 ? mensagens : null;
}

function extrairTexto(resposta) {
  const partes = resposta?.candidates?.[0]?.content?.parts ?? [];
  return partes.map((parte) => (typeof parte.text === 'string' ? parte.text : '')).join('').trim();
}

function interpretarJson(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    const inicio = texto.indexOf('{');
    const fim = texto.lastIndexOf('}');
    if (inicio < 0 || fim <= inicio) return null;
    try {
      return JSON.parse(texto.slice(inicio, fim + 1));
    } catch {
      return null;
    }
  }
}
/* === APOIO | fim === */


/* === CHAMADA AO GEMINI | inicio === */
// Uma tentativa: devolve { dados } quando o modelo respondeu o JSON esperado ou { falha } com o motivo.
async function chamarGemini({ chave, modelo }, conteudos, tempoLimiteMs, modo = MODOS.cenario) {
  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), tempoLimiteMs);

  try {
    const resposta = await fetch(`${URL_GEMINI}/${encodeURIComponent(modelo)}:generateContent`, {
      method: 'POST',
      signal: controle.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: modo.instrucoes }] },
        contents: conteudos,
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
          responseSchema: modo.esquema,
        },
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => '');
      return { falha: { status: resposta.status, detalhe: detalhe.slice(0, 300) } };
    }

    const dados = interpretarJson(extrairTexto(await resposta.json()));
    if (!dados || typeof dados.mensagem !== 'string') return { falha: { status: 'formato', detalhe: 'JSON fora do esquema' } };
    return { dados };
  } catch (erro) {
    return { falha: { status: controle.signal.aborted ? 'tempo' : 'rede', detalhe: String(erro?.cause?.code ?? erro?.message ?? erro) } };
  } finally {
    clearTimeout(temporizador);
  }
}

function descreverStatus(status) {
  const descricoes = { 503: 'sobrecarregado', 429: 'limite de uso', 404: 'modelo indisponível', 400: 'chave ou pedido recusado', 403: 'sem permissão' };
  return descricoes[status] ?? (status === 'tempo' ? 'demorou demais' : status === 'rede' ? 'falha de rede' : status === 'formato' ? 'resposta fora do formato' : `HTTP ${status}`);
}

function explicarFalha(falhas) {
  const status = falhas.map((falha) => falha.status);
  if (status.every((item) => item === 'rede')) return 'Não foi possível falar com o Gemini. Verifique a conexão.';
  if (status.includes(429) || status.includes(503)) return 'O Gemini está sobrecarregado agora. Tente de novo em instantes.';
  if (status.includes('tempo')) return 'O Gemini demorou demais para responder. Tente de novo.';
  if (status.includes(400) || status.includes(403) || status.includes(404)) return 'Chaves ou modelos do Gemini recusados. Confira config/gemini.env.';
  return 'O Gemini não respondeu como esperado. Envie a mensagem de novo.';
}
/* === CHAMADA AO GEMINI | fim === */

/* === TRATAMENTO DA REQUISICAO | inicio === */
// Recebe { mensagens: [{ autor: 'visitante' | 'ia', texto }], perspectiva, modo } e devolve a proxima fala da IA.
// modo "carreira" devolve "perfil" (formacao); o padrao devolve "cenario" (credenciamento).
// opcoes.tentativas: lista [{ chave, modelo }] em ordem de preferencia (ver montarTentativasGemini).
export async function tratarRequisicaoIaCenario(requisicao, opcoes = {}) {
  if (requisicao.method === 'OPTIONS') return new Response(null, { status: 204, headers: cabecalhosJson });
  if (requisicao.method !== 'POST') return responder({ sucesso: false, erro: 'Use POST.' }, 405);

  const tentativas = (Array.isArray(opcoes.tentativas) ? opcoes.tentativas : []).filter((item) => item?.chave);
  if (tentativas.length === 0) {
    return responder(
      {
        sucesso: false,
        erro: 'A IA ainda não foi configurada. Coloque a chave do Gemini em config/gemini.env (local) ou no secret GEMINI_API_KEY do Cloudflare (remoto).',
      },
      503,
    );
  }

  let corpo;
  try {
    corpo = await requisicao.json();
  } catch {
    return responder({ sucesso: false, erro: 'JSON inválido.' }, 400);
  }

  const mensagens = validarMensagens(corpo?.mensagens);
  if (!mensagens) return responder({ sucesso: false, erro: 'Envie de 1 a 40 mensagens.' }, 400);

  const perspectiva = corpo?.perspectiva === 'medico' || corpo?.perspectiva === 'instituicao' ? corpo.perspectiva : null;
  const nomeModo = corpo?.modo === 'carreira' ? 'carreira' : 'cenario';
  const modo = MODOS[nomeModo];
  const conteudos = montarConteudos(mensagens, perspectiva, nomeModo);
  const falhas = [];
  const inicio = Date.now();

  // Fallback: se a chave/modelo principal falhar (sobrecarga, limite, modelo indisponivel, demora), tenta a proxima.
  for (const [indice, tentativa] of tentativas.entries()) {
    const restante = TEMPO_LIMITE_TOTAL_MS - (Date.now() - inicio);
    if (restante < TEMPO_MINIMO_TENTATIVA_MS) {
      falhas.push({ status: 'tempo', detalhe: 'tempo total esgotado' });
      break;
    }

    const { dados, falha } = await chamarGemini(tentativa, conteudos, Math.min(TEMPO_LIMITE_TENTATIVA_MS, restante), modo);

    if (dados) {
      const proposta = dados[modo.campo];
      const resultado = dados.concluido && proposta && typeof proposta === 'object' ? proposta : null;
      return responder({
        sucesso: true,
        mensagem: dados.mensagem,
        sugestoes: Array.isArray(dados.sugestoes) ? dados.sugestoes.filter((item) => typeof item === 'string').slice(0, 4) : [],
        concluido: Boolean(resultado),
        [modo.campo]: resultado,
        modelo: tentativa.modelo,
      });
    }

    falhas.push(falha);
    // Falha isolada e esperada (o fallback resolve): uma linha curta, sem o corpo do erro do Google.
    const proxima = tentativas[indice + 1];
    console.warn(
      `IA: tentativa ${indice + 1} (${tentativa.modelo}) indisponível [${descreverStatus(falha.status)}]` +
        (proxima ? `; tentando ${proxima.modelo}.` : '; sem mais reservas.'),
    );
  }

  console.error('IA: todas as tentativas falharam.', falhas.map((falha) => `${falha.status}: ${falha.detalhe.slice(0, 120)}`));
  return responder({ sucesso: false, erro: explicarFalha(falhas) }, 502);
}
/* === TRATAMENTO DA REQUISICAO | fim === */
