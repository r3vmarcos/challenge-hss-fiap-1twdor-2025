import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type VarianteShimmer = 'primario' | 'contorno';
type ElementoShimmer = 'a' | 'button';

type PropriedadesBase = {
  children: ReactNode;
  variante?: VarianteShimmer;
  className?: string;
  as?: ElementoShimmer;
};

type PropriedadesLink = PropriedadesBase & AnchorHTMLAttributes<HTMLAnchorElement> & { as?: 'a' };
type PropriedadesBotao = PropriedadesBase & ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' };

type PropriedadesShimmerButton = PropriedadesLink | PropriedadesBotao;

/* === TAMANHO NO CELULAR | inicio === */
// Botoes de chamada da landing no celular e no tablet (abaixo de lg): mesma largura, altura e texto em todas as secoes,
// centralizados e sem quebrar o texto (largura fixa de 15rem, que cabe "Agendar demonstração"). Vira bloco (flex) para o mx-auto centralizar.
export const CLASSE_BOTAO_CELULAR =
  'whitespace-nowrap max-lg:mx-auto max-lg:flex max-lg:h-auto max-lg:w-[15rem] max-lg:max-w-full max-lg:self-center max-lg:px-5 max-lg:py-2.5 max-lg:text-sm max-lg:leading-tight';
/* === TAMANHO NO CELULAR | fim === */

/* === COMPONENTE SHIMMER BUTTON | inicio === */
export function ShimmerButton({
  children,
  variante = 'primario',
  className = '',
  as = 'a',
  ...propriedades
}: PropriedadesShimmerButton): JSX.Element {
  const classeBase = [
    'shimmer-button inline-flex',
    variante === 'contorno' ? 'shimmer-button-contorno' : 'shimmer-button-primario',
    className,
  ].join(' ');

  if (as === 'button') {
    const propriedadesBotao = propriedades as ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button type={propriedadesBotao.type ?? 'button'} className={classeBase} {...propriedadesBotao}>
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  const propriedadesLink = propriedades as AnchorHTMLAttributes<HTMLAnchorElement>;

  return (
    <a className={classeBase} {...propriedadesLink}>
      <span className="relative z-10">{children}</span>
    </a>
  );
}
/* === COMPONENTE SHIMMER BUTTON | fim === */
