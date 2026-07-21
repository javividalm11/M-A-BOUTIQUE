/* =============================================================
   M&A BOUTIQUE — Panel de administración
   Requiere las Functions de Cloudflare (/api/*) + KV (MA_KV) + R2 (MA_R2).
   ============================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const KEYNAME = "ma_admin_key";
  const catMeta = id => (typeof CATEGORIES !== "undefined" ? CATEGORIES.find(c => c.id === id) : null) || { name: id, short: id, icon: "🛍️" };

  let KEY = sessionStorage.getItem(KEYNAME) || "";
  let content = { products: [], catalogs: [] };
  let editingId = null, editingImg = null, catFile = null;

  /* ---------- API ---------- */
  async function api(path, opts = {}) {
    opts.headers = Object.assign({ "x-admin-key": KEY }, opts.headers || {});
    const r = await fetch(path, opts);
    if (r.status === 401) { toast("Sesión inválida. Inicia de nuevo.", false); logout(); throw new Error("401"); }
    return r;
  }
  async function login(pass) {
    const r = await fetch("/api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pass }) });
    return r.ok;
  }
  async function getContent() {
    try { const r = await fetch("/api/content", { cache: "no-store" }); return r.ok ? r.json() : null; }
    catch { return null; }
  }
  async function saveContent(silent) {
    try {
      const r = await api("/api/content", {
        method: "PUT", headers: { "content-type": "application/json" },
        body: JSON.stringify({ products: content.products, catalogs: content.catalogs })
      });
      const d = await r.json();
      if (r.ok) { setSaved(); if (!silent) toast("Cambios guardados ✓"); return true; }
      toast(d.error || "No se pudo guardar", false); return false;
    } catch (e) { if (e.message !== "401") toast("Error de conexión al guardar", false); return false; }
  }
  async function uploadFile(file) {
    const fd = new FormData(); fd.append("file", file);
    const r = await api("/api/upload", { method: "POST", body: fd });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Error al subir");
    return d.url;
  }

  /* ---------- UI base ---------- */
  function toast(msg, ok = true) {
    const w = $("#toastWrap"); if (!w) return;
    const el = document.createElement("div"); el.className = "toast";
    el.innerHTML = `<span class="t-ic" style="${ok ? "" : "background:var(--rose-2);color:#fff"}">${ok ? "✓" : "!"}</span>${msg}`;
    w.appendChild(el); setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 2600);
  }
  function setSaved() { const s = $("#saveState"); if (s) s.textContent = "Guardado " + new Date().toLocaleTimeString(); }
  function showApp() { $("#login").hidden = true; $("#app").hidden = false; }
  function logout() { sessionStorage.removeItem(KEYNAME); location.reload(); }

  /* ---------- Cargar ---------- */
  async function loadAll() {
    const c = await getContent();
    content.products = (c && Array.isArray(c.products)) ? c.products : [];
    content.catalogs = (c && Array.isArray(c.catalogs)) ? c.catalogs : [];
    fillCatFilter(); renderProducts(); renderCatalogs();
    if (!content.products.length) toast("No hay productos aún. Usa «Cargar catálogo actual» para empezar.");
  }
  function fillCatFilter() {
    const sel = $("#catFilter");
    const cats = (typeof CATEGORIES !== "undefined" ? CATEGORIES : []);
    sel.innerHTML = `<option value="all">Todas las categorías</option>` +
      cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
    const fsel = $("#f-cat");
    fsel.innerHTML = cats.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  }

  /* ---------- Productos ---------- */
  function renderProducts() {
    const cat = $("#catFilter").value, q = ($("#prodSearch").value || "").toLowerCase().trim();
    const list = content.products.filter(p =>
      (cat === "all" || p.cat === cat) &&
      (!q || ((p.name || "") + " " + (p.code || "") + " " + (p.tipo || "")).toLowerCase().includes(q))
    );
    const box = $("#prodList");
    if (!list.length) { box.innerHTML = `<div class="admin-empty">Sin productos. Pulsa «+ Nuevo producto» o «Cargar catálogo actual».</div>`; return; }
    box.innerHTML = list.map(p => {
      const m = catMeta(p.cat);
      const thumb = p.img ? `<img src="${p.img}" alt="">` : (p.code ? p.code.replace(" ", "") : (m.icon || "🛍️"));
      const meta = [p.code, p.tipo, (p.sizes && p.sizes.length ? "Tallas " + p.sizes.join(", ") : (p.note || ""))].filter(Boolean).join(" · ");
      return `<div class="arow" data-id="${p.id}">
        <div class="arow__thumb">${thumb}</div>
        <div class="arow__info">
          <span class="tag">${m.short}${p.featured ? " · ★" : ""}</span>
          <b>${escapeHTML(p.name || "Sin nombre")}</b>
          <div class="meta">${escapeHTML(meta)}</div>
        </div>
        <div class="arow__actions">
          <button class="mini" data-edit="${p.id}">Editar</button>
          <button class="mini danger" data-del="${p.id}">Borrar</button>
        </div>
      </div>`;
    }).join("");
    $$("[data-edit]", box).forEach(b => b.addEventListener("click", () => openProd(b.dataset.edit)));
    $$("[data-del]", box).forEach(b => b.addEventListener("click", () => delProd(b.dataset.del)));
  }

  function openProd(id) {
    editingId = id; editingImg = null;
    const p = id ? content.products.find(x => x.id === id) : null;
    $("#prodModalTitle").textContent = p ? "Editar producto" : "Nuevo producto";
    $("#f-cat").value = p ? p.cat : (CATEGORIES[0] ? CATEGORIES[0].id : "medusa");
    $("#f-tipo").value = p ? (p.tipo || "") : "";
    $("#f-code").value = p ? (p.code || "") : "";
    $("#f-sizes").value = p && p.sizes ? p.sizes.join(", ") : "";
    $("#f-name").value = p ? (p.name || "") : "";
    $("#f-desc").value = p ? (p.desc || "") : "";
    $("#f-note").value = p ? (p.note || "") : "";
    $("#f-featured").checked = p ? !!p.featured : false;
    editingImg = p ? (p.img || null) : null;
    $("#f-img").value = "";
    paintImg();
    $("#prodModal").classList.add("show");
  }
  function paintImg() {
    $("#imgPreview").innerHTML = editingImg ? `<img src="${editingImg}" alt="">` : "Sin foto";
  }
  async function onImgPick(e) {
    const f = e.target.files[0]; if (!f) return;
    $("#imgPreview").textContent = "Subiendo…";
    try { editingImg = await uploadFile(f); paintImg(); toast("Foto subida ✓"); }
    catch (err) { $("#imgPreview").textContent = "Error"; toast(err.message, false); }
  }
  async function saveProd() {
    const sizes = ($("#f-sizes").value || "").split(",").map(s => s.trim()).filter(Boolean)
      .map(s => (/^\d+$/.test(s) ? Number(s) : s));
    const p = {
      id: editingId || ("p" + Date.now().toString(36) + Math.floor(Math.random() * 1000)),
      cat: $("#f-cat").value,
      tipo: $("#f-tipo").value.trim(),
      code: $("#f-code").value.trim(),
      name: $("#f-name").value.trim() || "Producto",
      desc: $("#f-desc").value.trim() || null,
      note: $("#f-note").value.trim() || null,
      sizes: sizes.length ? sizes : null,
      featured: $("#f-featured").checked,
      img: editingImg || null
    };
    const i = content.products.findIndex(x => x.id === p.id);
    if (i >= 0) content.products[i] = p; else content.products.unshift(p);
    closeModals(); renderProducts();
    await saveContent();
  }
  async function delProd(id) {
    const p = content.products.find(x => x.id === id);
    if (!confirm(`¿Borrar "${p ? p.name : "este producto"}"?`)) return;
    content.products = content.products.filter(x => x.id !== id);
    renderProducts(); await saveContent();
  }
  function seed() {
    if (content.products.length && !confirm("Esto reemplazará la lista actual con el catálogo incluido. ¿Continuar?")) return;
    content.products = (typeof PRODUCTS !== "undefined" ? PRODUCTS : []).map(p => ({
      id: p.id, cat: p.cat, tipo: p.tipo, code: p.code, name: p.name,
      desc: null, note: p.note || null, sizes: p.sizes || null, featured: !!p.featured, img: p.img || null
    }));
    renderProducts(); saveContent();
    toast("Catálogo cargado. No olvides subir tus fotos.");
  }

  /* ---------- Catálogos PDF ---------- */
  function renderCatalogs() {
    const box = $("#catList");
    if (!content.catalogs.length) { box.innerHTML = `<div class="admin-empty">Sin catálogos. Pulsa «+ Nuevo catálogo PDF».</div>`; return; }
    box.innerHTML = content.catalogs.map(c => `
      <div class="arow" data-id="${c.id}">
        <div class="arow__thumb" style="font-size:1.5rem">📕</div>
        <div class="arow__info"><b>${escapeHTML(c.title || "Catálogo")}</b>
          <div class="meta"><a href="${c.url}" target="_blank" rel="noopener">Ver PDF ↗</a></div></div>
        <div class="arow__actions"><button class="mini danger" data-delcat="${c.id}">Borrar</button></div>
      </div>`).join("");
    $$("[data-delcat]", box).forEach(b => b.addEventListener("click", () => delCat(b.dataset.delcat)));
  }
  function openCat() { catFile = null; $("#c-title").value = ""; $("#c-file").value = ""; $("#c-fileState").textContent = ""; $("#catModal").classList.add("show"); }
  async function saveCat() {
    const title = $("#c-title").value.trim();
    if (!title) { toast("Ponle un título al catálogo", false); return; }
    if (!catFile) { toast("Elige un archivo PDF", false); return; }
    $("#c-fileState").textContent = "Subiendo PDF…";
    try {
      const url = await uploadFile(catFile);
      content.catalogs.unshift({ id: "c" + Date.now().toString(36), title, url });
      closeModals(); renderCatalogs(); await saveContent();
      toast("Catálogo agregado ✓");
    } catch (err) { toast(err.message, false); $("#c-fileState").textContent = "Error"; }
  }
  async function delCat(id) {
    if (!confirm("¿Borrar este catálogo?")) return;
    content.catalogs = content.catalogs.filter(c => c.id !== id);
    renderCatalogs(); await saveContent();
  }

  function closeModals() { $$(".admin-modal").forEach(m => m.classList.remove("show")); }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    fillCatFilter();
    // Login
    $("#loginForm").addEventListener("submit", async e => {
      e.preventDefault();
      const pass = $("#pass").value;
      $("#loginErr").textContent = "";
      if (await login(pass)) { KEY = pass; sessionStorage.setItem(KEYNAME, pass); showApp(); loadAll(); }
      else $("#loginErr").textContent = "Contraseña incorrecta.";
    });
    if (KEY) { showApp(); loadAll(); }

    // Tabs
    $$(".admin-tabs button").forEach(b => b.addEventListener("click", () => {
      $$(".admin-tabs button").forEach(x => x.classList.toggle("active", x === b));
      $("#sec-productos").hidden = b.dataset.tab !== "productos";
      $("#sec-catalogos").hidden = b.dataset.tab !== "catalogos";
    }));

    // Toolbar
    $("#catFilter").addEventListener("change", renderProducts);
    $("#prodSearch").addEventListener("input", renderProducts);
    $("#addProd").addEventListener("click", () => openProd(null));
    $("#seedProd").addEventListener("click", seed);
    $("#addCat").addEventListener("click", openCat);

    // Modales
    $("#f-img").addEventListener("change", onImgPick);
    $("#prodSave").addEventListener("click", saveProd);
    $("#catSave").addEventListener("click", saveCat);
    $("#c-file").addEventListener("change", e => { catFile = e.target.files[0] || null; $("#c-fileState").textContent = catFile ? catFile.name : ""; });
    $$("[data-close]").forEach(el => el.addEventListener("click", closeModals));

    // Top
    $("#saveBtn").addEventListener("click", () => saveContent());
    $("#logout").addEventListener("click", logout);
  });
})();
