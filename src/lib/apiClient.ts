import type { RsvpPayload, RsvpResponse, WishesResponse, Wish } from "../types";

const TIMEOUT_MS = 10000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw { status: res.status, data };
    }
    return data as T;
  } finally {
    clearTimeout(id);
  }
}

export const apiClient = {
  getWishes: () => request<WishesResponse>("/api/wishes"),
  postRsvp: (payload: RsvpPayload) =>
    request<RsvpResponse>("/api/rsvps", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  postWish: (payload: { name: string; message: string }) =>
    request<Wish>("/api/wishes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export function getApiErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "data" in err) {
    const d = (err as { data: { error?: { message?: string } } }).data;
    if (d?.error?.message) return d.error.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function getApiErrorFields(err: unknown): Record<string, string> | undefined {
  if (err && typeof err === "object" && "data" in err) {
    const d = (err as { data: { error?: { fields?: Record<string, string> } } }).data;
    return d?.error?.fields;
  }
  return undefined;
}
