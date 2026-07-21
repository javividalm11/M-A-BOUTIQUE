/* =============================================================
   M&A BOUTIQUE — Configuración y Catálogo de Productos
   -------------------------------------------------------------
   ► Para EDITAR precios / tallas / productos: modifica este archivo.
   ► Para AGREGAR fotos: coloca la imagen en /assets/img/ y pon la
     ruta en la propiedad "img" del producto. Si no hay imagen,
     se muestra automáticamente un placeholder elegante.
   ============================================================= */

const CONFIG = {
  brand: "M&A Boutique",
  tagline: "Moda premium sobre pedido",
  // Número de WhatsApp en formato internacional SIN "+", espacios ni guiones.
  // México: 52 + 1 + 10 dígitos.  (Si no te llegan los mensajes, prueba con "522871654171")
  whatsapp: "5212871654171",
  whatsappDisplay: "+52 1 287 165 4171",
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  email: "hola@maboutique.mx",
  city: "México",
  // Texto de encabezado del pedido que llega a WhatsApp
  orderHeader: "¡Hola M&A Boutique! 👋 Quiero realizar este pedido:"
};

/* -------------------- CATEGORÍAS -------------------- */
const CATEGORIES = [
  { id: "medusa",    name: "Jeans Medusa",       short: "Jeans MDS",   icon: "👖", desc: "Jeans levanta cola colombianos MDS. Push-up, efecto lipo y control de abdomen." },
  { id: "shein",     name: "Ropa Shein",         short: "Shein",       icon: "🛍️", desc: "Prendas de tendencia por catálogo Shein. Vestidos, conjuntos, blusas y más." },
  { id: "jafra",     name: "Fragancias Jafra",   short: "Jafra",       icon: "🌸", desc: "Perfumería fina Jafra para dama y caballero. Aromas de larga duración." },
  { id: "oriflame",  name: "Fragancias Oriflame",short: "Oriflame",    icon: "✨", desc: "Fragancias Oriflame de origen sueco. Elegancia y sofisticación europea." },
  { id: "zapatos",   name: "Zapatos",            short: "Zapatos",     icon: "👠", desc: "Tacones, plataformas, tenis y botines para completar tu outfit." },
  { id: "accesorios",name: "Accesorios",         short: "Accesorios",  icon: "👜", desc: "Bolsos, lentes, cinturones y joyería para darle el toque final." }
];

