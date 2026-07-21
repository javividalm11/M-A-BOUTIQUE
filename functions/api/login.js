// POST /api/login  { password }  -> valida contra ADMIN_PASSWORD (secreto del servidor)
const DEFAULT_PASS = "m&Aboutiqu3";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}

export async function onRequestPost({ request, env }) {
  let body = {};
  try { body = await request.json(); } catch {}
  const expected = env.ADMIN_PASSWORD || DEFAULT_PASS;
  if (body && typeof body.password === "string" && body.password === expected) {
    return json({ ok: true });
  }
  return json({ ok: false, error: "Contraseña incorrecta" }, 401);
}

export async function onRequestGet() {
  return json({ ok: true, hint: "Usa POST con { password } para iniciar sesión." });
}
