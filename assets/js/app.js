/* =============================================================
   M&A BOUTIQUE — App (carrito, pedido WhatsApp, animaciones)
   Funciona en index.html (destacados) y tienda.html (tienda completa).
   El carrito se comparte entre páginas vía localStorage.
   ============================================================= */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const on = (sel, evt, fn) => { const el = $(sel); if (el) el.addEventListener(evt, fn); };
  const catMeta = id => CATEGORIES.find(c => c.id === id) || {};
  const gradVar = id => `var(--g-${id})`;

  /* ---------- Estado ---------- */
  const STORE_KEY = "ma_boutique_cart_v1";
  let cart = load();
  let filter = { cat: "medusa", tipo: "all", q: "" };
  const selectedSize = {}; // id -> talla elegida

  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; } }
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); }

  /* ---------- Placeholder de imagen ---------- */
  function mediaHTML(p) {
    const mark = p.cat === "medusa" ? p.code.replace(" ", "") : (p.name.split(" ")[0]);
    const img = p.img
      ? `<img class="pcard__img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">`
      : "";
    return `
      <div class="pcard__ph" style="background:${gradVar(p.cat)}">
        <span class="ph-code">${p.cat === "medusa" ? "MDS · " + p.code : catMeta(p.cat).name}</span>
        <div style="text-align:center">
          <div class="ph-mark">${mark}</div>
          <div class="ph-tipo">${p.tipo}</div>
        </div>
        <span style="align-self:flex-end;font-size:.7rem;opacity:.85">M&amp;A Boutique</span>
      </div>${img}`;
  }

  /* ---------- Tarjeta de producto (compartida) ---------- */
  function cardHTML(p, i) {
    const isOrder = p.cat !== "medusa";
    const sizes = p.sizes
      ? `<div class="pcard__sizes" data-sizes="${p.id}">${p.sizes.map(s =>
          `<span class="size-pill ${selectedSize[p.id] === String(s) ? "sel" : ""}" data-size="${s}">${s}</span>`).join("")}</div>`
      : "";
    const meta = p.desc
      ? `<div class="pcard__meta">${p.desc}</div>`
      : (p.note
        ? `<div class="pcard__meta">${p.note}</div>`
        : (p.cat === "medusa" ? `<div class="pcard__meta">Mezclilla premium · ${p.tipo}</div>` : ""));
    return `
      <article class="pcard reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}" data-id="${p.id}">
        <div class="pcard__media">
          ${mediaHTML(p)}
          <span class="pcard__badge ${isOrder ? "order" : ""}">${isOrder ? "Sobre pedido" : "En stock"}</span>
          <button class="pcard__fav" data-fav="${p.id}" aria-label="Favorito">♥</button>
        </div>
        <div class="pcard__body">
          <span class="pcard__cat">${catMeta(p.cat).short}${p.cat === "medusa" ? " · " + p.code : ""}</span>
          <h3 class="pcard__name">${p.name}</h3>
          ${meta}
          ${sizes}
          <div class="pcard__foot">
            <button class="add-btn" data-add="${p.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              Agregar
            </button>
            <button class="wa-mini" data-direct="${p.id}" aria-label="Pedir por WhatsApp" title="Pedir solo este por WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Z"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  function bindCards() {
    $$("[data-size]").forEach(el => el.addEventListener("click", () => {
      const wrap = el.closest("[data-sizes]");
      const id = wrap.dataset.sizes;
      selectedSize[id] = el.dataset.size;
      $$(".size-pill", wrap).forEach(s => s.classList.toggle("sel", s === el));
    }));
    $$("[data-add]").forEach(b => b.addEventListener("click", () => addToCart(b.dataset.add, b)));
    $$("[data-direct]").forEach(b => b.addEventListener("click", () => directOrder(b.dataset.direct)));
    $$("[data-fav]").forEach(b => b.addEventListener("click", () => b.classList.toggle("on")));
  }

  /* ---------- Categorías ---------- */
  function renderCats() {
    $("#catsGrid").innerHTML = CATEGORIES.map((c, i) => `
      <article class="cat-card reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}" data-gocat="${c.id}">
        <div class="cat-card__bg" style="background:${gradVar(c.id)}"></div>
        <div class="cat-card__icon">${c.icon}</div>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <span class="cat-go">Ver productos
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </span>
      </article>`).join("");
    $$("[data-gocat]").forEach(el => el.addEventListener("click", () => goToShop(el.dataset.gocat)));
  }

  /* ---------- Destacados (index) ---------- */
  function getFeatured(limit) {
    const byCat = {};
    PRODUCTS.filter(p => p.featured).forEach(p => { (byCat[p.cat] = byCat[p.cat] || []).push(p); });
    const cats = Object.keys(byCat), out = [];
    let i = 0;
    while (out.length < limit && cats.some(c => byCat[c].length)) {
      const c = cats[i % cats.length];
      if (byCat[c].length) out.push(byCat[c].shift());
      i++;
    }
    return out;
  }
  function renderFeatured() {
    const list = getFeatured(8);
    $("#featuredGrid").innerHTML = list.map((p, i) => cardHTML(p, i)).join("");
    bindCards();
    observeReveal($$("#featuredGrid .reveal"));
  }

  /* ---------- Tabs / subfiltros / grid (tienda.html) ---------- */
  function renderTabs() {
    $("#tabs").innerHTML = CATEGORIES.map(c =>
      `<button class="tab ${c.id === filter.cat ? "active" : ""}" data-cat="${c.id}">${c.icon} ${c.short}</button>`
    ).join("");
    $$("#tabs .tab").forEach(t => t.addEventListener("click", () => setCat(t.dataset.cat)));
  }
  function setCat(id) {
    filter.cat = id; filter.tipo = "all";
    $$("#tabs .tab").forEach(t => t.classList.toggle("active", t.dataset.cat === id));
    renderGrid();
  }
  function renderSubfilters() {
    if (!$("#subfilters")) return;
    const tipos = ["all", ...new Set(PRODUCTS.filter(p => p.cat === filter.cat).map(p => p.tipo))];
    $("#subfilters").innerHTML = tipos.map(t =>
      `<button class="chip ${t === filter.tipo ? "active" : ""}" data-tipo="${t}">${t === "all" ? "Todos" : t}</button>`
    ).join("");
    $$("#subfilters .chip").forEach(c => c.addEventListener("click", () => {
      filter.tipo = c.dataset.tipo;
      $$("#subfilters .chip").forEach(x => x.classList.toggle("active", x === c));
      renderGrid();
    }));
  }
  function renderGrid() {
    const q = filter.q.trim().toLowerCase();
    const list = PRODUCTS.filter(p =>
      p.cat === filter.cat &&
      (filter.tipo === "all" || p.tipo === filter.tipo) &&
      (!q || (p.name + " " + p.code + " " + p.tipo).toLowerCase().includes(q))
    );
    if (!list.length) {
      $("#grid").innerHTML = `<div class="empty"><b>Sin resultados</b>Prueba con otra búsqueda o categoría.</div>`;
      return;
    }
    $("#grid").innerHTML = list.map((p, i) => cardHTML(p, i)).join("");
    bindCards();
    observeReveal($$("#grid .reveal"));
  }

  /* ---------- Navegación a la tienda ---------- */
  function goToShop(cat) {
    if ($("#grid")) { // estamos en tienda.html
      setCat(cat);
      const sec = $("#tienda"); if (sec) sec.scrollIntoView({ behavior: "smooth" });
    } else { // estamos en index.html -> ir a la tienda con la categoría
      window.location.href = `tienda.html?cat=${encodeURIComponent(cat)}`;
    }
  }

  /* ---------- Carrito ---------- */
  function addToCart(id, btn) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const size = selectedSize[id] || null;
    if (p.sizes && p.sizes.length && !size) {
      toast("Elige una talla primero ☝️", false);
      const wrap = $(`[data-sizes="${id}"]`);
      if (wrap) { wrap.style.transition = "transform .2s"; wrap.style.transform = "scale(1.06)"; setTimeout(() => wrap.style.transform = "", 220); }
      return;
    }
    const key = id + "|" + (size || "");
    const found = cart.find(c => c.key === key);
    if (found) found.qty++;
    else cart.push({ key, id, size, qty: 1 });
    save(); refreshCart();

    if (btn) {
      const original = btn.innerHTML;
      btn.classList.add("added");
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg> Agregado`;
      setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = original; }, 1300);
    }
    bumpCount();
    toast(`${p.name}${size ? " · Talla " + size : ""} agregado`);
  }

  function refreshCart() {
    const totalQty = cart.reduce((a, c) => a + c.qty, 0);
    const cc = $("#cartCount");
    if (cc) { cc.textContent = totalQty; cc.classList.toggle("show", totalQty > 0); }
    const dc = $("#drawerCount"); if (dc) dc.textContent = `${totalQty} ${totalQty === 1 ? "artículo" : "artículos"}`;
    const ti = $("#totalItems"); if (ti) ti.textContent = totalQty;
    renderDrawer();
  }
  function bumpCount() {
    const cc = $("#cartCount"); if (!cc) return;
    cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
  }

  function renderDrawer() {
    const box = $("#drawerItems"); if (!box) return;
    if (!cart.length) {
      box.innerHTML = `<div class="drawer__empty"><div class="big">🛍️</div><b style="font-family:var(--font-display);font-size:1.2rem">Tu pedido está vacío</b><p style="color:var(--muted);margin-top:6px">Agrega productos para comenzar.</p></div>`;
      const f = $("#drawerFoot"); if (f) f.style.display = "none";
      return;
    }
    const f = $("#drawerFoot"); if (f) f.style.display = "block";
    box.innerHTML = cart.map(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return "";
      const mark = p.cat === "medusa" ? p.code.replace(" ", "") : catMeta(p.cat).icon;
      return `
      <div class="citem" data-key="${item.key}">
        <div class="citem__media" style="background:${gradVar(p.cat)}">
          ${p.img ? `<img src="${p.img}" alt="" onerror="this.remove()">` : ""}${mark}
        </div>
        <div class="citem__info">
          <span class="c-cat">${catMeta(p.cat).short}</span>
          <b>${p.name}</b>
          <div class="c-size">${p.cat === "medusa" ? p.code + " · " : ""}${item.size ? "Talla " + item.size : (p.note || "Sobre pedido")}</div>
          <div class="citem__ctrl">
            <div class="qty">
              <button data-dec="${item.key}">−</button>
              <span>${item.qty}</span>
              <button data-inc="${item.key}">+</button>
            </div>
            <button class="citem__rm" data-rm="${item.key}">Quitar</button>
          </div>
        </div>
      </div>`;
    }).join("");
    $$("[data-inc]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.inc, 1)));
    $$("[data-dec]").forEach(b => b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
    $$("[data-rm]").forEach(b => b.addEventListener("click", () => removeItem(b.dataset.rm)));
  }

  function changeQty(key, d) {
    const it = cart.find(c => c.key === key);
    if (!it) return;
    it.qty += d;
    if (it.qty <= 0) cart = cart.filter(c => c.key !== key);
    save(); refreshCart();
  }
  function removeItem(key) { cart = cart.filter(c => c.key !== key); save(); refreshCart(); }

  /* ---------- Mensaje de WhatsApp ---------- */
  function buildOrderText() {
    let t = CONFIG.orderHeader + "\n\n🛍️ *MI PEDIDO*\n";
    let n = 1;
    cart.forEach(item => {
      const p = PRODUCTS.find(x => x.id === item.id);
      if (!p) return;
      t += `\n${n}. *${p.name}*`;
      if (p.cat === "medusa") t += ` (MDS ${p.code})`;
      t += `\n   • Categoría: ${catMeta(p.cat).name}`;
      if (item.size) t += `\n   • Talla: ${item.size}`;
      else if (p.note) t += `\n   • ${p.note}`;
      t += `\n   • Cantidad: ${item.qty}\n`;
      n++;
    });
    const total = cart.reduce((a, c) => a + c.qty, 0);
    t += `\n📦 *Total de artículos:* ${total}\n\nPor favor confírmenme *precio total, disponibilidad y envío*. ¡Gracias! 💛`;
    return t;
  }
  function waLink(text) { return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`; }

  function checkout() {
    if (!cart.length) { toast("Tu pedido está vacío 🛍️", false); return; }
    window.open(waLink(buildOrderText()), "_blank");
  }
  function directOrder(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const size = selectedSize[id];
    let t = CONFIG.orderHeader + `\n\n🛍️ *${p.name}*`;
    if (p.cat === "medusa") t += ` (MDS ${p.code})`;
    t += `\n   • Categoría: ${catMeta(p.cat).name}`;
    if (size) t += `\n   • Talla: ${size}`;
    else if (p.note) t += `\n   • ${p.note}`;
    t += `\n\n¿Me confirman *precio y disponibilidad*? 💛`;
    window.open(waLink(t), "_blank");
  }
  function contactWa() {
    window.open(waLink("¡Hola M&A Boutique! 👋 Me gustaría más información, por favor."), "_blank");
  }

  /* ---------- Drawer ---------- */
  function openDrawer() { $("#drawer").classList.add("show"); $("#overlay").classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { $("#drawer").classList.remove("show"); $("#overlay").classList.remove("show"); document.body.style.overflow = ""; }

  /* ---------- Toast ---------- */
  function toast(msg, ok = true) {
    const wrap = $("#toastWrap"); if (!wrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="t-ic" style="${ok ? "" : "background:var(--rose-2);color:#fff"}">${ok ? "✓" : "!"}</span>${msg}`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 2400);
  }

  /* ---------- FAQ ---------- */
  const FAQS = [
    { q: "¿Cómo hago mi pedido?", a: "Muy fácil: elige tus productos y tallas, agrégalos a tu pedido con el botón «Agregar» y presiona «Finalizar pedido por WhatsApp». Tu pedido llega listo a nuestro chat y solo confirmamos precio y disponibilidad contigo." },
    { q: "¿Por qué es sobre pedido?", a: "Trabajamos por pedido para conseguirte los mejores precios y garantizar producto original de Medusa, Shein, Jafra y Oriflame, además de zapatos y accesorios seleccionados." },
    { q: "¿Cuánto tarda mi pedido?", a: "El tiempo depende de la categoría y tu ubicación. Al confirmar tu pedido por WhatsApp te damos el tiempo estimado de surtido y envío." },
    { q: "¿Hacen envíos a todo México?", a: "Sí. Enviamos a todo el país por paquetería. El costo se calcula según tu código postal y se confirma antes de pagar." },
    { q: "¿Cómo pago?", a: "Aceptamos transferencia, depósito y otros métodos que te compartimos por WhatsApp al confirmar tu pedido." },
    { q: "¿Las tallas de los jeans Medusa son mexicanas?", a: "Sí, las tallas mostradas (5, 7, 9, 11, 13, 15, 17, 21) corresponden al tallaje colombiano/mexicano de los jeans MDS. Si tienes dudas de talla, con gusto te asesoramos." }
  ];
  function renderFAQ() {
    $("#faq").innerHTML = FAQS.map((f, i) => `
      <div class="faq-item reveal ${i % 2 ? "d1" : ""}">
        <button class="faq-q" aria-expanded="false"><span>${f.q}</span><span class="plus"></span></button>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>`).join("");
    $$(".faq-q").forEach(q => q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const open = item.classList.contains("open");
      $$(".faq-item").forEach(it => { it.classList.remove("open"); $(".faq-a", it).style.maxHeight = null; $(".faq-q", it).setAttribute("aria-expanded", "false"); });
      if (!open) { item.classList.add("open"); $(".faq-a", item).style.maxHeight = $(".faq-a", item).scrollHeight + "px"; q.setAttribute("aria-expanded", "true"); }
    }));
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveal(nodes) {
    if (!("IntersectionObserver" in window)) { nodes.forEach(n => n.classList.add("in")); return; }
    if (!io) io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach(n => io.observe(n));
  }

  /* ---------- Contador animado ---------- */
  function countUp() {
    $$("[data-count]").forEach(el => {
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 28);
    });
  }

  /* ---------- Header scroll ---------- */
  function onScroll() {
    const y = window.scrollY;
    const h = $("#header"); if (h) h.classList.toggle("scrolled", y > 40);
    const tt = $("#toTop"); if (tt) tt.classList.toggle("show", y > 600);
  }

  /* ---------- Tilt 3D ---------- */
  function enableTilt() {
    document.addEventListener("mousemove", e => {
      const card = e.target.closest && e.target.closest(".pcard");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-4px)`;
    });
    document.addEventListener("mouseout", e => {
      const card = e.target.closest && e.target.closest(".pcard");
      if (card) card.style.transform = "";
    });
  }

  /* ---------- Música de fondo ---------- */
  function initMusic() {
    const audio = $("#bgMusic"), btn = $("#musicBtn");
    if (!audio || !btn) return;
    const KEY = "ma_music";
    audio.volume = 0.35;
    // Gestos que el navegador SÍ acepta para desbloquear el audio (no incluye scroll).
    const ACT = ["pointerdown", "keydown", "touchstart"];
    let unlocked = false;
    const removeKick = () => ACT.forEach(e => document.removeEventListener(e, kick, true));
    function kick(e) {
      if (unlocked) return;
      if (e && e.target && e.target.closest && e.target.closest("#musicBtn")) return; // el botón se maneja aparte
      if (localStorage.getItem(KEY) !== "off") audio.play().catch(() => {});
    }
    audio.addEventListener("play", () => {
      btn.classList.add("playing"); btn.classList.remove("hint");
      btn.setAttribute("aria-label", "Pausar música");
      unlocked = true; removeKick();
    });
    audio.addEventListener("pause", () => {
      btn.classList.remove("playing"); btn.setAttribute("aria-label", "Reproducir música");
    });
    btn.addEventListener("click", () => {
      unlocked = true;
      if (audio.paused) { localStorage.setItem(KEY, "on"); audio.play().catch(() => {}); }
      else { localStorage.setItem(KEY, "off"); audio.pause(); }
    });
    // Si el usuario no la apagó antes: intenta reproducir al cargar; si el navegador
    // lo bloquea, arranca en el primer clic/toque/tecla en cualquier parte de la página.
    if (localStorage.getItem(KEY) !== "off") {
      audio.play().catch(() => {
        btn.classList.add("hint");
        ACT.forEach(e => document.addEventListener(e, kick, true));
      });
    }
  }

  /* ---------- Contenido dinámico (panel /admin) ---------- */
  async function loadContent() {
    try {
      const r = await fetch("/api/content", { cache: "no-store" });
      if (!r.ok) return;
      const c = await r.json();
      if (c && Array.isArray(c.products) && c.products.length) PRODUCTS = c.products.map(normalizeProduct);
      if (c && Array.isArray(c.catalogs)) CATALOGS = c.catalogs;
    } catch (e) { /* sin API disponible: usa el catálogo incluido */ }
  }
  function normalizeProduct(p) {
    return {
      id: p.id || ("p" + Math.random().toString(36).slice(2)),
      cat: p.cat || "medusa", code: p.code || "", tipo: p.tipo || "",
      name: p.name || "Producto", desc: p.desc || null,
      sizes: Array.isArray(p.sizes) && p.sizes.length ? p.sizes : null,
      note: p.note || null, featured: !!p.featured, img: p.img || null
    };
  }
  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])); }

  /* ---------- Catálogos PDF ---------- */
  function renderCatalogs() {
    const sec = $("#catalogos"), grid = $("#catalogsGrid");
    if (!grid) return;
    if (!CATALOGS.length) { if (sec) sec.style.display = "none"; return; }
    if (sec) sec.style.display = "";
    grid.innerHTML = CATALOGS.map((c, i) => `
      <article class="cat-pdf reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}">
        <div class="cat-pdf__ic">📕</div>
        <div class="cat-pdf__body">
          <h3>${escapeHTML(c.title || "Catálogo")}</h3>
          <span>Documento PDF</span>
        </div>
        <button class="btn btn-gold btn-sm" data-pdf="${encodeURI(c.url || "")}">Ver catálogo</button>
      </article>`).join("");
    $$("[data-pdf]", grid).forEach(b => b.addEventListener("click", () => openPdf(b.dataset.pdf)));
    observeReveal($$("#catalogsGrid .reveal"));
  }
  function openPdf(url) {
    if (!url) return;
    const ov = $("#pdfModal");
    if (!ov) { window.open(url, "_blank"); return; }
    $("#pdfFrame").src = url; $("#pdfOpen").href = url;
    ov.classList.add("show"); document.body.style.overflow = "hidden";
  }
  function closePdf() {
    const ov = $("#pdfModal"); if (!ov) return;
    ov.classList.remove("show"); $("#pdfFrame").src = "about:blank"; document.body.style.overflow = "";
  }

  /* ---------- Init ---------- */
  async function init() {
    await loadContent();
    const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

    if ($("#catsGrid")) renderCats();
    if ($("#faq")) renderFAQ();
    if ($("#featuredGrid")) renderFeatured();
    if ($("#catalogsGrid")) renderCatalogs();

    if ($("#grid")) { // Página de tienda
      const c = new URLSearchParams(window.location.search).get("cat");
      if (c && CATEGORIES.some(x => x.id === c)) filter.cat = c;
      renderTabs(); renderGrid();
      on("#search", "input", e => { filter.q = e.target.value; renderGrid(); });
    }

    refreshCart();

    // Carrito / drawer
    on("#openCart", "click", openDrawer);
    on("#closeCart", "click", closeDrawer);
    on("#overlay", "click", closeDrawer);
    on("#checkout", "click", checkout);

    // WhatsApp
    ["#waBtn", "#ctaWa", "#waFoot", "#waHelp", "#waFootBtn"].forEach(sel =>
      on(sel, "click", e => { e.preventDefault(); contactWa(); }));
    on("#waBubbleClose", "click", () => $("#waBubble").classList.remove("show"));
    if ($("#waBubble")) setTimeout(() => $("#waBubble").classList.add("show"), 3500);

    // Footer -> categoría
    const footer = $(".footer");
    if (footer) $$("[data-cat]", footer).forEach(a => a.addEventListener("click", e => {
      e.preventDefault(); goToShop(a.dataset.cat);
    }));

    // Menú móvil
    on("#burger", "click", () => $("#mobileMenu").classList.add("show"));
    on("#mmClose", "click", () => $("#mobileMenu").classList.remove("show"));
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => $("#mobileMenu").classList.remove("show")));

    on("#toTop", "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    on("#pdfClose", "click", closePdf);
    on("#pdfModalBg", "click", closePdf);

    initMusic();

    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    observeReveal($$(".reveal"));
    setTimeout(countUp, 400);

    if (window.matchMedia("(pointer:fine)").matches) enableTilt();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
