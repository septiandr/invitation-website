/**
 * Helper DOM murni untuk sistem animasi scroll (tidak bergantung state React).
 * Dipakai oleh `useScrollAnims` untuk memutuskan elemen mana yang dianimasikan.
 */

/** Elemen punya teks langsung (bukan cuma membungkus elemen lain). */
export function ownsText(el: Element): boolean {
  return Array.from(el.childNodes).some(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim().length > 0
  );
}

/** Elemen media yang ikut animasi zoom-in. */
export function isMedia(el: Element): boolean {
  return ["IMG", "IFRAME", "VIDEO"].includes(el.tagName);
}

/**
 * Elemen yang dilewati: script/style, SVG dekoratif, dan penanda
 * `aria-hidden` non-media. Isi form (label, tombol) SENGAJA tidak dilewati.
 */
export function isSkippable(el: Element): boolean {
  return (
    ["SCRIPT", "STYLE", "SVG", "PATH", "USE"].includes(el.tagName) ||
    (!isMedia(el) && el.getAttribute("aria-hidden") === "true")
  );
}

/** Elemen yang diperlakukan sebagai "judul" (animasi di kloter pertama). */
export function isHeading(el: Element): boolean {
  return (
    /^H[1-6]$/.test(el.tagName) ||
    el.classList.contains("kicker") ||
    el.classList.contains("display") ||
    el.classList.contains("script") ||
    el.tagName === "STRONG" ||
    el.tagName === "BLOCKQUOTE" ||
    el.tagName === "CITE"
  );
}

/**
 * Stagger adaptif: daftar panjang tetap ringkas (total tambahan <= max).
 */
export function staggerFor(n: number, base: number, max: number): number {
  return n > 0 ? Math.min(base, max / n) : 0;
}

/** True bila elemen sedang terlihat di viewport (boleh sebagian). */
export function inViewport(el: Element, ratio = 0.92): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * ratio && r.bottom > 0;
}

/**
 * Pecah text-node langsung menjadi span per kata (elemen anak dibiarkan).
 * Untuk stagger kata-per-kata pada judul. Aman dipanggil sekali per elemen.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.wordsSplit === "1") return Array.from(el.querySelectorAll<HTMLElement>(".w-split"));
  el.dataset.wordsSplit = "1";
  const spans: HTMLElement[] = [];
  Array.from(el.childNodes).forEach((n) => {
    if (n.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    (n.textContent ?? "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(" "));
        return;
      }
      const s = document.createElement("span");
      s.className = "w-split";
      s.textContent = part;
      frag.appendChild(s);
      spans.push(s);
    });
    el.replaceChild(frag, n);
  });
  return spans.length ? spans : [el];
}

export type CardGroup = {
  /** Elemen yang menjadi trigger ScrollTrigger grup ini. */
  trigger: HTMLElement;
  /** Elemen yang dianimasikan bersama (stagger) saat trigger masuk. */
  els: HTMLElement[];
};

export type Collected = {
  /** Judul (dianimasikan per kata). */
  headingEls: HTMLElement[];
  /** Paragraf/tombol/label (dianimasikan per elemen). */
  paraEls: HTMLElement[];
  /** Semua teks (gabungan, untuk kompatibilitas). */
  textEls: HTMLElement[];
  /** Media di luar kartu (trigger = section). Elemen [data-parallax] dikecualikan. */
  mediaEls: HTMLElement[];
  /** Grup kartu, masing-masing dengan trigger sendiri (per item). */
  groups: CardGroup[];
  /** Media di dalam kartu, dikelompokkan per trigger kartu. */
  mediaInGroup: Map<HTMLElement, HTMLElement[]>;
};

/**
 * Kumpulkan target animasi dalam satu section:
 * - teks (judul/paragraf/label/tombol) — kecuali isi kartu (ikut kartunya),
 * - media — yang di dalam kartu dikelompokkan per kartu (per item),
 * - `article.stagger` (kartu mempelai) → satu grup per kartu,
 * - `article` biasa (wishes) → satu grup per item.
 */
export function collectSection(root: HTMLElement): Collected {
  const headingEls: HTMLElement[] = [];
  const paraEls: HTMLElement[] = [];
  const mediaEls: HTMLElement[] = [];
  const cardEls = new Set<HTMLElement>();
  const groups: CardGroup[] = [];
  const mediaInGroup = new Map<HTMLElement, HTMLElement[]>();

  root.querySelectorAll<HTMLElement>("article.stagger").forEach((a) => {
    const kids = Array.from(a.children).filter(
      (c): c is HTMLElement => c instanceof HTMLElement
    );
    kids.forEach((c) => cardEls.add(c));
    if (kids.length) groups.push({ trigger: a, els: kids });
  });
  root.querySelectorAll<HTMLElement>("article").forEach((a) => {
    if (a.classList.contains("stagger")) return;
    cardEls.add(a);
    groups.push({ trigger: a, els: [a] });
  });
  const groupTriggers = groups.map((g) => g.trigger);

  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (isSkippable(el)) return;
    if (isMedia(el)) {
      // Elemen [data-parallax] ditangani Blok parallax scrub tersendiri.
      if (el.hasAttribute("data-parallax")) return;
      const owner = groupTriggers.find((t) => t.contains(el));
      if (owner) {
        const list = mediaInGroup.get(owner) ?? [];
        list.push(el);
        mediaInGroup.set(owner, list);
      } else {
        mediaEls.push(el);
      }
      return;
    }
    if ([...cardEls].some((c) => c !== el && c.contains(el))) return;
    if (ownsText(el) || ((el.tagName === "A" || el.tagName === "BUTTON") && el.textContent?.trim())) {
      (isHeading(el) ? headingEls : paraEls).push(el);
    }
  });

  return { textEls: [...headingEls, ...paraEls], headingEls, paraEls, mediaEls, groups, mediaInGroup };
}
