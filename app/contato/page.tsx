import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contato | Tupiniquim Conexões",
  description:
    "Conte seus objetivos à Tupiniquim Conexões e receba um retorno em breve sobre marketing, conteúdo e tecnologia.",
};

const contactGuidance = [
  "Conte o objetivo da empresa ou do projeto",
  "Apresente o principal desafio ou oportunidade",
  "Informe dados corretos para receber o retorno",
];

export default function ContatoPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <header className="contact-hero-content">
          <p className="contact-eyebrow">Contato</p>
          <h1>Vamos conversar sobre os próximos passos da sua empresa?</h1>
          <p className="contact-hero-description">
            Compartilhe seus objetivos com a Tupiniquim Conexões. A equipe analisará
            a solicitação e retornará em breve pelos dados informados.
          </p>
        </header>
      </section>

      <section className="contact-form-section">
        <div className="contact-section-heading">
          <p className="contact-section-kicker">Fale com a Tupiniquim Conexões</p>
          <h2>Conte o que sua empresa precisa</h2>
          <p>
            Preencha o formulário com informações objetivas. Os dados serão usados
            para compreender a solicitação e realizar o retorno comercial.
          </p>
        </div>
        <ContactForm turnstileSiteKey="0x4AAAAAAFMkicitf0CHyjAE" />
      </section>

      <section className="contact-preparation">
        <div className="contact-section-heading contact-section-heading-light">
          <p className="contact-section-kicker">Para agilizar o atendimento</p>
          <h2>O que incluir na mensagem</h2>
          <p>
            Uma descrição clara ajuda a identificar possibilidades coerentes com o
            momento do negócio.
          </p>
        </div>
        <ul className="contact-preparation-list">
          {contactGuidance.map((item, index) => (
            <li key={item}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact-cta">
        <div>
          <p className="contact-section-kicker">Próximo passo</p>
          <h2>A resposta será enviada em breve</h2>
          <p>
            O primeiro contato não cria obrigação comercial. A equipe avaliará as
            informações e indicará um próximo passo possível.
          </p>
        </div>
      </section>

      <style>{`
        .contact-page { width: 100%; color: #111; font-family: Arial, Helvetica, sans-serif; }
        .contact-hero { overflow: hidden; padding: clamp(56px, 9vw, 112px) clamp(24px, 6vw, 72px); background: radial-gradient(circle at 84% 18%, rgba(255, 179, 0, 0.22), transparent 30%), linear-gradient(120deg, #111 0%, #1b5e20 100%); color: #fff; }
        .contact-hero-content { max-width: 960px; }
        .contact-eyebrow, .contact-section-kicker { margin: 0 0 12px; color: #ffb300; font-size: .78rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .contact-hero h1 { max-width: 900px; margin: 0; font-size: clamp(2.5rem, 6vw, 5.2rem); line-height: .98; letter-spacing: -.045em; }
        .contact-hero-description { max-width: 720px; margin: 28px 0 0; color: #e7e7e7; font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.7; }
        .contact-form-section, .contact-preparation, .contact-cta { padding: clamp(48px, 7vw, 88px) clamp(20px, 5vw, 64px); }
        .contact-form-section { background: #f5f5f5; }
        .contact-section-heading { max-width: 780px; margin-bottom: 36px; }
        .contact-section-heading h2, .contact-cta h2 { margin: 0; font-size: clamp(1.9rem, 4vw, 3.4rem); line-height: 1.05; letter-spacing: -.035em; }
        .contact-section-heading > p:last-child, .contact-cta p { margin: 18px 0 0; line-height: 1.7; }
        .contact-section-heading > p:last-child { color: #444; }
        .contact-preparation { background: #111; color: #fff; }
        .contact-section-heading-light > p:last-child { color: #e7e7e7; }
        .contact-preparation-list { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 0; padding: 0; list-style: none; }
        .contact-preparation-list li { display: flex; min-height: 132px; flex-direction: column; justify-content: space-between; gap: 24px; padding: 24px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.04); }
        .contact-preparation-list span { color: #ffb300; font-size: .8rem; font-weight: 800; }
        .contact-preparation-list strong { font-size: 1.15rem; line-height: 1.35; }
        .contact-cta { background: #1b5e20; color: #fff; }
        .contact-cta > div { max-width: 760px; }
        .contact-cta p:not(.contact-section-kicker) { color: #e7e7e7; }
        @media (max-width: 820px) { .contact-preparation-list { grid-template-columns: 1fr; } .contact-preparation-list li { min-height: auto; } }
        @media (max-width: 640px) { .contact-hero, .contact-form-section, .contact-preparation, .contact-cta { padding-right: 20px; padding-left: 20px; } }
      `}</style>
    </div>
  );
}
