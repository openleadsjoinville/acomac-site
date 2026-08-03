import { prisma } from "@/lib/db";

/** Tentativas erradas permitidas dentro da janela antes de bloquear. */
const MAX_ATTEMPTS = 5;
/** Janela em que as tentativas erradas se acumulam. */
const WINDOW_MS = 15 * 60 * 1000;
/** Duração do bloqueio depois de estourar o limite. */
const LOCK_MS = 15 * 60 * 1000;

export type RateLimitState = {
  locked: boolean;
  /** Segundos restantes de bloqueio (0 se liberado). */
  retryAfterSec: number;
  /** Tentativas ainda disponíveis antes do bloqueio. */
  remaining: number;
};

const FREE: RateLimitState = {
  locked: false,
  retryAfterSec: 0,
  remaining: MAX_ATTEMPTS,
};

/** IP do cliente atrás do proxy da Vercel; "unknown" agrupa quem não expõe IP. */
export function getClientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip =
    fwd?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return ip.slice(0, 100);
}

function secondsUntil(date: Date, now: Date): number {
  return Math.max(1, Math.ceil((date.getTime() - now.getTime()) / 1000));
}

/** Consulta o estado atual sem alterar o contador. */
export async function checkLoginLock(key: string): Promise<RateLimitState> {
  try {
    const rec = await prisma.loginAttempt.findUnique({ where: { key } });
    if (!rec) return FREE;
    const now = new Date();
    if (rec.lockedUntil && rec.lockedUntil > now) {
      return {
        locked: true,
        retryAfterSec: secondsUntil(rec.lockedUntil, now),
        remaining: 0,
      };
    }
    if (rec.lockedUntil || now.getTime() - rec.firstAt.getTime() > WINDOW_MS) {
      return FREE;
    }
    return {
      locked: false,
      retryAfterSec: 0,
      remaining: Math.max(0, MAX_ATTEMPTS - rec.count),
    };
  } catch {
    // Falha de banco não pode trancar o painel: libera a tentativa.
    return FREE;
  }
}

/** Registra uma tentativa errada e devolve o estado resultante. */
export async function registerFailedLogin(key: string): Promise<RateLimitState> {
  try {
    const now = new Date();
    const rec = await prisma.loginAttempt.findUnique({ where: { key } });

    if (rec?.lockedUntil && rec.lockedUntil > now) {
      return {
        locked: true,
        retryAfterSec: secondsUntil(rec.lockedUntil, now),
        remaining: 0,
      };
    }

    // Bloqueio vencido ou janela expirada → começa a contagem do zero.
    const expired =
      !rec ||
      !!rec.lockedUntil ||
      now.getTime() - rec.firstAt.getTime() > WINDOW_MS;
    const count = expired ? 1 : rec.count + 1;
    const lockedUntil =
      count >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MS) : null;

    await prisma.loginAttempt.upsert({
      where: { key },
      create: { key, count, firstAt: now, lastAt: now, lockedUntil },
      update: {
        count,
        lastAt: now,
        lockedUntil,
        ...(expired ? { firstAt: now } : {}),
      },
    });

    return lockedUntil
      ? { locked: true, retryAfterSec: secondsUntil(lockedUntil, now), remaining: 0 }
      : { locked: false, retryAfterSec: 0, remaining: MAX_ATTEMPTS - count };
  } catch {
    return FREE;
  }
}

/** Zera o contador após um login bem-sucedido. */
export async function clearLoginAttempts(key: string): Promise<void> {
  try {
    await prisma.loginAttempt.deleteMany({ where: { key } });
  } catch {
    // ignora: limpeza não deve derrubar o login
  }
}

export const LOGIN_MAX_ATTEMPTS = MAX_ATTEMPTS;
