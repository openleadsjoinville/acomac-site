"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { CheckCircle2 } from "lucide-react";

export default function AssociateRegisterForm() {
  const [form, setForm] = useState({
    companyName: "",
    cnpj: "",
    contactName: "",
    phone: "",
    email: "",
    city: "",
    website: "",
    instagram: "",
    segment: "",
    description: "",
    logoUrl: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErr("");
    const res = await fetch("/api/associates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error ?? "Erro ao enviar");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div id="cadastro" className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Cadastro enviado!
        </h3>
        <p className="text-sm text-slate-600">
          Em breve a ACOMAC vai analisar suas informações e aprovar sua
          publicação no Conecta Associados. Você receberá um retorno no email
          informado.
        </p>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      id="cadastro"
      onSubmit={submit}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-slate-900">Cadastrar minha empresa</h3>
        <p className="text-sm text-slate-500 mt-1">
          Preencha os dados e aguarde aprovação da ACOMAC para aparecer no
          diretório público.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nome da empresa *" value={form.companyName} onChange={set("companyName")} required />
        <Field label="CNPJ" value={form.cnpj} onChange={set("cnpj")} />
        <Field label="Contato *" value={form.contactName} onChange={set("contactName")} required />
        <Field label="Telefone *" value={form.phone} onChange={set("phone")} required />
        <Field label="Email *" value={form.email} onChange={set("email")} type="email" required />
        <Field label="Cidade" value={form.city} onChange={set("city")} />
        <Field label="Website" value={form.website} onChange={set("website")} />
        <Field label="Instagram" value={form.instagram} onChange={set("instagram")} />
        <Field label="Segmento" value={form.segment} onChange={set("segment")} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Sobre a empresa
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059AB]/20 focus:border-[#0059AB]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Logo
        </label>
        <ImageUploader value={form.logoUrl} onChange={set("logoUrl")} label="" />
      </div>

      {err && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
        style={{ backgroundColor: "#F6811E" }}
      >
        {sending ? "Enviando..." : "Enviar cadastro para aprovação"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059AB]/20 focus:border-[#0059AB]"
      />
    </div>
  );
}
