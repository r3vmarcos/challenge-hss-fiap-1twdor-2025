import { fontesConsultadas } from "@/data/conteudoHss";

/* === RODAPE | inicio === */
export function Rodape(): JSX.Element {
  return (
    <footer className="border-t border-[#d7d9e6] bg-[#eef0f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1110px] flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p className="font-semibold">Health Sync Solutions - FIAP MedTech Challenge - Landing light + ROI por tempo.</p>
        <details className="max-w-xl">
          <summary className="cursor-pointer font-black text-hss-roxo">Fontes e referências</summary>
          <ul className="mt-3 list-inside list-disc space-y-1">
            {fontesConsultadas.map((fonte) => (
              <li key={fonte}>{fonte}</li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  );
}
/* === RODAPE | fim === */
