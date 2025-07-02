const resultadoReceta = document.getElementById('receta');

export function getParametroURL(nombre) {
  const url = new URL(window.location.href);
  return url.searchParams.get(nombre);
}

export function seleccionarReceta(id) {
  window.location.href = `receta.html?id=${id}`;
}

export function mostrarNotificacion(mensaje) {
  if (Notification.permission === 'granted') {
    new Notification('Reciper 🍽️', {
      body: mensaje,
      icon: 'icons/icon-192x192.png',
    });
  }
}

document.addEventListener('click', function (e) {
  if (e.target.matches('.bi-eye-fill')) {
    const id = e.target.dataset.id;
    seleccionarReceta(id);
  }

  if (
    e.target.matches('.bi-bookmark') ||
    e.target.matches('.bi-bookmark-fill')
  ) {
    const id = e.target.dataset.id;
    guardarReceta(id, e.target);
  }

  if (e.target.classList.contains('bi-share-fill')) {
    const id = e.target.dataset.id;
    compartirReceta(id);
  }
});

export function guardarReceta(id, icono) {
  const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => guardar(resultado.meals[0], icono));
}

export function guardar(receta, icono) {
  const { idMeal, strMeal, strMealThumb } = receta;
  if (existeStorage(idMeal)) {
    eliminarFavorito(idMeal);
    mostrarToast('Recipe unmarked');

    const tarjeta = icono.closest('.col-12, .col-sm-6, .col-md-4, .col-lg-3');
    if (tarjeta && tarjeta.parentElement.id === 'resultado-favoritos') {
      tarjeta.remove();
    }

    return;
  }
  icono.classList.remove('bi-bookmark');
  icono.classList.add('bi-bookmark-fill');
  agregarFavorito({
    id: idMeal,
    title: strMeal,
    img: strMealThumb,
  });
  mostrarToast('Recipe bookmarked!');
}

export function detalleReceta(receta) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
  const id = receta.idMeal || receta.id;
  const title = receta.strMeal || receta.title;
  const img = receta.strMealThumb || receta.img;
  const instructions = receta.strInstructions;
  const esFavorito = favoritos.some((fav) => fav.id === id.toString());
  const claseBookmark = esFavorito ? 'bi-bookmark-fill' : 'bi-bookmark';
  resultadoReceta.innerHTML = '';

  const rowPrincipal = document.createElement('DIV');
  rowPrincipal.classList.add('row', 'mb-4');

  const divImagen = document.createElement('DIV');
  divImagen.classList.add('col-12', 'col-md-4', 'mb-3');
  divImagen.innerHTML = ` 
    <img src="${img}" alt="Imagen de la receta ${title}" class="img-fluid rounded-3 shadow">
    <button class="boton-instalar fw-medium me-2 bi-share-fill mt-4" type="button">
          Compartir
        </button>
    <button class="boton-instalar fw-medium me-2 mt-4 ${claseBookmark}" data-id="${id}" type="button">
          Guardar
        </button>`;

  const divReceta = document.createElement('DIV');
  divReceta.classList.add('col-12', 'col-md-8');
  divReceta.innerHTML = `
    <h1 class="mb-3">${title}</h1>
    <p class="fw-medium">${instructions}</p>
  `;

  rowPrincipal.appendChild(divImagen);
  rowPrincipal.appendChild(divReceta);

  const wrapperIngredientes = document.createElement('DIV');
  wrapperIngredientes.classList.add('w-75', 'mx-auto');
  const divIngredientes = document.createElement('DIV');
  divIngredientes.classList.add('col-12', 'mt-4');

  let ingredientesHTML =
    '<h3>Ingredients</h3><ul class="list-group list-group-flush mb-3">';

  for (let i = 1; i <= 20; i++) {
    const ingrediente = receta[`strIngredient${i}`];
    const medida = receta[`strMeasure${i}`];

    if (ingrediente && ingrediente.trim() !== '') {
      ingredientesHTML += `<li class="list-group-item fw-medium ">${ingrediente} - ${medida}</li>`;
    }
  }

  ingredientesHTML += '</ul>';
  divIngredientes.innerHTML = ingredientesHTML;

  resultadoReceta.appendChild(rowPrincipal);
  wrapperIngredientes.appendChild(divIngredientes);
  resultadoReceta.appendChild(wrapperIngredientes);
}

function compartirReceta(id) {
  const urlReceta = `receta.html?id=${id}`;
  const titulo = 'Take a look at this recipe!';

  if (navigator.share) {
    navigator
      .share({
        title: titulo,
        url: urlReceta,
      })
      .then(() => {
        mostrarNotificacion('Receta compartida 🍽️');
      })
      .catch((error) => console.error('Error al compartir:', error));
  } else {
    alert(
      'Tu navegador no soporta la función de compartir. Copiá el enlace manualmente: ' +
        urlReceta
    );
  }
}

export function agregarFavorito(receta) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
  receta.id = receta.id.toString();
  localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
}

export function eliminarFavorito(id) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
  const idStr = id.toString();
  const nuevosFavoritos = favoritos.filter((favorito) => favorito.id !== idStr);
  localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
}

export function mostrarToast(mensaje) {
  const toastDiv = document.querySelector('#toast');
  const toastBody = document.querySelector('.toast-body');
  const toast = new bootstrap.Toast(toastDiv);
  toastBody.textContent = mensaje;
  toast.show();
}

export function existeStorage(id) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
  return favoritos.some((favorito) => favorito.id === id.toString());
}