/* -------------------- JEANS MEDUSA (MDS) --------------------
   Datos extraídos del catálogo "EXISTENCIAS JULIO 7".
   sizes = tallas disponibles en inventario.
------------------------------------------------------------- */
const MEDUSA = [
  { code: "AM 881",  tipo: "Cargo",      name: "Jean Cargo Denim",       sizes: [7,9],            featured: true },
  { code: "MC 2964", tipo: "Falda",      name: "Falda Short Cargo",      sizes: [9] },
  { code: "AM 906",  tipo: "Falda",      name: "Falda Short Cruzada",    sizes: [7] },
  { code: "AM 879",  tipo: "Recto",      name: "Jean Corte Recto Negro", sizes: [9],              featured: true },
  { code: "AM 904",  tipo: "Capri",      name: "Capri Push-Up",          sizes: [9,11,13,15] },
  { code: "MC 1928", tipo: "Short",      name: "Short Alto Doblez",      sizes: [7,9] },
  { code: "MC 2832", tipo: "Short",      name: "Short Levanta Cola",     sizes: [7,13,15,17] },
  { code: "MC 2830", tipo: "Short",      name: "Short Clásico",          sizes: [7] },
  { code: "MC 2831", tipo: "Short",      name: "Short Bordado",          sizes: [7] },
  { code: "MC 2861", tipo: "Bermuda",    name: "Bermuda Carpintero",     sizes: [11,13,17] },
  { code: "AM 900",  tipo: "Capri",      name: "Capri Cintura Alta",     sizes: [11,13,15,17] },
  { code: "AM 837",  tipo: "Campana",    name: "Semi Campana Oscuro",    sizes: [5] },
  { code: "MC 2731", tipo: "Wide",       name: "Wide Leg Destroyed",     sizes: [5],              featured: true },
  { code: "AM 821",  tipo: "Wide",       name: "Wide Leg Clásico",       sizes: [5] },
  { code: "AM 746",  tipo: "Levanta",    name: "Levanta Pompa Skinny",   sizes: [9],              featured: true },
  { code: "MC 2825", tipo: "Campana",    name: "Semi Campana Claro",     sizes: [5] },
  { code: "MC 2914", tipo: "Americano",  name: "Jean Americano Skinny",  sizes: [9,13,15] },
  { code: "AM 818",  tipo: "Recto",      name: "Corte Recto Cinturón",   sizes: [5] },
  { code: "MC 2856", tipo: "Campana",    name: "Semi Campana Medio",     sizes: [7] },
  { code: "MC 2893", tipo: "Campana",    name: "Semi Campana Bootcut",   sizes: [13] },
  { code: "MC 2885", tipo: "Americano",  name: "Americano Oscuro",       sizes: [9] },
  { code: "MC 2906", tipo: "Campana",    name: "Semi Campana Índigo",    sizes: [9] },
  { code: "MC 2880", tipo: "Wide",       name: "Wide Leg Bordado Flor",  sizes: [5,15] },
  { code: "MC 2965", tipo: "Capri",      name: "Capri Oscuro Botones",   sizes: [11,13,15] },
  { code: "MC 2957", tipo: "Colombiano", name: "Jean Colombiano Cinto",  sizes: [13],             featured: true },
  { code: "AM 959",  tipo: "Control",    name: "Control Abdomen Claro",  sizes: [15] },
  { code: "MC 2971", tipo: "Americano",  name: "Americano Medio",        sizes: [7] },
  { code: "AM 782",  tipo: "Tobillero",  name: "Tobillero Calado",       sizes: [7] },
  { code: "MC 2796", tipo: "Curvy",      name: "Jean Curvy Plus",        sizes: [11,13,15,17,19,21], featured: true },
  { code: "MC 2963", tipo: "Tobillero",  name: "Tobillero Bordado",      sizes: [9] },
  { code: "AM 938",  tipo: "Colombiano", name: "Colombiano Cielo",       sizes: [7,9,11,13,15] },
  { code: "AM 932",  tipo: "Básico",     name: "Jean Básico Cinturón",   sizes: [7,13] },
  { code: "AM 966",  tipo: "Vestir",     name: "Pantalón Tipo Vestir",   sizes: [9] },
  { code: "MC 3005", tipo: "Básico",     name: "Básico Índigo",          sizes: [7,13,15] },
  { code: "MC 2975", tipo: "Campana",    name: "Semi Campana Bordado",   sizes: [11] },
  { code: "AM 973",  tipo: "Wide",       name: "Wide Leg Slim",          sizes: [9] },
  { code: "AM 983",  tipo: "Lipo",       name: "Efecto Lipo Push-Up",    sizes: [9,11],           featured: true },
  { code: "MC 3009", tipo: "Recto",      name: "Corte Recto Camel",      sizes: [11] },
  { code: "AM 937",  tipo: "Capri",      name: "Capri Bolsa Trasera",    sizes: [11] }
];

/* -------------------- OTRAS CATEGORÍAS (sobre pedido) --------------------
   Ejemplos curados. Reemplaza nombres, notas e imágenes por tu inventario real.
------------------------------------------------------------------------- */
const SHEIN = [
  { code: "SH-01", tipo: "Vestidos",  name: "Vestido Midi Satinado",   note: "Tallas XS a XL", featured: true },
  { code: "SH-02", tipo: "Conjuntos", name: "Conjunto Dos Piezas",     note: "Tallas S a XL" },
  { code: "SH-03", tipo: "Blusas",    name: "Blusa Crop Elegante",     note: "Tallas XS a L" },
  { code: "SH-04", tipo: "Sacos",     name: "Blazer Oversize",         note: "Tallas S a XL" },
  { code: "SH-05", tipo: "Faldas",    name: "Falda Denim Cargo",       note: "Tallas XS a XL", featured: true },
  { code: "SH-06", tipo: "Bodys",     name: "Body Manga Larga",        note: "Tallas XS a L" },
  { code: "SH-07", tipo: "Jeans",     name: "Jeans Mom Fit",           note: "Tallas 26 a 34" },
  { code: "SH-08", tipo: "Abrigos",   name: "Chamarra Bomber",         note: "Tallas S a XL" }
];

