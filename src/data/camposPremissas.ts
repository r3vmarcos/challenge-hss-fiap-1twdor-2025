import type { CampoPremissa, PerspectivaRoi } from '@/types/calculadora';

/* === TIPOS DOS CAMPOS | inicio === */
export type GrupoPremissa = 'agenda' | 'medico' | 'instituicao';

export interface DefinicaoCampoPremissa {
  rotulo: string;
  info: string;
  // Onde o valor entra na formula; aparece no "i" do ADM e da calculadora.
  entraEm: string;
  grupo: GrupoPremissa;
  prefixo?: string;
  sufixo?: string;
  min?: number;
  max?: number;
}
/* === TIPOS DOS CAMPOS | fim === */

/* === CATALOGO DE CAMPOS | inicio === */
export const CAMPOS_PREMISSAS: Record<CampoPremissa, DefinicaoCampoPremissa> = {
  consultasPorDia: {
    grupo: 'agenda',
    rotulo: 'Consultas por dia de atendimento',
    info: 'Quantas consultas um médico faz em um dia (ou plantão) nesse lugar. Divida as horas pela duração média da consulta: 6 horas com consultas de 20 a 25 minutos dão 14 a 18. Um plantão de 12 horas em pronto atendimento costuma ter 25 a 35 atendimentos.',
    entraEm: 'Margem diária = consultas × ocupação × margem por consulta × dias por semana ÷ 7.',
  },
  diasAtendimentoSemana: {
    grupo: 'agenda',
    rotulo: 'Dias de atendimento por semana',
    info: 'Em quantos dias da semana o médico atende nesse lugar. Se atende só às terças e quintas, use 2. Para plantão contínuo, use 7.',
    entraEm: 'Converte a margem de um dia de agenda em margem por dia corrido (× dias ÷ 7), que é a unidade dos prazos.',
    sufixo: 'dias',
    min: 1,
    max: 7,
  },
  ocupacaoPercentual: {
    grupo: 'agenda',
    rotulo: 'Ocupação da agenda',
    info: 'Quanto da agenda a demanda real preenche, já descontadas as faltas (em clínicas privadas, 10% a 20% dos pacientes faltam). Agenda madura: 75% a 90%. Começando em um lugar novo: 50% a 70%. Pronto atendimento: 90% ou mais.',
    entraEm: 'Margem diária. Garante que só se conte o ganho de dias antecipados que teriam pacientes de verdade.',
    sufixo: '%',
    max: 100,
  },
  ticketMedio: {
    grupo: 'agenda',
    rotulo: 'Valor recebido por consulta',
    info: 'Valor médio que de fato entra por consulta, antes do repasse. Em 2026, operadoras pagam cerca de R$ 122 a R$ 140 pela consulta eletiva; o particular tem mediana de R$ 400 a R$ 500 em especialidades. Se atende os dois, use a média ponderada (70% convênio e 30% particular dá cerca de R$ 190).',
    entraEm: 'Margem por consulta dos dois lados: médico (× parte do médico) e instituição (× parte da instituição).',
    prefixo: 'R$',
  },
  parcelaMedicoPercentual: {
    grupo: 'agenda',
    rotulo: 'Parte do valor que fica com o médico',
    info: 'Quanto do valor da consulta fica com o médico. O mais comum é 70% quando o médico emite o próprio documento e 60% quando a clínica fatura. Em pronto atendimento, o plantão costuma equivaler a 35% a 45% do faturado. No consultório próprio, 100%. A instituição fica com o restante.',
    entraEm: 'Margem do médico (× esta parte) e margem da instituição (× 100% menos esta parte).',
    sufixo: '%',
    max: 100,
  },
  prazoRecebimentoDias: {
    grupo: 'agenda',
    rotulo: 'Dias entre atender e receber',
    info: 'Dias entre a consulta e o dinheiro cair na conta. Convênios pagam em 30 a 60 dias; hospitais recebem das operadoras em cerca de 80 dias (Anahp, 2025) e só então repassam. Particular: na hora ou em até 30 dias no cartão.',
    entraEm: 'Atrasa o início das entradas: soma ao prazo de liberação no saldo do médico e no payback no calendário da instituição.',
    sufixo: 'dias',
  },
  mesesAnalise: {
    grupo: 'agenda',
    rotulo: 'Período da simulação',
    info: 'Por quantos meses a simulação projeta o resultado. 12 meses mostra o primeiro ano; 24 ou 36 mostram o médio prazo.',
    entraEm: 'Multiplica mensalidades e benefícios mensais; define o horizonte do ROI e dos gráficos acumulados.',
    sufixo: 'meses',
    min: 1,
  },
  retrabalhoSemHssPercentual: {
    grupo: 'agenda',
    rotulo: 'Dossiês que voltam com pendência, sem HSS',
    info: 'No processo tradicional, de 30% a 40% dos dossiês voltam com alguma pendência (documento faltando, vencido ou ilegível).',
    entraEm: 'Custo esperado de retrabalho = esta chance × custo de cada retrabalho (médico e instituição).',
    sufixo: '%',
    max: 100,
  },
  retrabalhoComHssPercentual: {
    grupo: 'agenda',
    rotulo: 'Dossiês que voltam com pendência, com HSS',
    info: 'Com checklist e validação estruturada na HSS, a hipótese é de cerca de 15%. Substitua pelo número medido em piloto.',
    entraEm: 'Retrabalho evitado = (chance sem HSS − chance com HSS) × custo de cada retrabalho.',
    sufixo: '%',
    max: 100,
  },
  impostosPercentual: {
    grupo: 'medico',
    rotulo: 'Impostos sobre o que o médico recebe',
    info: 'Imposto médio sobre o que o médico recebe como PJ: Simples Nacional Anexo III 6% (exige Fator R de 28%), Anexo V a partir de 15,5%, Lucro Presumido de 13% a 17% conforme o ISS da cidade. Na dúvida, 13%.',
    entraEm: 'Margem do médico por consulta = valor × parte do médico × (1 − impostos) − custo por consulta.',
    sufixo: '%',
    max: 100,
  },
  custoConsultaMedico: {
    grupo: 'medico',
    rotulo: 'Custo do médico por consulta',
    info: 'Gastos do médico a cada atendimento, como materiais, estacionamento ou taxa de sala. Se não houver, deixe 0.',
    entraEm: 'Subtraído da margem do médico por consulta.',
    prefixo: 'R$',
  },
  custoEntrada: {
    grupo: 'medico',
    rotulo: 'Custos para ficar apto a atender',
    info: 'Tudo que o médico paga para atender nesse lugar. Referências 2026: anuidade do CRM R$ 948, ACLS cerca de R$ 1.090, seguro de responsabilidade civil R$ 4.000 a R$ 14.000 por ano, certificado digital R$ 120 a R$ 260, abertura de PJ R$ 500 a R$ 1.800. Quem já atua costuma gastar só renovações e exames. É igual com ou sem HSS.',
    entraEm: 'Custo para entrar e saldo inicial do médico; define em quantos meses ele recupera o que gastou.',
    prefixo: 'R$',
  },
  horasMedicoSemHss: {
    grupo: 'medico',
    rotulo: 'Horas do médico com papelada, sem HSS',
    info: 'Horas que o médico gasta reunindo, digitalizando, enviando e corrigindo documentos no processo tradicional. Entre 10 e 20 horas é comum.',
    entraEm: 'Custo do tempo do médico = horas × valor da hora. Entra no custo para entrar.',
    sufixo: 'h',
  },
  horasMedicoComHss: {
    grupo: 'medico',
    rotulo: 'Horas do médico com papelada, com HSS',
    info: 'Tempo estimado com o cadastro digital e reaproveitável da HSS. É uma hipótese: ajuste se já houver piloto.',
    entraEm: 'Tempo poupado = (horas sem HSS − horas com HSS) × valor da hora.',
    sufixo: 'h',
  },
  valorHoraMedico: {
    grupo: 'medico',
    rotulo: 'Quanto vale uma hora do médico',
    info: 'Quanto vale uma hora do trabalho do médico. Um jeito simples: quanto ele recebe por consulta vezes quantas consultas faz por hora.',
    entraEm: 'Converte as horas de papelada em dinheiro.',
    prefixo: 'R$',
  },
  custoRetrabalhoMedico: {
    grupo: 'medico',
    rotulo: 'Custo de cada retrabalho para o médico',
    info: 'Quanto custa ao médico cada vez que um documento volta: tempo para corrigir, novas cópias, autenticações ou taxas.',
    entraEm: 'Retrabalho do médico = chance de pendência × este custo.',
    prefixo: 'R$',
  },
  mensalidadeHssMedico: {
    grupo: 'medico',
    rotulo: 'Mensalidade da HSS paga pelo médico',
    info: 'Quanto o médico pagaria por mês para usar a HSS. Em geral a plataforma é contratada pela instituição; nesse caso, deixe 0.',
    entraEm: 'Descontada do ganho do médico: mensalidade × meses. Com valor acima de 0, o resultado mostra o ROI do médico.',
    prefixo: 'R$',
  },
  mensalidadeCurso: {
    grupo: 'medico',
    rotulo: 'Mensalidade do curso de medicina',
    info: 'Valor médio da mensalidade da graduação. Em 2026, a média nacional nas particulares fica perto de R$ 9.500 e a mediana perto de R$ 10.866 (de R$ 5 mil a mais de R$ 17 mil). Deixe 0 para não incluir a formação.',
    entraEm: 'Investimento na formação = mensalidade × meses de curso. Mostra em quanto tempo a renda paga o curso.',
    prefixo: 'R$',
  },
  mesesCurso: {
    grupo: 'medico',
    rotulo: 'Meses de curso pagos',
    info: 'Quantas mensalidades foram pagas. A graduação de medicina dura 6 anos: 72 meses.',
    entraEm: 'Investimento na formação = mensalidade × meses de curso.',
    sufixo: 'meses',
  },
  medicosPorMes: {
    grupo: 'instituicao',
    rotulo: 'Médicos credenciados por mês',
    info: 'Quantos médicos novos a instituição credencia em um mês típico. Use a média dos últimos 6 a 12 meses.',
    entraEm: 'Benefício mensal = benefício por médico × médicos por mês.',
  },
  custoConsultaInstituicao: {
    grupo: 'instituicao',
    rotulo: 'Custo variável da instituição por consulta',
    info: 'Custos que só existem quando a consulta acontece: materiais, insumos e taxas de cartão. Não inclua aluguel nem salários fixos.',
    entraEm: 'Margem da instituição por consulta = valor × parte da instituição − este custo.',
    prefixo: 'R$',
  },
  horasEquipeSemHss: {
    grupo: 'instituicao',
    rotulo: 'Horas da equipe por médico, sem HSS',
    info: 'Horas da equipe administrativa em cada credenciamento manual: cadastro, conferência, cobrança de pendências e atualização de status. Entre 8 e 12 horas é comum.',
    entraEm: 'Custo da equipe = horas × custo da hora. Entra no custo de cada credenciamento.',
    sufixo: 'h',
  },
  horasEquipeComHss: {
    grupo: 'instituicao',
    rotulo: 'Horas da equipe por médico, com HSS',
    info: 'Horas residuais com triagem estruturada e status centralizado na HSS. Não presuma que todo o trabalho desaparece.',
    entraEm: 'Economia da equipe = (horas sem HSS − horas com HSS) × custo da hora.',
    sufixo: 'h',
  },
  custoHoraEquipe: {
    grupo: 'instituicao',
    rotulo: 'Custo de uma hora da equipe',
    info: 'Custo de uma hora da equipe, com salário, encargos e benefícios. Estimativa: analista com salário de R$ 4.500 e cerca de 70% de encargos e benefícios custa perto de R$ 7.650 por mês, ou R$ 45 a hora. Use o número do seu RH.',
    entraEm: 'Converte as horas da equipe em dinheiro.',
    prefixo: 'R$',
  },
  custoRetrabalhoInstituicao: {
    grupo: 'instituicao',
    rotulo: 'Custo de cada retrabalho para a instituição',
    info: 'Custo de cada devolução de dossiê: horas da equipe para pedir, receber e conferir de novo.',
    entraEm: 'Retrabalho da instituição = chance de pendência × este custo.',
    prefixo: 'R$',
  },
  valorCredenciamentoHss: {
    grupo: 'instituicao',
    rotulo: 'Valor da HSS por credenciamento',
    info: 'Valor fixo que a HSS cobra por médico credenciado, sem mensalidade nem implantação. A HSS não publica preço: o número preenchido é uma hipótese; use o da proposta comercial.',
    entraEm: 'Custo HSS no período = valor × médicos por mês × meses. A HSS se paga quando o benefício por médico supera este valor.',
    prefixo: 'R$',
  },
};
/* === CATALOGO DE CAMPOS | fim === */

/* === GRUPOS DE CAMPOS | inicio === */
export const GRUPOS_PREMISSAS: { id: GrupoPremissa; titulo: string; descricao: string; perspectiva: PerspectivaRoi | null }[] = [
  {
    id: 'agenda',
    titulo: 'Agenda, receita e retrabalho',
    descricao: 'Fatos do atendimento, iguais para o médico e para a instituição. Mudar aqui muda os dois resultados.',
    perspectiva: null,
  },
  {
    id: 'medico',
    titulo: 'Lado do médico',
    descricao: 'Usados só quando o visitante escolhe “Sou médico”.',
    perspectiva: 'medico',
  },
  {
    id: 'instituicao',
    titulo: 'Lado do hospital ou clínica',
    descricao: 'Usados só quando o visitante escolhe “Sou hospital ou clínica”. O valor da HSS por credenciamento deve vir da proposta comercial.',
    perspectiva: 'instituicao',
  },
];

export function listarCamposDoGrupo(grupo: GrupoPremissa): CampoPremissa[] {
  return (Object.keys(CAMPOS_PREMISSAS) as CampoPremissa[]).filter((campo) => CAMPOS_PREMISSAS[campo].grupo === grupo);
}
/* === GRUPOS DE CAMPOS | fim === */
