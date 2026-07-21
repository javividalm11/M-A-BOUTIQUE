// POST /api/upload  (multipart form: file)  -> sube a R2 y devuelve { url }  (requiere x-admin-key)  [R2: MA_R2]
const DEFAULT_PASS = "m&Aboutiqu3";
const MAX = 25 * 1024 * 1024; // 25 MB

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
function authorized(request, env) {
  const k = request.headers.get("x-admin-key") || "";
  return k === (env.ADMIN_PASSWORD || DEFAULT_PASS);
}

export async function onRequestPost({ request, env }) {
  if (!authorized(request, env)) return json({ error: "No autorizado" }, 401);
  if (!env.MA_R2) return json({ error: "Falta enlazar el bucket R2 (variable MA_R2) en Cloudflare." }, 500);

  let form;
  try { form = await request.formData(); } catch { return json({ error: "Formato inválido" }, 400); }
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ error: "No se recibió archivo" }, 400);

  const buf = await file.arrayBuffer();
  if (buf.byteLength > MAX) return json({ error: "Archivo demasiado grande (máx 25 MB)" }, 413);

  const clean = (file.name || "archivo").toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(-60);
  const key = `uploads/${Date.now()}-${clean}`;
  await env.MA_R2.put(key, buf, {
    httpMetadata: { contentType: file.type || "application/octet-stream" }
  });
  return json({ ok: true, url: `/files/${key}`, key, type: file.type || "" });
}
