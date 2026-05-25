"use client";

import {
  ShieldCheck,
  Mail,
  Phone,
  Megaphone,
  Cookie,
  Database,
  UserCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const ultimaAtualizacao = "25 de maio de 2026";

const destaques = [
  {
    icon: Megaphone,
    title: "Comunicação promocional",
    description:
      "Os e-mails e telefones que você nos fornecer poderão ser utilizados para envio de conteúdo promocional, informativo, ofertas, convites para eventos e novidades da ACOMAC e de seus parceiros.",
    color: "#F6811E",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade com a LGPD",
    description:
      "Tratamos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), respeitando seus direitos como titular.",
    color: "#0059AB",
  },
  {
    icon: UserCheck,
    title: "Consentimento explícito",
    description:
      "Ao preencher formulários, se cadastrar em eventos, cursos ou aceitar comunicações, você concorda expressamente com o tratamento descrito nesta política.",
    color: "#F6811E",
  },
];

const dadosColetados = [
  {
    titulo: "Dados de identificação",
    itens: ["Nome completo", "CPF/CNPJ", "Razão social"],
  },
  {
    titulo: "Dados de contato",
    itens: [
      "E-mail",
      "Telefone fixo e celular (WhatsApp)",
      "Endereço comercial",
    ],
  },
  {
    titulo: "Dados profissionais",
    itens: [
      "Empresa, cargo e segmento",
      "Histórico de participação em eventos e cursos",
    ],
  },
  {
    titulo: "Dados de navegação",
    itens: [
      "Endereço IP, tipo de dispositivo e navegador",
      "Páginas visitadas, tempo de permanência e origem do acesso",
      "Cookies e identificadores únicos",
    ],
  },
];

const finalidades = [
  {
    icon: Megaphone,
    title: "Envio de conteúdo promocional",
    description:
      "Utilizamos seu e-mail e telefone (incluindo WhatsApp e SMS) para enviar materiais promocionais, ofertas, novidades, divulgação de eventos como a FENAC, cursos da Academia da Construção, convênios e benefícios para associados.",
    accent: "#F6811E",
    destaque: true,
  },
  {
    icon: Mail,
    title: "Comunicação institucional",
    description:
      "Newsletter, comunicados oficiais, atualizações sobre a associação, pesquisas de satisfação e informações de interesse do setor varejista da construção civil.",
    accent: "#0059AB",
  },
  {
    icon: UserCheck,
    title: "Relacionamento e atendimento",
    description:
      "Responder dúvidas, processar inscrições em cursos e eventos, gerenciar associações e prestar suporte aos associados.",
    accent: "#F6811E",
  },
  {
    icon: Database,
    title: "Melhoria contínua",
    description:
      "Analisar a navegação no site, entender preferências e aperfeiçoar nossos serviços, conteúdos e comunicações.",
    accent: "#0059AB",
  },
  {
    icon: Scale,
    title: "Obrigações legais",
    description:
      "Cumprir obrigações legais, regulatórias e fiscais, bem como prevenir fraudes e proteger nossos direitos.",
    accent: "#F6811E",
  },
];

const tiposCookies = [
  {
    titulo: "Essenciais",
    descricao:
      "Necessários para o funcionamento básico do site, como autenticação no painel administrativo e segurança. Não podem ser desativados.",
  },
  {
    titulo: "Desempenho e análise",
    descricao:
      "Coletam informações anônimas sobre como os visitantes utilizam o site (páginas mais acessadas, tempo de permanência) para nos ajudar a melhorar a experiência.",
  },
  {
    titulo: "Funcionais",
    descricao:
      "Memorizam suas preferências, como idioma e região, para personalizar sua experiência de navegação.",
  },
  {
    titulo: "Marketing e publicidade",
    descricao:
      "Permitem exibir conteúdos e ofertas relevantes, mensurar campanhas e remarketing em outras plataformas, como redes sociais.",
  },
];

const direitos = [
  "Confirmar a existência de tratamento dos seus dados",
  "Acessar os dados que temos sobre você",
  "Corrigir dados incompletos, inexatos ou desatualizados",
  "Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários",
  "Portabilidade dos dados a outro fornecedor",
  "Eliminação dos dados tratados com base no consentimento",
  "Informação sobre com quem compartilhamos seus dados",
  "Revogar o consentimento a qualquer momento",
  "Solicitar o descadastramento de comunicações promocionais (opt-out)",
];

export default function PrivacidadePage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: dstRef, inView: dstInView } = useInView(0.12);
  const { ref: dadosRef, inView: dadosInView } = useInView(0.1);
  const { ref: finRef, inView: finInView } = useInView(0.1);
  const { ref: cookieRef, inView: cookieInView } = useInView(0.1);
  const { ref: dirRef, inView: dirInView } = useInView(0.1);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.2);

  return (
    <ClientSiteChrome>
      <main>
        {/* HERO */}
        <section
          className="relative pt-24 pb-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #002952 0%, #004a94 35%, #0059AB 60%, #0068c7 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(246,129,30,0.10) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            ref={heroRef}
            className="relative z-10 max-w-7xl mx-auto px-6"
            style={fadeIn(heroInView)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Termo de consentimento
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              Política de{" "}
              <span
                className="relative inline-block"
                style={{ color: "#F6811E" }}
              >
                Privacidade e Cookies
                <span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
                />
              </span>
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-3xl mb-6"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              A ACOMAC Joinville valoriza a sua privacidade. Esta política
              explica de forma transparente como coletamos, utilizamos,
              armazenamos e protegemos seus dados pessoais — incluindo o uso
              do seu e-mail e telefone para envio de conteúdo promocional.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <FileText size={13} />
              Última atualização: {ultimaAtualizacao}
            </div>
          </div>
        </section>

        {/* DESTAQUES — comunicação promocional */}
        <section className="relative -mt-12 z-10 px-6">
          <div
            ref={dstRef}
            className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4"
          >
            {destaques.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="p-7 rounded-2xl bg-white"
                  style={{
                    ...staggerStyle(dstInView, i, 0.05),
                    boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
                    border: "1px solid #eee",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${d.color}15` }}
                  >
                    <Icon size={22} style={{ color: d.color }} />
                  </div>
                  <h3
                    className="text-base font-extrabold mb-2"
                    style={{ color: "#111" }}
                  >
                    {d.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555" }}
                  >
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AVISO PRINCIPAL — uso de email/telefone */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div
              className="relative p-8 md:p-10 rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(246,129,30,0.08) 0%, rgba(246,129,30,0.02) 100%)",
                border: "1.5px solid rgba(246,129,30,0.3)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(246,129,30,0.15)" }}
                >
                  <AlertTriangle size={22} style={{ color: "#F6811E" }} />
                </div>
                <div>
                  <h2
                    className="text-xl md:text-2xl font-extrabold mb-3"
                    style={{ color: "#111" }}
                  >
                    Aviso importante sobre comunicações promocionais
                  </h2>
                  <p
                    className="text-sm md:text-base leading-relaxed mb-3"
                    style={{ color: "#444" }}
                  >
                    Ao fornecer seu <strong>e-mail</strong> e/ou{" "}
                    <strong>telefone</strong> em qualquer formulário deste
                    site — incluindo cadastros de associação, inscrições em
                    cursos e eventos, contato e materiais para download —
                    você manifesta consentimento livre, informado e
                    inequívoco para que a ACOMAC Joinville utilize esses
                    canais para envio de:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "Conteúdo promocional e ofertas comerciais",
                      "Divulgação de eventos, cursos e treinamentos",
                      "Newsletters, novidades do setor e comunicados",
                      "Convites para feiras como a FENAC e rodadas de negócios",
                      "Comunicações de parceiros e patrocinadores selecionados",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "#444" }}
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0"
                          style={{ color: "#F6811E" }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555" }}
                  >
                    As comunicações poderão ser enviadas por e-mail, SMS,
                    WhatsApp ou ligação telefônica. Você pode revogar este
                    consentimento a qualquer momento, conforme instruções
                    descritas mais abaixo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DADOS COLETADOS */}
        <section
          className="py-24"
          style={{ backgroundColor: "#fafafa" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={dadosRef}
              className="mb-12"
              style={fadeIn(dadosInView)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Seção 1
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4"
                style={{ color: "#111" }}
              >
                Dados que coletamos
              </h2>
              <p
                className="text-base leading-relaxed max-w-3xl"
                style={{ color: "#555" }}
              >
                Coletamos dados pessoais quando você interage com nosso site,
                preenche formulários, se cadastra em cursos ou eventos, entra
                em contato ou aceita receber comunicações.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {dadosColetados.map((d, i) => (
                <div
                  key={d.titulo}
                  className="p-6 rounded-2xl bg-white"
                  style={{
                    ...staggerStyle(dadosInView, i, 0.05),
                    border: "1px solid #eee",
                  }}
                >
                  <h3
                    className="text-base font-extrabold mb-3"
                    style={{ color: "#0059AB" }}
                  >
                    {d.titulo}
                  </h3>
                  <ul className="space-y-2">
                    {d.itens.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "#555" }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: "#F6811E" }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINALIDADES */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={finRef}
              className="mb-12"
              style={fadeIn(finInView)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Seção 2
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4"
                style={{ color: "#111" }}
              >
                Como utilizamos seus dados
              </h2>
              <p
                className="text-base leading-relaxed max-w-3xl"
                style={{ color: "#555" }}
              >
                Seus dados são tratados para as finalidades abaixo, com
                destaque para o envio de comunicações promocionais por
                e-mail e telefone.
              </p>
            </div>

            <div className="space-y-3">
              {finalidades.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex items-start gap-4 p-6 rounded-2xl"
                    style={{
                      ...staggerStyle(finInView, i, 0.05),
                      backgroundColor: f.destaque ? "rgba(246,129,30,0.05)" : "#fafafa",
                      border: f.destaque
                        ? "1.5px solid rgba(246,129,30,0.35)"
                        : "1px solid #eee",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${f.accent}18` }}
                    >
                      <Icon size={20} style={{ color: f.accent }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3
                          className="text-base font-extrabold"
                          style={{ color: "#111" }}
                        >
                          {f.title}
                        </h3>
                        {f.destaque && (
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "#F6811E",
                              color: "#fff",
                            }}
                          >
                            Principal
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#555" }}
                      >
                        {f.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* COOKIES */}
        <section
          className="py-24"
          style={{ backgroundColor: "#fafafa" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={cookieRef}
              className="mb-12"
              style={fadeIn(cookieInView)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Seção 3
                </span>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,89,171,0.1)" }}
                >
                  <Cookie size={22} style={{ color: "#0059AB" }} />
                </div>
                <div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3"
                    style={{ color: "#111" }}
                  >
                    Uso de cookies
                  </h2>
                  <p
                    className="text-base leading-relaxed max-w-3xl"
                    style={{ color: "#555" }}
                  >
                    Cookies são pequenos arquivos armazenados no seu
                    dispositivo que nos ajudam a oferecer uma experiência
                    melhor. Ao continuar navegando no site, você concorda
                    com o uso de cookies conforme descrito abaixo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {tiposCookies.map((c, i) => (
                <div
                  key={c.titulo}
                  className="p-6 rounded-2xl bg-white"
                  style={{
                    ...staggerStyle(cookieInView, i, 0.05),
                    border: "1px solid #eee",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor:
                          i % 2 === 0
                            ? "rgba(246,129,30,0.12)"
                            : "rgba(0,89,171,0.1)",
                      }}
                    >
                      <Cookie
                        size={16}
                        style={{
                          color: i % 2 === 0 ? "#F6811E" : "#0059AB",
                        }}
                      />
                    </div>
                    <h3
                      className="text-base font-extrabold"
                      style={{ color: "#111" }}
                    >
                      {c.titulo}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555" }}
                  >
                    {c.descricao}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 p-5 rounded-xl text-sm"
              style={{
                backgroundColor: "#fff",
                border: "1px dashed #ccc",
                color: "#555",
              }}
            >
              Você pode configurar seu navegador para recusar cookies, mas
              alguns recursos do site podem não funcionar corretamente.
              Consulte a ajuda do seu navegador para saber como gerenciar
              suas preferências.
            </div>
          </div>
        </section>

        {/* DIREITOS DO TITULAR */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={dirRef}
              className="mb-12"
              style={fadeIn(dirInView)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Seção 4
                </span>
              </div>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,89,171,0.1)" }}
                >
                  <Scale size={22} style={{ color: "#0059AB" }} />
                </div>
                <div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3"
                    style={{ color: "#111" }}
                  >
                    Seus direitos como titular
                  </h2>
                  <p
                    className="text-base leading-relaxed max-w-3xl"
                    style={{ color: "#555" }}
                  >
                    Em conformidade com a Lei Geral de Proteção de Dados
                    (LGPD), você tem os seguintes direitos sobre seus dados
                    pessoais:
                  </p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {direitos.map((d, i) => (
                <div
                  key={d}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    ...staggerStyle(dirInView, i, 0.03),
                    backgroundColor: "#fafafa",
                    border: "1px solid #eee",
                  }}
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#F6811E" }}
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "#333" }}
                  >
                    {d}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEGURANÇA + COMPARTILHAMENTO */}
        <section
          className="py-24"
          style={{ backgroundColor: "#fafafa" }}
        >
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
            <div
              className="p-7 rounded-2xl bg-white"
              style={{ border: "1px solid #eee" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0,89,171,0.1)" }}
                >
                  <Lock size={20} style={{ color: "#0059AB" }} />
                </div>
                <h3
                  className="text-lg font-extrabold"
                  style={{ color: "#111" }}
                >
                  Segurança e armazenamento
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#555" }}
              >
                Adotamos medidas técnicas e administrativas para proteger
                seus dados contra acessos não autorizados, perda, alteração
                ou destruição. Os dados são armazenados pelo tempo
                necessário para cumprir as finalidades descritas nesta
                política ou conforme exigido por lei.
              </p>
            </div>

            <div
              className="p-7 rounded-2xl bg-white"
              style={{ border: "1px solid #eee" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(246,129,30,0.12)" }}
                >
                  <Database size={20} style={{ color: "#F6811E" }} />
                </div>
                <h3
                  className="text-lg font-extrabold"
                  style={{ color: "#111" }}
                >
                  Compartilhamento de dados
                </h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#555" }}
              >
                Seus dados poderão ser compartilhados com prestadores de
                serviço (hospedagem, envio de e-mails, ferramentas de
                analytics), parceiros e patrocinadores em ações conjuntas
                — sempre sob obrigação de confidencialidade — e com
                autoridades públicas quando exigido por lei. Não vendemos
                seus dados.
              </p>
            </div>
          </div>
        </section>

        {/* REVOGAÇÃO + CONTATO */}
        <section
          ref={ctaRef}
          className="relative py-24 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #002952 0%, #004a94 35%, #0059AB 60%, #0068c7 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="relative z-10 max-w-5xl mx-auto px-6"
            style={fadeIn(ctaInView)}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Como exercer seus direitos
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.05] text-white mb-6 max-w-3xl">
              Quer revogar o consentimento ou descadastrar suas comunicações?
            </h2>
            <p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-3xl"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Você pode solicitar o descadastramento das comunicações
              promocionais a qualquer momento, sem qualquer custo. Para
              isso, utilize um dos canais abaixo ou clique no link de
              descadastro presente nos e-mails que enviamos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <a
                href="mailto:acomac@acomacjoinville.com.br?subject=Solicita%C3%A7%C3%A3o%20LGPD%20%E2%80%94%20Dados%20pessoais"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(246,129,30,0.18)" }}
                >
                  <Mail size={20} style={{ color: "#F6811E" }} />
                </div>
                <div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    E-mail
                  </p>
                  <p className="text-sm font-bold text-white">
                    acomac@acomacjoinville.com.br
                  </p>
                </div>
              </a>

              <a
                href="tel:+554734350660"
                className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(0,104,199,0.25)" }}
                >
                  <Phone size={20} style={{ color: "#ffffff" }} />
                </div>
                <div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Telefone
                  </p>
                  <p className="text-sm font-bold text-white">
                    (47) 3435-0660
                  </p>
                </div>
              </a>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Controlador de dados
              </p>
              <p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                <strong className="text-white">
                  ACOMAC Joinville — Associação dos Comerciantes de Material
                  de Construção
                </strong>
                <br />
                Rua Princesa Isabel, 438 — Costa e Silva — Joinville/SC
              </p>
            </div>
          </div>
        </section>

        {/* ALTERAÇÕES */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3
              className="text-xl md:text-2xl font-extrabold mb-3"
              style={{ color: "#111" }}
            >
              Alterações nesta política
            </h3>
            <p
              className="text-sm md:text-base leading-relaxed"
              style={{ color: "#555" }}
            >
              Esta Política de Privacidade pode ser atualizada
              periodicamente. Recomendamos a leitura regular desta página
              para se manter informado sobre eventuais alterações. A versão
              em vigor é sempre a publicada nesta página, com a data da
              última atualização exibida no topo.
            </p>
          </div>
        </section>
      </main>
    </ClientSiteChrome>
  );
}
