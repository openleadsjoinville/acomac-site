"use client";

import { useEffect, useRef, useState } from "react";

const PREFIX = "acomac-admin-draft:";

/**
 * Persiste alterações de um formulário no localStorage para o usuário
 * não perder edições ao recarregar/sair da página antes de salvar.
 *
 * Uso:
 *   const { hasDraft, restoreDraft, clearDraft, markSaved } = useDraftCache({
 *     key: `pages/${pageKey}`,
 *     dirty,                       // boolean — se há mudanças não salvas
 *     value,                       // estado atual (objeto serializável)
 *     onRestore: (cached) => {     // chamado se quiser perguntar ao usuário
 *       setValue(cached);
 *       setDirty(true);
 *     },
 *   });
 *
 * Estratégia:
 *  - Sempre que `dirty=true` e `value` muda, persiste no localStorage (debounce).
 *  - Ao montar: detecta se há cache; expõe `hasDraft + restoreDraft()`.
 *  - `markSaved()` (após salvar com sucesso) limpa o cache.
 */
export function useDraftCache<T>({
  key,
  dirty,
  value,
  onRestore,
  debounceMs = 350,
}: {
  key: string;
  dirty: boolean;
  value: T;
  onRestore: (cached: T) => void;
  debounceMs?: number;
}) {
  const fullKey = PREFIX + key;
  const [hasDraft, setHasDraft] = useState(false);
  const [restored, setRestored] = useState(false);
  const restoredFlag = useRef(false);

  // Detecta cache existente ao montar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(fullKey);
    if (raw) {
      try {
        const obj = JSON.parse(raw) as { savedAt: number; value: T };
        if (obj && obj.value !== undefined) {
          setHasDraft(true);
        }
      } catch {
        localStorage.removeItem(fullKey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persiste quando dirty + valor muda (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!dirty) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          fullKey,
          JSON.stringify({ savedAt: Date.now(), value })
        );
        setHasDraft(true);
      } catch {
        /* quota exceeded etc — ignora silenciosamente */
      }
    }, debounceMs);
    return () => clearTimeout(t);
  }, [dirty, value, fullKey, debounceMs]);

  function restoreDraft() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(fullKey);
    if (!raw) return;
    try {
      const obj = JSON.parse(raw) as { savedAt: number; value: T };
      onRestore(obj.value);
      restoredFlag.current = true;
      setRestored(true);
    } catch {
      localStorage.removeItem(fullKey);
    }
  }

  function clearDraft() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(fullKey);
    setHasDraft(false);
  }

  /** Chamar após salvar com sucesso (limpa o cache local). */
  function markSaved() {
    clearDraft();
  }

  function getDraftSavedAt(): Date | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(fullKey);
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw) as { savedAt: number };
      return new Date(obj.savedAt);
    } catch {
      return null;
    }
  }

  return {
    hasDraft,
    restored,
    restoreDraft,
    clearDraft,
    markSaved,
    getDraftSavedAt,
  };
}
