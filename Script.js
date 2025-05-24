// Variables 
let carrito = [];
let currentSlide = 0;

// Funciones de navegación
function explorarLibros() {
  const seccionNovedades = document.getElementById("novedades");
  if (seccionNovedades) {
    seccionNovedades.scrollIntoView({
      behavior: "smooth",
    });
  }
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


// Funciones del carrito
function agregarAlCarrito(titulo, precio) {
  carrito.push({ titulo, precio: parseFloat(precio) });
  actualizarIconoCarrito();
  renderizarCarrito();
}

function actualizarIconoCarrito() {
  const contador = document.querySelector(".contador-carrito");
  const carritoIcono = document.querySelector(".fa-cart-shopping");
  
  if (contador) contador.textContent = carrito.length;
  if (carritoIcono) carritoIcono.setAttribute("data-count", carrito.length);
}

function renderizarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const totalSpan = document.getElementById("totalCarrito");
  lista.innerHTML = "";

  const total = carrito.reduce((sum, item) => sum + item.precio, 0);
  totalSpan.textContent = `Total: $${total.toFixed(2)}`;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.titulo} - $${item.precio.toFixed(2)}
      <button class="eliminar-item" data-index="${index}">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    lista.appendChild(li);
  });

  document.querySelectorAll(".eliminar-item").forEach(btn => {
    btn.addEventListener("click", (e) => {
      eliminarDelCarrito(parseInt(e.target.closest("button").getAttribute("data-index")));
    });
  });
}

function eliminarDelCarrito(index) {
  if (index >= 0 && index < carrito.length) {
    carrito.splice(index, 1);
    actualizarIconoCarrito();
    renderizarCarrito();
  }
}

// mensaje de agregardo al carrito
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

function mostrarDetalleLibro(titulo, autor, descripcion, imagen, precio) {
  Swal.fire({
    html: `
      <div class="modal-libro">
        <h2>${titulo}</h2>
        <p class="autor">${autor}</p>
        <img src="${imagen}" alt="Portada de ${titulo}" />
        <p class="descripcion">${descripcion}</p>
        <p class="precio">Precio: <span>$${precio.toFixed(2)}</span></p>
        <button id="btnAgregarCarrito">Añadir al carrito</button>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "modal-swal",
    },
    didOpen: () => {
      const btnAgregar = document.getElementById("btnAgregarCarrito");
      btnAgregar.addEventListener("click", () => {
        agregarAlCarrito(titulo, precio);
        Swal.close();
        mostrarToast(`${titulo} añadido al carrito`);
      });
    },
  });
}

// Slider automático
function initSlider() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length > 0) {
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 5000);
  }
}


function setupEventListeners() {
  // Ver más/ver menos categorías
  const verMasBtn = document.getElementById("verMasBtn");
  const verMenosBtn = document.getElementById("verMenosBtn");
  const categoriasExtra = document.getElementById("categoriasExtra");
  const verMasWrapper = document.getElementById("verMasWrapper");
  const verMenosWrapper = document.getElementById("verMenosWrapper");

  if (verMasBtn && verMenosBtn) {
    verMasBtn.addEventListener("click", () => {
      categoriasExtra.style.display = "grid";
      verMasWrapper.style.display = "none";
      verMenosWrapper.style.display = "block";
      if (typeof AOS !== "undefined") AOS.refresh();
    });

    verMenosBtn.addEventListener("click", () => {
      categoriasExtra.style.display = "none";
      verMasWrapper.style.display = "block";
      verMenosWrapper.style.display = "none";
    });
  }

  // Carrito
  const carritoIcon = document.querySelector(".fa-cart-shopping");
  if (carritoIcon) {
    carritoIcon.addEventListener("click", () => {
      document.getElementById("sidebarCarrito").classList.add("abierto");
      renderizarCarrito();
    });
  }

  const cerrarCarrito = document.getElementById("cerrarCarrito");
  if (cerrarCarrito) {
    cerrarCarrito.addEventListener("click", () => {
      document.getElementById("sidebarCarrito").classList.remove("abierto");
    });
  }

  // Botones de productos
  document.querySelectorAll(".lo-mas-vendido .producto button").forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = boton.closest(".producto");
      const titulo = producto.querySelector("h3").textContent;
      const precio = parseFloat(producto.getAttribute("precio"));
      agregarAlCarrito(titulo, precio);
      mostrarToast(`${titulo} añadido al carrito`);
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  setupEventListeners();


  if (typeof Swiper !== "undefined") {
    new Swiper(".swiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
});


