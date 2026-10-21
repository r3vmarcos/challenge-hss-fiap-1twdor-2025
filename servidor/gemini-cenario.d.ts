/* === TIPOS DO MODULO DE IA | inicio === */
export interface TentativaGemini {
  chave: string;
  modelo: string;
}

export declare const MODELO_PADRAO: string;

export declare function montarTentativasGemini(fonte?: Record<string, string | undefined>): TentativaGemini[];

export declare function tratarRequisicaoIaCenario(requisicao: Request, opcoes?: { tentativas?: TentativaGemini[] }): Promise<Response>;
/* === TIPOS DO MODULO DE IA | fim === */
