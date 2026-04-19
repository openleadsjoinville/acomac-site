import { prisma } from "@/lib/db";
import { ExternalLink, Instagram, Globe } from "lucide-react";

export default async function AssociatesDirectory() {
  const associates = await prisma.associate.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ orderIndex: "asc" }, { displayName: "asc" }],
  });

  if (associates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-500">
          Nenhum associado publicado ainda. Seja o primeiro a se cadastrar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {associates.map((a) => {
        const name = a.displayName || a.companyName;
        const desc = a.displayDescription || a.description || "";
        const logo = a.displayLogo || a.logoUrl;
        return (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {[a.segment, a.city].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            {desc && (
              <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                {desc}
              </p>
            )}
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              {a.website && (
                <a
                  href={a.website.startsWith("http") ? a.website : `https://${a.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-[#0059AB]"
                >
                  <Globe size={12} />
                  Website
                  <ExternalLink size={10} />
                </a>
              )}
              {a.instagram && (
                <a
                  href={
                    a.instagram.startsWith("http")
                      ? a.instagram
                      : `https://instagram.com/${a.instagram.replace(/^@/, "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-[#0059AB]"
                >
                  <Instagram size={12} />
                  Instagram
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
