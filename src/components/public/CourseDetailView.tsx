import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
  Tag,
  User,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import SponsorAside from "./SponsorAside";
import { renderRichText } from "@/lib/rich-text";
import {
  proximaTurmaMessage,
  resolveCourseCta,
  turmaEncerrada,
} from "@/lib/course-cta";

export type CourseDetailData = {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  instructor: string;
  image: string;
  ctaType: string;
  ctaLabel: string;
  ctaHref: string;
  ctaWhatsappNumber: string;
  ctaWhatsappMessage: string;
  startDate: string | null;
  endDate: string | null;
};

/** "31 de agosto de 2026, 19h" — omite a hora quando é meia-noite. */
function formatarData(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const data = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
  if (d.getHours() === 0 && d.getMinutes() === 0) return data;
  const hora = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${data}, ${hora.replace(":00", "h").replace(":", "h")}`;
}

export default function CourseDetailView({
  course,
  fallbackWhatsapp,
}: {
  course: CourseDetailData;
  fallbackWhatsapp: string;
}) {
  const encerrado = turmaEncerrada(course.endDate);

  const cta = resolveCourseCta(
    course,
    fallbackWhatsapp,
    encerrado
      ? {
          message: proximaTurmaMessage(course.title),
          label: "Avise-me da próxima turma",
        }
      : {}
  );
  // Turma encerrada nunca manda para inscrição externa — só para o contato.
  const ctaFinal =
    encerrado && cta.kind === "link"
      ? resolveCourseCta(
          { ...course, ctaType: "whatsapp" },
          fallbackWhatsapp,
          {
            message: proximaTurmaMessage(course.title),
            label: "Avise-me da próxima turma",
          }
        )
      : cta;

  const conteudo = renderRichText(course.content);
  const inicio = course.startDate ? formatarData(course.startDate) : "";
  const termino = course.endDate ? formatarData(course.endDate) : "";

  const ficha = [
    inicio && { icon: CalendarDays, label: "Início", value: inicio },
    termino && { icon: CalendarDays, label: "Encerramento", value: termino },
    course.duration && { icon: Clock, label: "Carga horária", value: course.duration },
    course.level && { icon: GraduationCap, label: "Nível", value: course.level },
    course.category && { icon: Tag, label: "Trilha", value: course.category },
    course.instructor && { icon: User, label: "Instrutor", value: course.instructor },
    course.price && { icon: CheckCircle2, label: "Investimento", value: course.price },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  return (
    <main>
      {/* HERO */}
      <section
        className="relative pt-24 pb-16 overflow-hidden"
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
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 text-[13px] font-semibold mb-8 transition-opacity hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            <ArrowLeft size={14} />
            Todos os cursos
          </Link>

          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                {course.category && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#F6811E", color: "#fff" }}
                  >
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {course.level}
                  </span>
                )}
                {encerrado && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "rgba(0,0,0,0.35)", color: "#fff" }}
                  >
                    <CheckCircle2 size={12} />
                    Turma encerrada
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.05] text-white mb-5">
                {course.title}
              </h1>

              {course.description && (
                <p
                  className="text-base md:text-lg leading-relaxed max-w-2xl"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {course.description}
                </p>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
                {inicio && (
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <CalendarDays size={15} style={{ color: "#F6811E" }} />
                    {inicio}
                  </span>
                )}
                {course.duration && (
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <Clock size={15} style={{ color: "#F6811E" }} />
                    {course.duration}
                  </span>
                )}
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  <MapPin size={15} style={{ color: "#F6811E" }} />
                  Sede ACOMAC — Joinville, SC
                </span>
              </div>
            </div>

            {course.image && (
              <div
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                }}
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(min-width:1024px) 380px, 100vw"
                  className="object-cover"
                  style={encerrado ? { filter: "grayscale(0.7)" } : undefined}
                  unoptimized
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTEÚDO + FICHA */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10">
          <div className="min-w-0">
            {encerrado && (
              <div
                className="rounded-xl p-4 mb-8 flex items-start gap-3"
                style={{ backgroundColor: "#fff7ee", border: "1px solid #f3d9bd" }}
              >
                <CheckCircle2
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#d96a0a" }}
                />
                <p className="text-sm leading-relaxed" style={{ color: "#7a4a12" }}>
                  <strong>Esta turma já foi realizada</strong> e não está com
                  inscrições abertas. Avise a equipe se tiver interesse — você entra
                  na lista da próxima turma.
                </p>
              </div>
            )}

            {conteudo ? (
              <>
                <h2
                  className="text-xl md:text-2xl font-extrabold tracking-tight mb-6"
                  style={{ color: "#111" }}
                >
                  Sobre o curso
                </h2>
                <div
                  className="course-content"
                  dangerouslySetInnerHTML={{ __html: conteudo }}
                />
              </>
            ) : (
              <p className="text-[15px] leading-relaxed" style={{ color: "#555" }}>
                {course.description ||
                  "Fale com a equipe da ACOMAC para receber a programação completa deste curso."}
              </p>
            )}

            <style>{`
              .course-content :first-child { margin-top: 0; }
              .course-content > * + * { margin-top: 1em; }
              .course-content h1, .course-content h2 {
                font-size: 1.4em; font-weight: 800; line-height: 1.25;
                color: #0e1a2b; margin-top: 1.8em;
              }
              .course-content h3 {
                font-size: 1.15em; font-weight: 700; line-height: 1.3;
                color: #0e1a2b; margin-top: 1.5em;
              }
              .course-content p { font-size: 16px; line-height: 1.8; color: #2d3748; }
              .course-content ul, .course-content ol {
                padding-left: 1.4em; font-size: 16px; line-height: 1.8; color: #2d3748;
              }
              .course-content ul { list-style: disc; }
              .course-content ol { list-style: decimal; }
              .course-content li + li { margin-top: 0.4em; }
              .course-content strong { color: #0e1a2b; font-weight: 700; }
              .course-content a { color: #0059AB; text-decoration: underline; }
              .course-content img { border-radius: 12px; max-width: 100%; height: auto; }
              .course-content blockquote {
                border-left: 3px solid #F6811E; padding-left: 1em; color: #4a5568; font-style: italic;
              }
            `}</style>
          </div>

          <aside className="space-y-5">
            <div
              className="rounded-2xl p-6 lg:sticky lg:top-24"
              style={{ backgroundColor: "#fafafa", border: "1px solid #eee" }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
                style={{ color: "#888" }}
              >
                {encerrado ? "Próximas turmas" : "Inscrição"}
              </p>

              {ficha.length > 0 && (
                <ul className="space-y-3 mb-6">
                  {ficha.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.label} className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(0,89,171,0.08)" }}
                        >
                          <Icon size={14} style={{ color: "#0059AB" }} />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[11px] font-bold uppercase tracking-wider"
                            style={{ color: "#999" }}
                          >
                            {f.label}
                          </p>
                          <p
                            className="text-[14px] font-semibold leading-snug"
                            style={{ color: "#222" }}
                          >
                            {f.value}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <a
                href={ctaFinal.href}
                target={ctaFinal.external ? "_blank" : undefined}
                rel={ctaFinal.external ? "noopener noreferrer" : undefined}
                data-track="curso_detalhe_cta"
                data-track-label={course.title}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-300"
                style={{
                  backgroundColor: encerrado ? "#fff" : "#0059AB",
                  color: encerrado ? "#0059AB" : "#fff",
                  border: encerrado ? "1px solid #d8e3f0" : "none",
                  boxShadow: encerrado ? "none" : "0 4px 16px rgba(0,89,171,0.25)",
                }}
              >
                {ctaFinal.kind === "whatsapp" ? (
                  <WhatsAppIcon size={16} />
                ) : ctaFinal.kind === "link" ? (
                  <ExternalLink size={15} />
                ) : null}
                {ctaFinal.label}
                {ctaFinal.kind === "contato" && <ArrowRight size={15} />}
              </a>

              <p className="text-[12px] mt-3 text-center" style={{ color: "#999" }}>
                {ctaFinal.kind === "whatsapp"
                  ? "Abre o WhatsApp com a mensagem pronta."
                  : ctaFinal.kind === "link"
                  ? "Você será levado à página de inscrição."
                  : "Fale com a equipe da ACOMAC."}
              </p>
            </div>

            <SponsorAside slot="cursos-detalhe" />
          </aside>
        </div>
      </section>
    </main>
  );
}
