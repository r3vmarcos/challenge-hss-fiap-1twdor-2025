/* === TIPOS DA CALCULADORA | inicio === */
export type VisaoCalculadora = 'empresa' | 'medico';
export type EtapaCalculadora = 1 | 2 | 3 | 4 | 5;
export type PublicoAlvoConfiguracao = 'empresa' | 'medico' | 'ambos';
export type CenarioRoi =
  | 'hospital_contratando_hss'
  | 'clinica_contratando_hss'
  | 'hospital_credenciando_medico'
  | 'clinica_credenciando_medico'
  | 'medico_hospital'
  | 'medico_clinica'
  | 'medico_consultorio'
  | 'recredenciamento'
  | 'alta_complexidade';

export interface ConfiguracaoCredenciamento {
  id: string;
  ativo: boolean;
  nome: string;
  categoria: string;
  publicoAlvo: PublicoAlvoConfiguracao;
  cenarioRoi: CenarioRoi;
  descricao: string;
  premissaSite: string;
  tempoSemHssDias: number;
  tempoComHssDias: number;
  receitaMensalPorMedico: number;
  margemLiquidaPercentual: number;
  horasAdministrativasPorCredenciamento: number;
  custoHoraAdministrativa: number;
  taxaRetrabalhoPercentual: number;
  custoRetrabalhoPorMedico: number;
  taxaDocumentosVencidosPercentual: number;
  custoDocumentoVencido: number;
  custoMensalHss: number;
  custoImplantacaoHss: number;
  reducaoAdministrativaPercentual: number;
  reducaoRetrabalhoPercentual: number;
  taxaNoShowAtual: number;
  taxaNoShowComHss: number;
  percentualRepasseClinica: number;
  custoOperacionalMensalMedico: number;
  investimentoInicialMedico: number;
}

export interface DadosEmpresaRoi {
  nomeInstituicao: string;
  porteInstituicao: string;
  profissionaisSaude: number;
  atendimentosMes: number;
  ticketMedioAtendimento: number;
  margemMediaAtendimento: number;
  medicosCredenciadosMes: number;
  valorMensalPorMedicoLiberado: number;
  tempoCredenciamentoAtualDias: number;
  tempoCredenciamentoComHssDias: number;
  horasAdministrativasSemana: number;
  custoHoraAdministrativo: number;
  reducaoAdministrativaPercentual: number;
  taxaNoShowAtual: number;
  taxaNoShowComHss: number;
  reducaoGlosasPercentual: number;
  custoGlosasMensal: number;
  custoMensalHss: number;
  custoImplantacaoHss: number;
  mesesAnalise: number;
  tipoCredenciamentoId?: string;
  tipoCredenciamentoNome?: string;
  cenarioRoi?: CenarioRoi;
  horasAdministrativasPorCredenciamento?: number;
  taxaRetrabalhoDocumental?: number;
  custoRetrabalhoPorMedico?: number;
  taxaDocumentosVencidos?: number;
  custoDocumentoVencido?: number;
  margemLiquidaPercentual?: number;
}

export interface DadosMedicoRoi {
  nomeMedico: string;
  especialidade: string;
  receitaMensalEsperadaHospital: number;
  mesesAnalise: number;
  custoCrmAnual: number;
  custoCursos: number;
  custoDocumentos: number;
  custoCertificadoDigital: number;
  custoVacinasExames: number;
  custoSeguroAnual: number;
  custoPjPrimeiroAno: number;
  horasPerdidasProcesso: number;
  valorHoraMedica: number;
  tempoCredenciamentoTradicionalDias: number;
  tempoCredenciamentoDigitalDias: number;
  custoTaxasHospitalares: number;
  tipoCredenciamentoId?: string;
  tipoCredenciamentoNome?: string;
  cenarioRoi?: CenarioRoi;
  percentualRepasseClinica?: number;
  custoOperacionalMensal?: number;
  investimentoInicial?: number;
}

export interface ResultadoEmpresaRoi {
  economiaAdministrativaMensal: number;
  economiaNoShowMensal: number;
  economiaGlosasMensal: number;
  receitaAntecipadaMensal: number;
  prejuizoMensalSemHss: number;
  beneficiosMensais: number;
  custosMensaisEquivalentes: number;
  beneficioLiquidoMensal: number;
  roiPercentual: number;
  paybackMeses: number | null;
  economiaProjetadaPeriodo: number;
  custoProjetadoPeriodo: number;
  ganhoLiquidoPeriodo: number;
  tempoEconomizadoPorMedicoDias: number;
  tempoEconomizadoTotalDias: number;
  valorDiarioPorMedico: number;
  prejuizoEvitadoPorAtraso: number;
  custoAtualProcessoManual: number;
  custoComDocumentosVencidos: number;
  economiaRetrabalhoDocumental: number;
}

export interface ResultadoMedicoRoi {
  custoInicialTotal: number;
  economiaTempoCredenciamento: number;
  receitaAntecipada: number;
  receitaLiquidaMensal: number;
  beneficioTotalPeriodo: number;
  roiPercentual: number;
  paybackMeses: number | null;
  custoTempoPerdido: number;
  repasseMensal: number;
}

export interface LeadCaptado {
  nome: string;
  email: string;
  telefone: string;
  instituicao: string;
  cargo: string;
  porte: string;
  mensagem: string;
  visao: VisaoCalculadora;
}
/* === TIPOS DA CALCULADORA | fim === */
