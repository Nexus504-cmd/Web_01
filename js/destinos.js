
// --- VARIABLES GLOBALES ---
let reservas = []; // Array para guardar las reservas
let ordenOriginal = []; // Guarda el orden original de las tarjetas
let favoritos = []; // Array de destinos favoritos

// --- FUNCIONES DE FILTRADO Y BÚSQUEDA ---

// Actualiza qué tarjetas se muestran según los filtros activos
function actualizarTarjetas() {
  const filtroRegion = document.getElementById('filtroDestino').value;
  const textoBusqueda = document.getElementById('buscarDestino').value.toLowerCase();
  const tarjetas = document.querySelectorAll('.destino-card');

  tarjetas.forEach(tarjeta => {
    const region = tarjeta.getAttribute('data-region');
    const textoTarjeta = tarjeta.textContent.toLowerCase();

    // Verificar si coincide con el filtro de región
    const coincideRegion = (filtroRegion === 'todos' || region === filtroRegion);

    // Verificar si coincide con la búsqueda
    const coincideBusqueda = (textoBusqueda === '' || textoTarjeta.includes(textoBusqueda));

    // Mostrar u ocultar la tarjeta
    if (coincideRegion && coincideBusqueda) {
      tarjeta.classList.remove('hidden');
    } else {
      tarjeta.classList.add('hidden');
    }
  });
}

// Configura el filtro por región
function configurarFiltro() {
  const selectFiltro = document.getElementById('filtroDestino');

  selectFiltro.addEventListener('change', function () {
    actualizarTarjetas();
    console.log('Filtro aplicado:', this.value);
  });
}

// Configura el buscador de texto
function configurarBuscador() {
  const inputBuscar = document.getElementById('buscarDestino');

  inputBuscar.addEventListener('input', function () {
    actualizarTarjetas();
    console.log('Búsqueda:', this.value);
  });
}

// --- FUNCIONES DE ORDENAMIENTO ---

// Extrae el precio de un texto como "Desde S/130"
function obtenerPrecio(texto) {
  const numero = texto.match(/([0-9]+)/);
  return numero ? parseInt(numero[1]) : 0;
}

// Configura el ordenamiento por precio
function configurarOrdenamiento() {
  const selectOrden = document.getElementById('ordenarPrecio');
  const contenedor = document.querySelector('.destinos-grid');

  // Guardar orden original la primera vez
  if (ordenOriginal.length === 0) {
    ordenOriginal = Array.from(document.querySelectorAll('.destino-card'));
  }

  selectOrden.addEventListener('change', function () {
    const tipoOrden = this.value; // 'none', 'asc' o 'desc'

    // Si es "sin ordenar", restaurar orden original
    if (tipoOrden === 'none') {
      ordenOriginal.forEach(tarjeta => contenedor.appendChild(tarjeta));
      console.log('Orden restaurado');
      return;
    }

    // Obtener todas las tarjetas y ordenarlas
    const tarjetas = Array.from(document.querySelectorAll('.destino-card'));

    tarjetas.sort(function (a, b) {
      const precioA = obtenerPrecio(a.querySelector('.destino-precio').textContent);
      const precioB = obtenerPrecio(b.querySelector('.destino-precio').textContent);

      if (tipoOrden === 'asc') {
        return precioA - precioB; // Menor a mayor
      } else {
        return precioB - precioA; // Mayor a menor
      }
    });

    // Reorganizar las tarjetas en el DOM
    tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
    console.log('Ordenado por precio:', tipoOrden);
  });
}

// --- FUNCIONES DE RESERVAS ---

// Configura los botones de reservar
function configurarReservas() {
  const botonesReservar = document.querySelectorAll('.btn-reservar');

  botonesReservar.forEach(boton => {
    boton.addEventListener('click', function () {
      const destino = this.getAttribute('data-destino');

      // Confirmar con el usuario
      const confirmar = confirm(`¿Deseas reservar tu vuelo a ${destino}?`);

      if (confirmar) {
        reservas.push(destino); // Agregar al array de reservas
        alert(`¡Reserva a ${destino} registrada!`);

        // Resaltar la tarjeta brevemente
        const tarjeta = this.closest('.destino-card');
        tarjeta.classList.add('seleccionada');
        setTimeout(() => tarjeta.classList.remove('seleccionada'), 1200);

        console.log('Reservas actuales:', reservas);
      } else {
        console.log('Reserva cancelada');
      }
    });
  });
}

