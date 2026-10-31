// admin.js — Panel de administración de Una Montañita (CRUD de productos)
import { supabase, estaConfigurado, BUCKET, SUPABASE_URL } from '../supabaseClient.js';

const $ = (id) => document.getElementById(id);
const CATEGORIAS = { yerba: 'Yerbas', mate: 'Mates', bombilla: 'Bombillas' };
const MAX_LADO = 1600;       // px, lado mayor de la foto subida (no se recorta)
const CALIDAD = 0.85;
const PREFIJO_PUBLICO = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

const estado = { productos: [], filtro: 'todos', editando: null, fotos: [] };

/* ───────── utilidades ───────── */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n) => '$' + Number(n).toLocaleString('es-AR');

function aviso(texto, tipo = 'ok') {
  const el = document.createElement('div');
  el.className = `toast ${tipo}`;
  el.textContent = texto;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), tipo === 'err' ? 6000 : 3000);
}

function ocupado(btn, on, textoOriginal) {
  if (on) {
    btn.dataset.txt = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>' + (textoOriginal ? `<span>${esc(textoOriginal)}</span>` : '');
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.txt || btn.textContent;
  }
}

function confirmar({ titulo, texto, si, peligro }) {
  return new Promise((resolve) => {
    const m = $('modal');
    m.innerHTML = `<div class="modal-box"><h3>${esc(titulo)}</h3><p>${esc(texto)}</p>
      <button class="btn ${peligro ? 'danger' : ''}" data-r="1">${esc(si)}</button>
      <button class="btn secondary" data-r="0">Cancelar</button></div>`;
    m.hidden = false;
    m.onclick = (e) => {
      const b = e.target.closest('[data-r]');
      if (!b && e.target !== m) return;
      m.hidden = true; m.innerHTML = '';
      resolve(b?.dataset.r === '1');
    };
  });
}

function mostrar(vista) {
  for (const id of ['boot', 'view-login', 'view-list']) $(id).hidden = id !== vista;
}

function mensajeError(e) {
  const m = (e?.message || '').toLowerCase();
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.';
  if (m.includes('row-level security') || m.includes('permission')) return 'Sin permiso para hacer esto. Volvé a ingresar.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Sin conexión. Revisá tu internet e intentá de nuevo.';
  return e?.message || 'Ocurrió un error inesperado.';
}

/* ───────── sesión ───────── */
async function esAdmin() {
  const { data, error } = await supabase.rpc('es_admin');
  return !error && data === true;
}

async function entrar() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return mostrar('view-login');
  if (!(await esAdmin())) {
    await supabase.auth.signOut();
    mostrar('view-login');
    aviso('Esta cuenta no tiene permiso para administrar.', 'err');
    return;
  }
  await cargarProductos();
  mostrar('view-list');
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('login-btn');
  ocupado(btn, true, 'Ingresando…');
  const { error } = await supabase.auth.signInWithPassword({
    email: $('login-email').value.trim(),
    password: $('login-pass').value,
  });
  ocupado(btn, false);
  if (error) return aviso(mensajeError(error), 'err');
  $('login-pass').value = '';
  mostrar('boot');
  await entrar();
});

$('logout-btn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  mostrar('view-login');
});

/* ───────── lista ───────── */
async function cargarProductos() {
  const { data, error } = await supabase.from('productos').select('*').order('orden').order('id');
  if (error) { aviso(mensajeError(error), 'err'); return; }
  estado.productos = data;
  pintarLista();
}

