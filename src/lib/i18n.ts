export type Lang = "id" | "en";

export function getLang(): Lang {
  const p = new URLSearchParams(window.location.search).get("lang");
  return p === "en" ? "en" : "id";
}

export function setLang(l: Lang) {
  const url = new URL(window.location.href);
  url.searchParams.set("lang", l);
  window.location.href = url.toString();
}

export function getGuestName(fallback: string): string {
  const q = new URLSearchParams(window.location.search);
  return q.get("guest") || q.get("code") || q.get("to") || fallback;
}

/** tiny ID|EN picker mirroring Invitato S.Z(id,en) */
export const t = (lang: Lang, id: string, en: string) => (lang === "id" ? id : en);
