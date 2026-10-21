/* === COMPONENTE INTERRUPTOR | inicio === */
interface InterruptorProps {
  ligado: boolean;
  aoAlternar: (ligado: boolean) => void;
  rotulo: string;
  corLigado?: string;
  tamanho?: 'normal' | 'grande';
}

export function Interruptor({
  ligado,
  aoAlternar,
  rotulo,
  corLigado = 'bg-[#079879]',
  tamanho = 'normal',
}: InterruptorProps): JSX.Element {
  const grande = tamanho === 'grande';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={() => aoAlternar(!ligado)}
      className={[
        'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200',
        grande ? 'h-8 w-14' : 'h-6 w-11',
        ligado ? corLigado : 'bg-hss-violeta/20',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'inline-block rounded-full bg-white shadow-[0_1px_3px_rgba(41,27,127,0.3)] transition-transform duration-200',
          grande ? 'h-6 w-6' : 'h-4 w-4',
          ligado ? (grande ? 'translate-x-7' : 'translate-x-6') : 'translate-x-1',
        ].join(' ')}
      />
    </button>
  );
}
/* === COMPONENTE INTERRUPTOR | fim === */
