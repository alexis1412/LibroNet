const botones = document.querySelectorAll(".filtro");
const libros = Array.from(document.querySelectorAll(".libro"));
const inputBusqueda = document.getElementById("inputBusqueda");
const mensajeNoEncontrado = document.getElementById("mensajeNoEncontrado");
const paginacionContenedor = document.getElementById("paginacion");

let categoriaSeleccionada = "todos";
let paginaActual = 1;
const librosPorPagina = 9;
let carrito = [];

// Leer categoría desde la URL (solo una vez)
const params = new URLSearchParams(window.location.search);
const categoriaURL = params.get("categoria");
if (categoriaURL) {
  categoriaSeleccionada = categoriaURL;
  botones.forEach((boton) => {
    boton.classList.toggle("activo", boton.dataset.categoria === categoriaSeleccionada);
  });
}



function abrirLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
  mostrarFormulario('login'); 
}

function cerrarLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function mostrarFormulario(tipo) {
  const loginForm = document.getElementById('formularioLogin');
  const registroForm = document.getElementById('formularioRegistro');

  if (tipo === 'login') {
    loginForm.style.display = 'block';
    registroForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    registroForm.style.display = 'block';
  }
}

// Cerrar el modal si se hace clic fuera
window.addEventListener('click', function (e) {
  const modal = document.getElementById('loginModal');
  if (e.target === modal) {
    cerrarLoginModal();
  }
});



botones.forEach((btn) => {
  btn.addEventListener("click", () => {
    botones.forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    categoriaSeleccionada = btn.dataset.categoria;
    paginaActual = 1;
    filtrarYMostrarLibros();
  });
});

inputBusqueda.addEventListener("input", () => {
  paginaActual = 1;
  filtrarYMostrarLibros();
});

function filtrarYMostrarLibros() {
  const termino = inputBusqueda.value.toLowerCase();

  const librosFiltrados = libros.filter((libro) => {
    const titulo = libro.querySelector("h3").textContent.toLowerCase();
    const categoria = libro.dataset.categoria;
    const coincideCategoria = categoriaSeleccionada === "todos" || categoria === categoriaSeleccionada;
    const coincideBusqueda = titulo.includes(termino);
    return coincideCategoria && coincideBusqueda;
  });

  if (librosFiltrados.length === 0) {
    mensajeNoEncontrado.style.display = "block";
    paginacionContenedor.innerHTML = "";
    libros.forEach((libro) => (libro.style.display = "none"));
    return;
  } else {
    mensajeNoEncontrado.style.display = "none";
  }

  const totalPaginas = Math.ceil(librosFiltrados.length / librosPorPagina);
  paginaActual = Math.min(paginaActual, totalPaginas);

  libros.forEach((libro) => (libro.style.display = "none"));
  const inicio = (paginaActual - 1) * librosPorPagina;
  const fin = inicio + librosPorPagina;
  librosFiltrados.slice(inicio, fin).forEach((libro) => {
    libro.style.display = "grid";
  });

  renderizarPaginacion(totalPaginas);
}

function renderizarPaginacion(totalPaginas) {
  paginacionContenedor.innerHTML = "";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "Anterior";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      filtrarYMostrarLibros();
    }
  });
  paginacionContenedor.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btnPagina = document.createElement("button");
    btnPagina.textContent = i;
    if (i === paginaActual) btnPagina.classList.add("activo");
    btnPagina.addEventListener("click", () => {
      paginaActual = i;
      filtrarYMostrarLibros();
    });
    paginacionContenedor.appendChild(btnPagina);
  }

  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "Siguiente";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      filtrarYMostrarLibros();
    }
  });
  paginacionContenedor.appendChild(btnSiguiente);
}

libros.forEach((libro) => {
  libro.addEventListener("click", () => {
    const titulo = libro.getAttribute("data-titulo");
    const autor = libro.getAttribute("data-autor");
    const categoria = libro.getAttribute("data-categoria");
    const descripcion = libro.getAttribute("data-descripcion");
    const precio = libro.getAttribute("data-precio");
    const imagen = libro.getAttribute("data-imagen");

   Swal.fire({
  html: `
    <div class="modal-libro">
      <img src="${imagen}" alt="${titulo}" class="modal-img"/>
      <div class="modal-info">
        <h2 class="modal-titulo">${titulo}</h2>
        <p class="modal-autor">de <em>${autor}</em></p>
        <p class="modal-categoria"><strong>Categoría:</strong> ${categoria}</p>
        <p class="modal-descripcion">${descripcion}</p>
        <p class="modal-precio">Precio: <span>$${precio}</span></p>
        <button id="btnAgregarCarrito">Añadir al carrito</button>
      </div>
    </div>
  `,
  showCloseButton: true,
  showConfirmButton: false,
  customClass: {
    popup: "modal-swal",
  },
  didOpen: () => {
    const btn = document.getElementById("btnAgregarCarrito");
    btn.addEventListener("click", () => {
      agregarAlCarrito(titulo, precio);
      Swal.close();
      mostrarToast(`${titulo} añadido al carrito`);
    });
  }
});

  });
});


function agregarAlCarrito(titulo, precio) {
  carrito.push({ titulo, precio: parseFloat(precio) });
  actualizarIconoCarrito();
  renderizarCarrito();
}

function mostrarToast(mensaje) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
  });
}

function actualizarIconoCarrito() {
  const contador = document.querySelector(".contador-carrito");
  if (contador) contador.textContent = carrito.length;

  const carritoIcono = document.querySelector(".fa-cart-shopping");
  if (carritoIcono) carritoIcono.setAttribute("data-count", carrito.length);
}

function renderizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("totalCarrito");
  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.titulo} - $${item.precio.toFixed(2)}
      <button class="eliminar-item" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    lista.appendChild(li);
    total += item.precio;
  });

  totalSpan.textContent = `Total: $${total.toFixed(2)}`;

  lista.querySelectorAll(".eliminar-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(btn.getAttribute("data-index"));
      eliminarDelCarrito(index);
    });
  });
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarIconoCarrito();
  renderizarCarrito();
}

document.querySelector(".fa-cart-shopping").addEventListener("click", () => {
  document.getElementById("sidebarCarrito").classList.add("abierto");
  renderizarCarrito();
});

document.getElementById("cerrarCarrito").addEventListener("click", () => {
  document.getElementById("sidebarCarrito").classList.remove("abierto");
});

document.addEventListener("DOMContentLoaded", () => {
  const botonesDestacados = document.querySelectorAll(".lo-mas-vendido .producto button");

  botonesDestacados.forEach((boton) => {
    boton.addEventListener("click", () => {
      const producto = boton.closest(".producto");
      const titulo = producto.querySelector("h3").textContent;
      const precio = parseFloat(producto.getAttribute("precio"));

      agregarAlCarrito(titulo, precio);
      mostrarToast(`${titulo} añadido al carrito`);
    });
  });
});

filtrarYMostrarLibros();