function pintarLista() {
  const filtros = [['todos', 'Todos'], ...Object.entries(CATEGORIAS)];
  $('filters').innerHTML = filtros.map(([k, v]) =>
    `<button class="chip ${estado.filtro === k ? 'on' : ''}" data-f="${k}" type="button">${v}</button>`).join('');

  const lista = estado.productos.filter((p) => estado.filtro === 'todos' || p.categoria === estado.filtro);
  $('items').innerHTML = lista.length ? lista.map((p) => `
    <button class="item" data-id="${p.id}" type="button">
      <img class="thumb" src="${esc(p.imagenes?.[0] || '')}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <div class="item-body">
        <div class="item-name">${esc(p.nombre)}</div>
        <div class="item-price">${money(p.precio)}</div>
        <div class="badges">
          <span class="badge cat">${CATEGORIAS[p.categoria] || esc(p.categoria)}</span>
          ${p.stock === 0 ? '<span class="badge out">Sin stock</span>' : ''}
        </div>
      </div>
    </button>`).join('') : '<div class="empty">No hay productos acá todavía.</div>';
}

$('filters').addEventListener('click', (e) => {
  const b = e.target.closest('[data-f]'); if (!b) return;
  estado.filtro = b.dataset.f; pintarLista();
});
$('items').addEventListener('click', (e) => {
  const b = e.target.closest('[data-id]'); if (!b) return;
  abrirEditor(estado.productos.find((p) => p.id === Number(b.dataset.id)));
});
$('new-btn').addEventListener('click', () => abrirEditor(null));

