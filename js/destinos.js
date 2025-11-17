// Interactividad para Destinos - fundamentos según materiales TW-S11 a TW-S14
// Uso de let/const, prompt, alert, confirm, console.log, DOM (getElementById, querySelector, querySelectorAll),
// eventos (onchange, click), classList.toggle, innerHTML, style, arrays.

(() => {
  'use strict';

  /** Estado simple en memoria */
  const reservas = []; // push() para guardar destinos reservados ficticios
  const state = { region: 'todos', search: '', order: 'none' };

  /** Utilidades DOM */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Se eliminó el saludo/prompt para evitar interrupciones de UX.

  /** Helpers */
  const cardsContainer = () => $('.destinos-grid');
  const getCards = () => $$('.destino-card', cardsContainer());
  const slugh = s => (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const parsePrecio = (text) => {
    // Extrae número de "Desde S/130"
    const m = (text || '').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? parseFloat(m[1]) : Infinity;
  };

  // Mantener orden original para "Sin ordenar"
  let originalOrder = [];

  function updateVisibility() {
    const region = state.region;
    const term = slugh(state.search);
    getCards().forEach(card => {
      const regionCard = card.getAttribute('data-region');
      const text = slugh(card.textContent);
      const matchRegion = region === 'todos' || regionCard === region;
      const matchSearch = term.length === 0 || text.includes(term);
      const visible = matchRegion && matchSearch;
      card.classList.toggle('hidden', !visible);
    });
  }

  /** Filtrado por región usando onchange */
  function setupFiltro() {
    const select = document.getElementById('filtroDestino');
    if (!select) return;
    state.region = select.value;
    select.addEventListener('change', () => {
      state.region = select.value;
      updateVisibility();
      console.log('Filtro región:', state.region);
    });
    updateVisibility();
  }

  /** Buscador por texto */
  function setupBusqueda() {
    const input = document.getElementById('buscarDestino');
    if (!input) return;
    input.addEventListener('input', () => {
      state.search = input.value || '';
      updateVisibility();
      console.log('Búsqueda:', state.search);
    });
  }

  /** Ordenamiento por precio */
  function setupOrden() {
    const select = document.getElementById('ordenarPrecio');
    const container = cardsContainer();
    if (!select || !container) return;

    if (originalOrder.length === 0) {
      originalOrder = getCards();
    }

    const aplicarOrden = () => {
      state.order = select.value; // none | asc | desc
      if (state.order === 'none') {
        originalOrder.forEach(card => container.appendChild(card));
        console.log('Orden: sin ordenar');
        return;
      }
      const cards = getCards().slice();
      cards.sort((a, b) => {
        const pa = parsePrecio($('.destino-precio', a)?.textContent);
        const pb = parsePrecio($('.destino-precio', b)?.textContent);
        return state.order === 'asc' ? pa - pb : pb - pa;
      });
      cards.forEach(card => container.appendChild(card));
      console.log('Orden aplicado:', state.order);
    };

    select.addEventListener('change', aplicarOrden);
  }

  /** Manejo de reservas con confirm() y array.push() */
  function setupReservas() {
    $$('.btn-reservar').forEach(btn => {
      btn.addEventListener('click', () => {
        const destino = btn.getAttribute('data-destino') || 'Destino';
        const ok = confirm(`¿Deseas reservar ahora tu vuelo a ${destino}?`);
        if (ok) {
          reservas.push(destino); // array.push()
          alert(`¡Reserva preliminar a ${destino} registrada!`);
          // Resaltar tarjeta asociada
          const card = btn.closest('.destino-card');
          if (card) {
            card.classList.toggle('seleccionada', true);
            setTimeout(() => card.classList.toggle('seleccionada', false), 1200);
          }
          console.log('Reservas:', reservas);
        } else {
          console.log('Reserva cancelada para', destino);
        }
      });
    });
  }

  /** Favoritos con localStorage */
  const LS_KEY = 'favoritosDestinos';
  const loadFavoritos = () => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  };
  const saveFavoritos = (arr) => localStorage.setItem(LS_KEY, JSON.stringify(arr));

  function setupFavoritos() {
    let favoritos = loadFavoritos();

    const aplicarUI = () => {
      $$('.btn-favorito').forEach(btn => {
        const destino = btn.getAttribute('data-destino');
        const isFav = favoritos.includes(destino);
        btn.classList.toggle('favorito', isFav);
        btn.setAttribute('aria-pressed', String(isFav));
        btn.title = isFav ? 'Quitar de favoritos' : 'Agregar a favoritos';
      });
    };

    aplicarUI();

    $$('.btn-favorito').forEach(btn => {
      btn.addEventListener('click', () => {
        const destino = btn.getAttribute('data-destino');
        if (favoritos.includes(destino)) {
          favoritos = favoritos.filter(d => d !== destino);
        } else {
          favoritos.push(destino);
        }
        saveFavoritos(favoritos);
        aplicarUI();
        console.log('Favoritos:', favoritos);
      });
    });
  }

  /** Modal de detalles */
  function setupModal() {
    const modal = document.getElementById('modalDetalles');
    if (!modal) return;
    const overlay = modal.querySelector('[data-modal-close]');
    const closeBtn = modal.querySelector('.modal__close');
    const img = document.getElementById('modalImagen');
    const titulo = document.getElementById('modalTitulo');
    const desc = document.getElementById('modalDescripcion');
    const precio = document.getElementById('modalPrecio');

    const abrir = (data) => {
      titulo.textContent = data.titulo;
      img.src = data.img;
      img.alt = `Imagen de ${data.titulo}`;
      desc.textContent = data.descripcion;
      precio.textContent = data.precio;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    };
    const cerrar = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    };

    overlay.addEventListener('click', cerrar);
    closeBtn.addEventListener('click', cerrar);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

    // Abrir al hacer click en cualquier tarjeta, excepto si el click fue en una acción (reservar/favorito)
    getCards().forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-reservar') || e.target.closest('.btn-favorito')) return;
        const data = {
          titulo: $('h3', card)?.textContent?.trim() || 'Destino',
          img: $('img', card)?.src,
          descripcion: $('.destino-info p', card)?.textContent?.trim() || '',
          precio: $('.destino-precio', card)?.textContent?.trim() || ''
        };
        abrir(data);
      });
    });
  }

  /** Accesibilidad/teclado: Enter abre detalles */
  function setupAccesibilidad() {
    $$('.destino-card').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          // Simular click de tarjeta para abrir modal
          card.click();
        }
      });
    });
  }

  // Inicio
  document.addEventListener('DOMContentLoaded', () => {
    setupFiltro();
    setupBusqueda();
    setupOrden();
    setupReservas();
    setupFavoritos();
    setupModal();
    setupAccesibilidad();
  });
})();
