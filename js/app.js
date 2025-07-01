import { getParametroURL, btnFav, limpiarHTML } from './utils.js';
import { seleccionarReceta } from './receta.js';

window.addEventListener('DOMContentLoaded', function () {
  let categoryId = getParametroURL('c');

  const resultadoRecetas = document.querySelector('#resultado-recetas');

  const favoritosDiv = document.querySelector('.favoritos');
  if (favoritosDiv) {
    obtenerFavoritos();
  }

  if (categoryId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`)
      .then((respuesta) => respuesta.json())
      .then((resultado) => {
        mostrarRecetas(resultado.meals, categoryId);
      });
  }

  function mostrarRecetas(recetas = [], categoria) {
    limpiarHTML(resultadoRecetas);

    const heading = document.createElement('H2');
    heading.classList.add('text-center', 'text-black');
    heading.textContent = `${categoria} recipes`;

    resultadoRecetas.appendChild(heading);

    recetas.forEach((receta) => {
      const id = receta.idMeal || receta.id;
      const title = receta.strMeal || receta.title;
      const img = receta.strMealThumb || receta.img;

      const recetaContenedor = document.createElement('DIV');
      recetaContenedor.classList.add('col-md-4');

      const recetaCard = document.createElement('DIV');
      recetaCard.classList.add('card', 'mb-4');

      const recetaImagen = document.createElement('IMG');
      recetaImagen.classList.add('card-img-top');
      recetaImagen.alt = `Imagen de la receta ${title}`;
      recetaImagen.src = img;

      const recetaCardBody = document.createElement('DIV');
      recetaCardBody.classList.add('card-body');

      const recetaHeading = document.createElement('H3');
      recetaHeading.classList.add('card-title', 'mb-3');
      recetaHeading.textContent = title;

      const divButtons = document.createElement('DIV');
      divButtons.classList.add('row');

      const recetaButton = document.createElement('BUTTON');
      recetaButton.classList.add('btn', 'btn-primary', 'col', 'mx-1');
      recetaButton.textContent = 'See recipe';
      recetaButton.onclick = function () {
        seleccionarReceta(id);
      };

      recetaCardBody.appendChild(recetaHeading);
      divButtons.appendChild(recetaButton);
      divButtons.appendChild(
        btnFav(id, title, img, obtenerFavoritos)
      );
      recetaCardBody.appendChild(divButtons);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);

      resultadoRecetas.appendChild(recetaContenedor);
    });
  }

  function obtenerFavoritos() {
    const favoritosDiv = document.querySelector('.favoritos');
    limpiarHTML(resultadoRecetas);

    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    if (favoritos.length) {
      mostrarRecetas(favoritos, 'Your favorite');
      return;
    }

    const noFavoritos = document.createElement('P');
    noFavoritos.textContent = "You didn't mark any recipes as favorites";
    noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-4');
    favoritosDiv.appendChild(noFavoritos);
  }
});
