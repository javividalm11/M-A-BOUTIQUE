// GET /api/file/<id>  -> sirve una foto o PDF guardado en KV (MA_KV), público
export async function onRequestGet({ params, env }) {
  if (!env.MA_KV) return new Response("KV no enlazado", { status: 500 });
  const id = Array.isArray(params.id) ? params.id.join("/") : String(params.id || "");
  if (!id) return new Response("ID vacío", { status: 400 });

  const res = await env.MA_KV.getWithMetadata("file:" + id, { type: "arrayBuffer" });
  if (!res || !res.value) return new Response("Archivo no encontrado", { status: 404 });

  const ct = (res.metadata && res.metadata.ct) || "application/octet-stream";
  const headers = new Headers();
  headers.set("content-type", ct);
  headers.set("cache-control", "public, max-age=3600");
  headers.set("content-disposition", "inline");
  return new Response(res.value, { headers });
}
