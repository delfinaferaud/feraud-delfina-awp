import { mostrarNotificacion } from "./utils.js";
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;

  const installBtn = document.getElementById('installBtn');
  installBtn.hidden = false;

  installBtn.addEventListener('click', () => {
    installBtn.hidden = true;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó la instalación');
      } else {
        console.log('El usuario canceló la instalación');
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('DOMContentLoaded', function () {
    if ('Notification' in window) {
  if (Notification.permission === 'default') {
    Notification.requestPermission().then((permiso) => {
      if (permiso === 'granted') {
        mostrarNotificacion('Gracias por activar las notificaciones 🎉');
      }
    });
  } 
}
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then((respuesta) =>
        console.log('sw registrado correctamente', respuesta)
      )
      .catch((error) => console.log('sw no se pudo registrar', error));
  }

  const resultado = document.querySelector('#resultado');
  const searchBar = document.getElementById('searchBar');

  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => mostrarCategorias(resultado.categories));

  function mostrarCategorias(categorias = []) {
    categorias.forEach((categoria) => {
      const { strCategory, strCategoryThumb } = categoria;

      const categoriaContenedor = document.createElement('DIV');
      categoriaContenedor.classList.add(
        'col-12',
        'col-sm-6',
        'col-md-4',
        'col-lg-3',
        'mb-4'
      );

      categoriaContenedor.innerHTML = `
      <div class="card position-relative rounded-3">
        <img 
          src="${strCategoryThumb ?? categoria.img ?? categoria.title}" 
          alt="Imagen de la categoria ${strCategory}" 
          class="card-img-top"
          style="object-fit: cover"
        >

        <div class="barra-superior" style="cursor: pointer;">
        <p class="titulo-cat">${strCategory}</p>
        </div>
      </div>
    `;

      const categoriaButton =
        categoriaContenedor.querySelector('.barra-superior');
      categoriaButton.onclick = () => {
        location.href = `categoria-recetas.html?c=${strCategory}`;
      };

      resultado.appendChild(categoriaContenedor);
    });
  }

  if (searchBar) {
    searchBar.addEventListener('keyup', function (e) {
      const termino = e.target.value.toLowerCase().trim();
      const tarjetas = document.querySelectorAll('.card');

      tarjetas.forEach((tarjeta) => {
        const titulo = tarjeta
          .querySelector('.titulo-cat')
          .textContent.toLowerCase();

        if (titulo.includes(termino)) {
          tarjeta.parentElement.style.display = '';
        } else {
          tarjeta.parentElement.style.display = 'none';
        }
      });
    });
  }
});

