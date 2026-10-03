import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type Env = { FORMSPREE_ENDPOINT: string; TURNSTILE_SECRET_KEY: string };
const limits = { name: 100, company: 120, email: 254, phone: 30, interest: 80, subject: 120, message: 3000 } as const;
const allowedInterests = new Set(["Estratégia e presença digital","Conteúdo e comunicação","Site ou página de campanha","Automação de marketing","Análise e evolução digital","Outro"]);
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const noHeaderBreaks = (value: string) => !/[\r\n]/.test(value);
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const expected = new URL(request.url).origin;
    if (origin && origin !== expected) return NextResponse.json({ message: "Solicitação inválida." }, { status: 403 });
    if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ message: "Formato inválido." }, { status: 415 });
    const raw = await request.text();
    if (raw.length > 12000) return NextResponse.json({ message: "Solicitação muito grande." }, { status: 413 });
    const body = JSON.parse(raw) as Record<string, unknown>;
    if (clean(body.website)) return NextResponse.json({ message: "Mensagem recebida. Retornaremos em breve." });

    const data = { name: clean(body.name), company: clean(body.company), email: clean(body.email), phone: clean(body.phone), interest: clean(body.interest), subject: clean(body.subject), message: clean(body.message) };
    if (!data.name || !data.company || !data.email || !data.phone || !data.interest || !data.subject || data.message.length < 20 || body.privacyAccepted !== "yes") return NextResponse.json({ message: "Revise os campos obrigatórios." }, { status: 400 });
    if (Object.entries(limits).some(([key, max]) => data[key as keyof typeof data].length > max) || !validEmail(data.email) || !allowedInterests.has(data.interest) || !noHeaderBreaks(data.name) || !noHeaderBreaks(data.email) || !noHeaderBreaks(data.subject)) return NextResponse.json({ message: "Existem dados inválidos no formulário." }, { status: 400 });

    const token = clean(body["cf-turnstile-response"]);
    if (!token) return NextResponse.json({ message: "Conclua a verificação de segurança." }, { status: 400 });
    const { env } = await getCloudflareContext({ async: true });
    const bindings = env as unknown as Env;
    if (!bindings.FORMSPREE_ENDPOINT || !bindings.TURNSTILE_SECRET_KEY) throw new Error("Configuração do serviço indisponível");

    const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ secret: bindings.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get("CF-Connecting-IP") || "" }) });
    const turnstile = await verification.json() as { success?: boolean };
    if (!turnstile.success) return NextResponse.json({ message: "A verificação de segurança expirou. Tente novamente." }, { status: 400 });

    const id = crypto.randomUUID();
    const text = [`Novo contato comercial | Tupiniquim Conexões`,`Identificador: ${id}`,`Nome: ${data.name}`,`Empresa/projeto: ${data.company}`,`E-mail: ${data.email}`,`Telefone: ${data.phone}`,`Interesse: ${data.interest}`,`Assunto: ${data.subject}`,`Consentimento futuro: ${body.marketingConsent === "yes" ? "Sim" : "Não"}`,"",data.message].join("\n");
    const formspree = await fetch(bindings.FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        interest: data.interest,
        subject: data.subject,
        message: data.message,
        marketingConsent: body.marketingConsent === "yes" ? "Sim" : "Não",
        requestId: id,
        _replyto: data.email,
      }),
    });
    if (!formspree.ok) {
      const formspreeBody = await formspree.text();
      console.error("contact-form-formspree-error", JSON.stringify({ status: formspree.status, body: formspreeBody.slice(0, 1200) }));
      throw new Error(`Falha no serviço de formulário (HTTP ${formspree.status})`);
    }
    return NextResponse.json({ message: "Mensagem recebida com sucesso. A equipe da Tupiniquim Conexões retornará em breve pelos dados informados.", id });
  } catch (error) {
    console.error("contact-form-error", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ message: "Não foi possível enviar agora. Tente novamente em alguns minutos." }, { status: 500 });
  }
}
