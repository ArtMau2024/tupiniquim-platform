"use client";

import Script from "next/script";
import { FormEvent, useRef, useState } from "react";

declare global {
  interface Window { turnstile?: { reset: (widget?: string | HTMLElement) => void } }
}

type Status = { kind: "idle" | "sending" | "success" | "error"; message: string };

export default function ContactForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus({ kind: "sending", message: "Enviando sua mensagem..." });
    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar a mensagem.");
      form.reset();
      window.turnstile?.reset();
      setStatus({ kind: "success", message: result.message || "Mensagem recebida. Retornaremos em breve." });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Não foi possível enviar. Tente novamente." });
    }
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
      <form ref={formRef} className="commercial-contact-form" onSubmit={submit} noValidate>
        <div className="form-grid">
          <label>Nome<input name="name" required maxLength={100} autoComplete="name" /></label>
          <label>Empresa ou projeto<input name="company" required maxLength={120} autoComplete="organization" /></label>
          <label>E-mail<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          <label>Telefone<input name="phone" type="tel" required minLength={8} maxLength={30} autoComplete="tel" /></label>
          <label>Serviço de interesse<select name="interest" required defaultValue=""><option value="" disabled>Selecione</option><option>Estratégia e presença digital</option><option>Conteúdo e comunicação</option><option>Site ou página de campanha</option><option>Automação de marketing</option><option>Análise e evolução digital</option><option>Outro</option></select></label>
          <label>Assunto<input name="subject" required maxLength={120} /></label>
        </div>
        <label>Mensagem<textarea name="message" required minLength={20} maxLength={3000} rows={7} /></label>
        <div className="website-field" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="checkbox-row"><input name="privacyAccepted" type="checkbox" value="yes" required /><span>Li e aceito o uso dos dados para atendimento desta solicitação.</span></label>
        <label className="checkbox-row"><input name="marketingConsent" type="checkbox" value="yes" /><span>Aceito receber novidades, conteúdos e comunicações futuras da Tupiniquim Conexões.</span></label>
        <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" />
        <button type="submit" disabled={status.kind === "sending"}>{status.kind === "sending" ? "Enviando..." : "Enviar mensagem"}</button>
        {status.message && <p className={`form-status form-status-${status.kind}`} role="status">{status.message}</p>}
      </form>
      <style jsx>{`
        .commercial-contact-form { max-width: 960px; padding: clamp(24px,4vw,44px); border-top: 5px solid #2e7d32; background: #fff; box-shadow: 0 16px 50px rgba(0,0,0,.08); }
        .form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 20px; }
        label { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; font-weight: 700; }
        input, select, textarea { width: 100%; box-sizing: border-box; border: 1px solid #aaa; border-radius: 6px; padding: 12px 14px; background: #fff; color: #111; font: inherit; }
        input:focus, select:focus, textarea:focus { outline: 3px solid rgba(255,179,0,.45); border-color: #1b5e20; }
        textarea { resize: vertical; }
        .checkbox-row { flex-direction: row; align-items: flex-start; gap: 10px; font-weight: 400; line-height: 1.5; }
        .checkbox-row input { width: auto; margin-top: 4px; }
        .website-field { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
        button { min-height: 48px; padding: 12px 22px; border: 0; border-radius: 6px; background: #1b5e20; color: #fff; font-weight: 800; cursor: pointer; }
        button:hover { background: #2e7d32; } button:disabled { opacity: .65; cursor: wait; }
        .form-status { margin: 18px 0 0; padding: 14px; border-radius: 6px; line-height: 1.5; }
        .form-status-success { background: #e8f5e9; color: #1b5e20; } .form-status-error { background: #ffebee; color: #8e0000; }
        @media (max-width: 700px) { .form-grid { grid-template-columns: 1fr; gap: 0; } button { width: 100%; } }
      `}</style>
    </>
  );
}
