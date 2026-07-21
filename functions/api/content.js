// GET  /api/content  -> contenido de la tienda (público, lectura)
// PUT  /api/content  -> guarda el contenido (requiere x-admin-key)   [KV: MA_KV]
const KEY = "content";
const DEFAULT_PASS = "m&Aboutiqu3";

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

export async function onRequestGet({ env }) {
  if (!env.MA_KV) return json({ products: null, catalogs: [], _note: "KV no enlazado" });
  const v = await env.MA_KV.get(KEY);
  return json(v ? JSON.parse(v) : { products: null, catalogs: [] });
}

export async function onRequestPut({ request, env }) {
  if (!authorized(request, env)) return json({ error: "No autorizado" }, 401);
  if (!env.MA_KV) return json({ error: "Falta enlazar el KV (variable MA_KV) en Cloudflare." }, 500);
  let body = null;
  try { body = await request.json(); } catch {}
  if (!body || typeof body !== "object") return json({ error: "JSON inválido" }, 400);
  const data = {
    products: Array.isArray(body.products) ? body.products : [],
    catalogs: Array.isArray(body.catalogs) ? body.catalogs : [],
    updatedAt: new Date().toISOString()
  };
  await env.MA_KV.put(KEY, JSON.stringify(data));
  return json({ ok: true, updatedAt: data.updatedAt, products: data.products.length, catalogs: data.catalogs.length });
}
