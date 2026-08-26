/** Pembantu respons JSON untuk API routes. */
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function bacaJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValid(nilai: unknown): nilai is string {
  return typeof nilai === "string" && POLA_EMAIL.test(nilai);
}

export function kataSandiValid(nilai: unknown): nilai is string {
  return typeof nilai === "string" && nilai.length >= 8;
}
