import { useState } from "react";
import type { LeadCaptado, VisaoCalculadora } from "@/types/calculadora";

/* === COMPONENTE FORMULARIO LEAD | inicio === */
interface FormularioLeadProps {
  visaoPadrao: VisaoCalculadora;
}

const leadInicial: LeadCaptado = {
  nome: "",
  email: "",
  telefone: "",
  instituicao: "",
  cargo: "",
  porte: "Médio porte",
  mensagem: "",
  visao: "empresa",
};

export function FormularioLead({ visaoPadrao }: FormularioLeadProps): JSX.Element {
  const [lead, definirLead] = useState<LeadCaptado>({
    ...leadInicial,
    visao: visaoPadrao,
  });
  const [status, definirStatus] = useState<"ocioso" | "enviando" | "sucesso" | "erro">("ocioso");

  function atualizarLead(campo: keyof LeadCaptado, valor: string): void {
    definirLead({
      ...lead,
      [campo]: valor,
    });
  }

  async function enviarLead(evento: React.FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    definirStatus("enviando");

    try {
      const resposta = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      if (!resposta.ok) throw new Error("Falha ao salvar lead");
      definirStatus("sucesso");
      definirLead({ ...leadInicial, visao: visaoPadrao });
    } catch {
      const leadsLocais = JSON.parse(window.localStorage.getItem("hss_leads_fallback") ?? "[]") as LeadCaptado[];
      window.localStorage.setItem("hss_leads_fallback", JSON.stringify([...leadsLocais, lead]));
      definirStatus("sucesso");
    }
  }

  return (
    <section id="lead" className="max-w-full scroll-mt-28 overflow-hidden bg-[#eef0f7] px-3 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1110px] min-w-0 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="revelar-scroll min-w-0 rounded-[1.5rem] bg-hss-roxo p-5 text-white sm:p-12">
          <h2 className="max-w-full break-words text-[2rem] font-black leading-[1.18] tracking-normal sm:max-w-[340px] sm:text-[3.1rem] sm:tracking-[0.02em]">
            Transforme a simulação em conversa comercial.
          </h2>
          <p className="mt-6 max-w-full break-words text-base font-medium leading-8 text-white/78 sm:max-w-[430px]">
            O formulário captura as informações principais da instituição para uma abordagem B2B consultiva sobre credenciamento médico, redução de tempo e ROI.
          </p>
        </div>

        <form onSubmit={enviarLead} className="revelar-scroll min-w-0 rounded-[1.5rem] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-9">
          <div className="grid min-w-0 gap-x-4 gap-y-5 md:grid-cols-2">
            <CampoTexto label="Nome" valor={lead.nome} obrigatorio aoMudar={(valor) => atualizarLead("nome", valor)} />
            <CampoTexto label="E-mail" tipo="email" valor={lead.email} obrigatorio aoMudar={(valor) => atualizarLead("email", valor)} />
            <CampoTexto label="Telefone" valor={lead.telefone} aoMudar={(valor) => atualizarLead("telefone", valor)} />
            <CampoTexto label="Instituição" valor={lead.instituicao} obrigatorio aoMudar={(valor) => atualizarLead("instituicao", valor)} />
            <CampoTexto label="Cargo" valor={lead.cargo} aoMudar={(valor) => atualizarLead("cargo", valor)} />
            <label className="block min-w-0">
              <span className="text-sm font-black text-[#070814]">Porte</span>
              <select
                value={lead.porte}
                onChange={(evento) => atualizarLead("porte", evento.target.value)}
                className="mt-2 h-10 w-full min-w-0 rounded-[0.75rem] border border-[#d8dbea] bg-white px-3 text-sm font-semibold text-[#070814] outline-none"
              >
                <option>Pequeno porte</option>
                <option>Médio porte</option>
                <option>Grande porte</option>
                <option>Rede hospitalar</option>
              </select>
            </label>
          </div>

          <label className="mt-5 block min-w-0">
            <span className="text-sm font-black text-[#070814]">Mensagem</span>
            <textarea
              value={lead.mensagem}
              onChange={(evento) => atualizarLead("mensagem", evento.target.value)}
              rows={6}
              className="mt-2 w-full min-w-0 rounded-[0.75rem] border border-[#d8dbea] bg-white px-3 py-3 text-sm font-semibold text-[#070814] outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={status === "enviando"}
            className="mt-6 w-full min-w-0 rounded-[1rem] bg-hss-roxo px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(41,27,127,0.18)] disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
          >
            {status === "enviando" ? "Enviando..." : "Solicitar demonstração"}
          </button>

          {status === "sucesso" ? (
            <p className="mt-4 text-sm font-bold text-emerald-600">Lead salvo com sucesso.</p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
/* === COMPONENTE FORMULARIO LEAD | fim === */

/* === CAMPO TEXTO | inicio === */
interface CampoTextoProps {
  label: string;
  valor: string;
  tipo?: string;
  obrigatorio?: boolean;
  aoMudar: (valor: string) => void;
}

function CampoTexto({ label, valor, tipo = "text", obrigatorio = false, aoMudar }: CampoTextoProps): JSX.Element {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-black text-[#070814]">
        {label}
        {obrigatorio ? " *" : ""}
      </span>
      <input
        type={tipo}
        required={obrigatorio}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="mt-2 h-10 w-full min-w-0 rounded-[0.75rem] border border-[#d8dbea] bg-white px-3 text-sm font-semibold text-[#070814] outline-none"
      />
    </label>
  );
}
/* === CAMPO TEXTO | fim === */
