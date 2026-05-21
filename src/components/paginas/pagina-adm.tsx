import { PainelAdmCredenciamento } from "@/components/admin/painel-adm-credenciamento";

/* === PAGINA ADM | inicio === */
export function PaginaAdm(): JSX.Element {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#eef0f7] px-4 py-8 sm:px-6 lg:px-8">
      <PainelAdmCredenciamento />
    </div>
  );
}
/* === PAGINA ADM | fim === */