// --- FUNCIONES DE FAVORITOS ---

// Cargar favoritos desde localStorage
function cargarFavoritos() {
  const guardados = localStorage.getItem('favoritosDestinos');
  return guardados ? JSON.parse(guardados) : [];
}

// Guardar favoritos en localStorage
function guardarFavoritos() {
  localStorage.setItem('favoritosDestinos', JSON.stringify(favoritos));
}

// Actualiza la apariencia de los botones de favoritos
function actualizarBotonesFavoritos() {
  const botonesFavorito = document.querySelectorAll('.btn-favorito');

  botonesFavorito.forEach(boton => {
    const destino = boton.getAttribute('data-destino');
    const esFavorito = favoritos.includes(destino);

    if (esFavorito) {
      boton.classList.add('favorito');
      boton.title = 'Quitar de favoritos';
    } else {
      boton.classList.remove('favorito');
      boton.title = 'Agregar a favoritos';
    }
  });
}

// Configura los botones de favoritos
function configurarFavoritos() {
  favoritos = cargarFavoritos(); // Cargar favoritos guardados
  actualizarBotonesFavoritos();

  const botonesFavorito = document.querySelectorAll('.btn-favorito');

  botonesFavorito.forEach(boton => {
    boton.addEventListener('click', function () {
      const destino = this.getAttribute('data-destino');

      // Agregar o quitar de favoritos
      if (favoritos.includes(destino)) {
        favoritos = favoritos.filter(d => d !== destino); // Quitar
      } else {
        favoritos.push(destino); // Agregar
      }

      guardarFavoritos();
      actualizarBotonesFavoritos();
      console.log('Favoritos:', favoritos);
    });
  });
}

// --- FUNCIONES DEL MODAL ---

// Configura el modal de detalles
function configurarModal() {
  const modal = document.getElementById('modalDetalles');
  const overlay = modal.querySelector('[data-modal-close]');
  const botonCerrar = modal.querySelector('.modal__close');

  // Función para abrir el modal
  function abrirModal(datos) {
    document.getElementById('modalTitulo').textContent = datos.titulo;
    document.getElementById('modalImagen').src = datos.imagen;
    document.getElementById('modalDescripcion').textContent = datos.descripcion;
    document.getElementById('modalPrecio').textContent = datos.precio;

    modal.classList.add('open');
  }

  // Función para cerrar el modal
  function cerrarModal() {
    modal.classList.remove('open');
  }

  // Eventos para cerrar el modal
  overlay.addEventListener('click', cerrarModal);
  botonCerrar.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrarModal();
  });

  // Abrir modal al hacer click en una tarjeta
  const tarjetas = document.querySelectorAll('.destino-card');

  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', function (e) {
      // No abrir si se hizo click en un botón
      if (e.target.closest('.btn-reservar') || e.target.closest('.btn-favorito')) {
        return;
      }

      // Obtener datos de la tarjeta
      const datos = {
        titulo: this.querySelector('h3').textContent,
        imagen: this.querySelector('img').src,
        descripcion: this.querySelector('.destino-info p').textContent,
        precio: this.querySelector('.destino-precio').textContent
      };

      abrirModal(datos);
    });
  });
}

// --- FUNCIONES DE ACCESIBILIDAD ---

// Permite abrir el modal con la tecla Enter
function configurarAccesibilidad() {
  const tarjetas = document.querySelectorAll('.destino-card');

  tarjetas.forEach(tarjeta => {
    tarjeta.setAttribute('tabindex', '0'); // Hacer la tarjeta enfocable

    tarjeta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        this.click(); // Simular click
      }
    });
  });
}

// --- INICIALIZACIÓN ---

// Cuando la página carga, inicializar todas las funcionalidades
document.addEventListener('DOMContentLoaded', function () {
  configurarFiltro();
  configurarBuscador();
  configurarOrdenamiento();
  configurarReservas();
  configurarFavoritos();
  configurarModal();
  configurarAccesibilidad();

  console.log('Sistema de destinos inicializado');
});
