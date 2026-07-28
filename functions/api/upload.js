// POST /api/upload  (multipart: file)  -> guarda el archivo en KV y devuelve { url }
// Requiere x-admin-key. Usa MA_KV (sin tarjeta, sin R2). Máx ~24 MB por archivo.
const DEFAULT_PASS = "m&Aboutiqu3";
const MAX = 24 * 1024 * 1024;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status, headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
function authorized(request, env) {
  return (request.headers.get("x-admin-key") || "") === (env.ADMIN_PASSWORD || DEFAULT_PASS);
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ error: "No autorizado" }, 401);
  if (!env.MA_KV) return json({ error: "Falta enlazar el KV (variable MA_KV) en Cloudflare." }, 500);

  let form;
  try { form = await request.formData(); } catch { return json({ error: "Formato inválido" }, 400); }
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ error: "No se recibió archivo" }, 400);

  const buf = await file.arrayBuffer();
  if (buf.byteLength > MAX) {
    return json({ error: "Archivo muy grande (máx 24 MB). Comprime el PDF o usa una foto más ligera." }, 413);
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const ext = ((file.name || "").split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  const suffix = ext ? "." + ext : "";
  const key = "file:" + id + suffix;
  await env.MA_KV.put(key, buf, { metadata: { ct: file.type || "application/octet-stream", name: file.name || "" } });
  return json({ ok: true, url: "/api/file/" + id + suffix, key });
}
