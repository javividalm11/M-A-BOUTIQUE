// GET /files/<key>  -> sirve un archivo (foto o PDF) desde R2 (MA_R2), público
export async function onRequestGet({ params, env }) {
  if (!env.MA_R2) return new Response("R2 no enlazado", { status: 500 });
  const path = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!path) return new Response("Ruta vacía", { status: 400 });

  const obj = await env.MA_R2.get(path);
  if (!obj) return new Response("Archivo no encontrado", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=3600");
  // PDFs e imágenes se muestran en línea (no descarga forzada)
  headers.set("content-disposition", "inline");
  return new Response(obj.body, { headers });
}