const JAFRA = [
  { code: "JF-01", tipo: "Dama",     name: "Adoration Eau de Parfum", note: "50 ml · Floral", featured: true },
  { code: "JF-02", tipo: "Dama",     name: "Mystique",                note: "50 ml · Oriental" },
  { code: "JF-03", tipo: "Dama",     name: "Ecstasy",                 note: "50 ml · Frutal floral" },
  { code: "JF-04", tipo: "Caballero",name: "JF9 Legend",              note: "100 ml · Amaderado", featured: true },
  { code: "JF-05", tipo: "Caballero",name: "Dinamik",                 note: "100 ml · Fresco" },
  { code: "JF-06", tipo: "Dama",     name: "Passion",                 note: "50 ml · Dulce" },
  { code: "JF-07", tipo: "Clásico",  name: "Malva Colonia",           note: "200 ml · Clásico" },
  { code: "JF-08", tipo: "Dama",     name: "Eternal",                 note: "50 ml · Elegante" }
];

const ORIFLAME = [
  { code: "OR-01", tipo: "Dama",     name: "Giordani Gold Essenza",   note: "50 ml · Lujo italiano", featured: true },
  { code: "OR-02", tipo: "Dama",     name: "Eclat Femme",             note: "50 ml · Floral chic" },
  { code: "OR-03", tipo: "Dama",     name: "Amber Elixir",            note: "50 ml · Oriental ámbar" },
  { code: "OR-04", tipo: "Dama",     name: "Miss Giordani",           note: "50 ml · Cítrico floral" },
  { code: "OR-05", tipo: "Caballero",name: "Eclat Homme",             note: "75 ml · Amaderado", featured: true },
  { code: "OR-06", tipo: "Dama",     name: "Divine",                  note: "50 ml · Elegante" },
  { code: "OR-07", tipo: "Dama",     name: "Volare",                  note: "50 ml · Rosa clásica" },
  { code: "OR-08", tipo: "Caballero",name: "Possess Man",             note: "75 ml · Intenso" }
];

const ZAPATOS = [
  { code: "ZP-01", tipo: "Tacones",     name: "Tacón Plataforma",     note: "Tallas 22 a 27", featured: true },
  { code: "ZP-02", tipo: "Sandalias",   name: "Sandalia de Tiras",    note: "Tallas 22 a 27" },
  { code: "ZP-03", tipo: "Tenis",       name: "Tenis Casual Blanco",  note: "Tallas 22 a 27", featured: true },
  { code: "ZP-04", tipo: "Botines",     name: "Botín Tacón Ancho",    note: "Tallas 22 a 27" },
  { code: "ZP-05", tipo: "Mules",       name: "Mule Elegante",        note: "Tallas 22 a 27" },
  { code: "ZP-06", tipo: "Zapatillas",  name: "Zapatilla Punta Fina", note: "Tallas 22 a 27" }
];

const ACCESORIOS = [
  { code: "AC-01", tipo: "Bolsos",     name: "Bolso Tote Premium",    note: "Varios colores", featured: true },
  { code: "AC-02", tipo: "Lentes",     name: "Lentes de Sol",         note: "Filtro UV400" },
  { code: "AC-03", tipo: "Cinturones", name: "Cinturón Animal Print", note: "Ajustable" },
  { code: "AC-04", tipo: "Joyería",    name: "Aretes Statement",      note: "Baño de oro" },
  { code: "AC-05", tipo: "Relojes",    name: "Reloj Minimalista",     note: "Acero inoxidable" }
];

/* -------------------- ENSAMBLE FINAL -------------------- */
function buildCatalog() {
  const out = [];
  const push = (arr, cat) => arr.forEach((p, i) => {
    out.push({
      id: `${cat}-${i + 1}`,
      cat,
      code: p.code,
      tipo: p.tipo,
      name: p.name,
      sizes: p.sizes || null,
      note: p.note || null,
      featured: !!p.featured,
      // Sin foto por defecto -> se muestra un placeholder elegante (degradado + código).
      // Para poner una foto real: define la ruta en la propiedad "img" del producto,
      // p.ej. img:"assets/img/products/am881.jpg" (guarda la imagen en esa carpeta).
      img: p.img || null
    });
  });
  push(MEDUSA, "medusa");
  push(SHEIN, "shein");
  push(JAFRA, "jafra");
  push(ORIFLAME, "oriflame");
  push(ZAPATOS, "zapatos");
  push(ACCESORIOS, "accesorios");
  return out;
}

const PRODUCTS = buildCatalog();