/* ───────── editor ───────── */
function abrirEditor(p) {
  estado.editando = p;
  estado.fotos = (p?.imagenes || []).map((url) => ({ url }));
  $('sheet-title').textContent = p ? 'Editar producto' : 'Nuevo producto';
  $('f-nombre').value = p?.nombre || '';
  $('f-categoria').value = p?.categoria || (estado.filtro !== 'todos' ? estado.filtro : 'yerba');
  $('f-desc').value = p?.descripcion || '';
  $('f-precio').value = p?.precio ?? '';
  $('f-stock').value = p?.stock ?? 99;
  $('delete-btn').hidden = !p;
  pintarFotos();
  $('sheet').hidden = false;
  $('sheet').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function cerrarEditor() {
  estado.fotos.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
  $('sheet').hidden = true;
  document.body.style.overflow = '';
}
$('sheet-back').addEventListener('click', cerrarEditor);

function pintarFotos() {
  $('photos').innerHTML = estado.fotos.map((f, i) => `
    <div class="photo">
      <img src="${esc(f.preview || f.url)}" alt="Foto ${i + 1}">
      <button class="x" type="button" data-del="${i}" aria-label="Quitar foto">&#10005;</button>
      ${i === 0 ? '<button class="main is" type="button" tabindex="-1">Principal</button>'
                : `<button class="main" type="button" data-main="${i}">Hacer principal</button>`}
    </div>`).join('') +
    `<button class="add-photo" type="button" id="add-photo"><b>+</b>Agregar</button>`;
}

$('photos').addEventListener('click', (e) => {
  if (e.target.closest('#add-photo')) return $('f-files').click();
  const del = e.target.closest('[data-del]');
  if (del) {
    const [f] = estado.fotos.splice(Number(del.dataset.del), 1);
    if (f.preview) URL.revokeObjectURL(f.preview);
    return pintarFotos();
  }
  const main = e.target.closest('[data-main]');
  if (main) {
    const [f] = estado.fotos.splice(Number(main.dataset.main), 1);
    estado.fotos.unshift(f);
    pintarFotos();
  }
});

$('f-files').addEventListener('change', (e) => {
  for (const file of e.target.files) {
    if (!file.type.startsWith('image/')) continue;
    estado.fotos.push({ file, preview: URL.createObjectURL(file) });
  }
  e.target.value = '';
  pintarFotos();
});

/* Achica la foto del celular (5–10 MB) a ~300 KB sin recortarla ni cambiarle los colores */
async function comprimir(file) {
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch { bmp = await new Promise((ok, no) => {
    const img = new Image(); img.onload = () => ok(img); img.onerror = no; img.src = URL.createObjectURL(file); }); }
  const w = bmp.width, h = bmp.height;
  const k = Math.min(1, MAX_LADO / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);   // PNG con transparencia → fondo blanco
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', CALIDAD));
  if (!blob) throw new Error('No se pudo procesar una de las fotos.');
  return blob;
}

async function subirFoto(file) {
  const blob = await comprimir(file);
  const ruta = `${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, blob, {
    contentType: 'image/jpeg', cacheControl: '31536000', upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}

const rutaEnBucket = (url) => (url.startsWith(PREFIJO_PUBLICO) ? decodeURIComponent(url.slice(PREFIJO_PUBLICO.length)) : null);

async function borrarDelBucket(urls) {
  const rutas = urls.map(rutaEnBucket).filter(Boolean);
  if (rutas.length) await supabase.storage.from(BUCKET).remove(rutas);
}

$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = $('f-nombre').value.trim();
  const precio = parseInt($('f-precio').value, 10);
  const stock = parseInt($('f-stock').value, 10);
  if (!nombre) return aviso('Falta el nombre.', 'err');
  if (!Number.isFinite(precio) || precio < 0) return aviso('Revisá el precio.', 'err');
  if (!Number.isFinite(stock) || stock < 0) return aviso('Revisá el stock.', 'err');
  if (!estado.fotos.length && !(await confirmar({
    titulo: 'Sin fotos', texto: 'Este producto no tiene ninguna foto. ¿Guardar igual?', si: 'Guardar igual' }))) return;

  const btn = $('save-btn');
  ocupado(btn, true, estado.fotos.some((f) => f.file) ? 'Subiendo fotos…' : 'Guardando…');
  const subidas = [];
  try {
    const urls = [];
    for (const f of estado.fotos) {
      if (f.file) { const u = await subirFoto(f.file); subidas.push(u); urls.push(u); }
      else urls.push(f.url);
    }
    const fila = {
      nombre, categoria: $('f-categoria').value, descripcion: $('f-desc').value.trim(),
      precio, stock, imagenes: urls,
    };
    const previo = estado.editando;
    const { error } = previo
      ? await supabase.from('productos').update(fila).eq('id', previo.id)
      : await supabase.from('productos').insert({ ...fila, orden: Math.max(0, ...estado.productos.map((p) => p.orden)) + 1 });
    if (error) throw error;

    // fotos que quitó de un producto existente: se borran recién cuando el guardado salió bien
    if (previo) await borrarDelBucket(previo.imagenes.filter((u) => !urls.includes(u)));
    aviso(previo ? 'Cambios guardados.' : 'Producto creado.');
    cerrarEditor();
    await cargarProductos();
  } catch (err) {
    await borrarDelBucket(subidas);             // no dejar fotos huérfanas si algo falló
    aviso(mensajeError(err), 'err');
  } finally {
    ocupado(btn, false);
  }
});

$('delete-btn').addEventListener('click', async () => {
  const p = estado.editando; if (!p) return;
  if (!(await confirmar({ titulo: 'Eliminar producto', peligro: true, si: 'Eliminar',
    texto: `Se va a borrar "${p.nombre}" de la página. Esto no se puede deshacer.` }))) return;
  const btn = $('delete-btn');
  ocupado(btn, true, 'Eliminando…');
  const { error } = await supabase.from('productos').delete().eq('id', p.id);
  if (error) { ocupado(btn, false); return aviso(mensajeError(error), 'err'); }
  await borrarDelBucket(p.imagenes || []);
  ocupado(btn, false);
  aviso('Producto eliminado.');
  cerrarEditor();
  await cargarProductos();
});

/* ───────── arranque ───────── */
(async function init() {
  if (!estaConfigurado) {
    document.body.innerHTML = '<p style="padding:30px;font-family:sans-serif">Falta configurar <b>supabaseClient.js</b> (URL y anon key de Supabase).</p>';
    return;
  }
  supabase.auth.onAuthStateChange((evento) => { if (evento === 'SIGNED_OUT') mostrar('view-login'); });
  try { await entrar(); } catch (e) { mostrar('view-login'); aviso(mensajeError(e), 'err'); }
})();
