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
  // Porte permanece vazio no formulário; o campo continua no formato do lead do D1 e do ADM.
  porte: "",
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
    <section id="lead" className="max-w-full scroll-mt-28 overflow-hidden px-3 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1200px] min-w-0 gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="revelar-scroll min-w-0 rounded-[1.5rem] bg-hss-roxo p-5 text-white sm:flex sm:flex-col sm:justify-center sm:p-8">
          {/* Duas linhas fixas; a segunda nunca quebra. O tamanho acompanha a largura do cartao:
              ate lg o cartao ocupa a tela; a partir de lg ele tem ~45% da largura. 2a linha em caixa alta: ~3,7vw (lg: ~1,6vw). */}
          <h2 className="lg:text-[2.75rem] md:text-[2rem] sm:text-[1.75rem] max-sm:text-[1.5rem] font-black leading-[1.15] tracking-normal">
            {/* 1a linha em destaque: maior e em caixa alta. Frase curta, cabe em uma linha com ~7,6vw (lg: ~3,1vw). */}
            Agendar demonstração
          </h2>
          {/* Tudo alinhado a esquerda. Convite (branco, 600) separado da explicacao (branco 75%, normal). */}
          <p className="mt-5 max-w-[42ch] text-[0.9375rem] font-semibold leading-relaxed text-white sm:text-base">
            <span className="block">Preencha o formulário para que nossa equipe entre em contato e agende uma apresentação da plataforma, personalizada para a realidade da sua instituição.</span>
            {/* <span className="block">Ou sua rotina como médico.</span> */}
          </p>
          <p className="mt-3 max-w-[42ch] text-[0.9375rem] font-normal leading-relaxed text-white/75 sm:text-base">
            Você também pode nos contatar diretamente:
            <p>contato@syncidsolutions.com </p>
          </p>
        </div>

        <form onSubmit={enviarLead} className="revelar-scroll min-w-0 rounded-[1.5rem] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="grid min-w-0 gap-y-4">
            <CampoTexto label="Nome" placeholder="Seu nome completo" valor={lead.nome} obrigatorio aoMudar={(valor) => atualizarLead("nome", valor)} />
            <div className="flex justify-between gap-3">
              <CampoTexto label="Empresa" placeholder="Nome da instituição" valor={lead.instituicao} aoMudar={(valor) => atualizarLead("instituicao", valor)} />
              <CampoTexto label="Cargo" placeholder="Seu cargo" valor={lead.cargo} aoMudar={(valor) => atualizarLead("cargo", valor)} />
            </div>
            <div className="flex justify-between gap-3">
              <CampoTexto label="E-mail" placeholder="seu@email.com" tipo="email" valor={lead.email} obrigatorio aoMudar={(valor) => atualizarLead("email", valor)} />
              <CampoTexto label="Telefone" placeholder="(00) 00000-0000" tipo="tel" valor={lead.telefone} aoMudar={(valor) => atualizarLead("telefone", valor)} />
            </div>
          </div>

          <label className="mt-4 block min-w-0">
            <span className="mb-1.5 block text-sm font-medium text-[#101827]">Mensagem</span>
            <textarea
              value={lead.mensagem}
              onChange={(evento) => atualizarLead("mensagem", evento.target.value)}
              rows={4}
              placeholder="Conte-nos sobre sua necessidade..."
              className="block w-full min-w-0 rounded-[0.75rem] border border-[#d8dbea] bg-white px-3 py-2 text-sm font-semibold text-[#070814] outline-none placeholder:font-medium placeholder:text-slate-500 focus:border-hss-violeta focus:ring-4 focus:ring-hss-lavanda/30"
            />
          </label>

          <button
            type="submit"
            disabled={status === "enviando"}
            className="mt-5 w-full min-w-0 rounded-[1rem] bg-hss-roxo px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_28px_rgba(41,27,127,0.18)] disabled:cursor-not-allowed disabled:opacity-60 sm:px-7"
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
  placeholder: string;
  tipo?: string;
  obrigatorio?: boolean;
  aoMudar: (valor: string) => void;
}

function CampoTexto({ label, valor, placeholder, tipo = "text", obrigatorio = false, aoMudar }: CampoTextoProps): JSX.Element {
  return (
    <label className="block min-w-0 w-full">
      <span className="mb-1.5 block text-sm font-medium text-[#101827]">
        {label}
        {obrigatorio ? " *" : ""}
      </span>
      <input
        type={tipo}
        required={obrigatorio}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder={placeholder}
        className="block h-11 w-full min-w-0 rounded-[0.75rem] border border-[#d8dbea] bg-white px-3 text-sm font-semibold text-[#070814] outline-none placeholder:font-medium placeholder:text-slate-500 focus:border-hss-violeta focus:ring-4 focus:ring-hss-lavanda/30"
      />
    </label>
  );
}
/* === CAMPO TEXTO | fim === */
