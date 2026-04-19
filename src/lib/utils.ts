import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function whatsappLink(number: string, message?: string) {
  const d = number.replace(/\D/g, "");
  if (!d) return "#";
  const phone = d.length <= 11 ? `55${d}` : d;
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
