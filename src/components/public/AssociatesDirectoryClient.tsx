"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  AssociateCard,
  AssociateMapModal,
  type AssociateItem,
} from "./AssociateCard";

export default function AssociatesDirectoryClient() {
  const [items, setItems] = useState<AssociateItem[] | null>(null);
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState<string>("Todos");
  const [mapFor, setMapFor] = useState<AssociateItem | null>(null);

  useEffect(() => {
    fetch("/api/public/associates")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const segments = useMemo(() => {
    const s = new Set<string>();
    (items ?? []).forEach((i) => {
      if (i.segment) s.add(i.segment);
    });
    return ["Todos", ...Array.from(s).sort()];
  }, [items]);

  const filtered = (items ?? []).filter((a) => {
    if (segment !== "Todos" && a.segment !== segment) return false;
    if (!q) return true;
    const hay = [
      a.displayName ?? a.companyName,
      a.description ?? "",
      a.displayDescription ?? "",
      a.segment ?? "",
      a.products ?? "",
      a.city ?? "",
      a.neighborhood ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  if (items === null) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl animate-pulse h-96"
            style={{ background: "#f2f4f7", border: "1px solid #eceef2" }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: "#f7f7f7", color: "#6b7486" }}
      >
        <p className="text-sm">
          Nenhum associado publicado ainda. Seja o primeiro a se cadastrar!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div
            className="flex items-center gap-2 flex-1 px-4 py-3 rounded-2xl"
            style={{
              background: "#fff",
              border: "1px solid #eceef2",
              boxShadow: "0 4px 16px rgba(16,24,40,0.04)",
            }}
          >
            <Search size={16} style={{ color: "#8a94a6" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por empresa, produto, cidade..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#0e1a2b" }}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {segments.map((s) => (
              <button
                key={s}
                onClick={() => setSegment(s)}
                className="text-xs font-semibold px-3.5 py-2 rounded-full whitespace-nowrap transition-colors"
                style={{
                  background: segment === s ? "#0059AB" : "#fff",
                  color: segment === s ? "#fff" : "#5a6577",
                  border: `1px solid ${segment === s ? "#0059AB" : "#eceef2"}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "#f7f7f7", color: "#6b7486" }}
          >
            <p className="text-sm">
              Nenhum associado encontrado com os filtros atuais.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <AssociateCard
                key={a.id}
                item={a}
                onOpenMap={() => setMapFor(a)}
              />
            ))}
          </div>
        )}
      </div>

      {mapFor && (
        <AssociateMapModal item={mapFor} onClose={() => setMapFor(null)} />
      )}
    </>
  );
}
