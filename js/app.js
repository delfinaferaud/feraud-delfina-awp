import { getParametroURL } from './utils.js';

window.addEventListener('DOMContentLoaded', function () {
  const estadoConexion = document.getElementById('estado-conexion');
  window.estadoConexion = estadoConexion;
  
  let conectadoAnteriormente = window.navigator.onLine;
  
  function mostrarCartel(conectado) {
    if (conectado) {
      estadoConexion.textContent = 'Conexión establecida';
      estadoConexion.classList.remove('estado-offline');
      estadoConexion.classList.add('estado-online');
      estadoConexion.style.display = 'block';
      
      setTimeout(() => {
        estadoConexion.style.display = 'none';
      }, 3000);
    } else {
      estadoConexion.textContent = 'Sin Conexión';
      estadoConexion.classList.remove('estado-online');
      estadoConexion.classList.add('estado-offline');
      estadoConexion.style.display = 'block';
    }
  }
  
  function actualizarEstado(eventoManual = false) {
    const estaConectado = window.navigator.onLine;
    
    if (estaConectado !== conectadoAnteriormente || eventoManual) {
      mostrarCartel(estaConectado);
    }
    
    conectadoAnteriormente = estaConectado;
  }

  if (!navigator.onLine) {
    mostrarCartel(false);
  }
  
  window.addEventListener('online', () => actualizarEstado(true));
  window.addEventListener('offline', () => actualizarEstado(true));
  

  
  let categoryId = getParametroURL('c');
  
  const resultadoRecetas = document.getElementById('resultado-recetas');
  const resultadoFavoritos = document.getElementById('resultado-favoritos');
  const searchBar = document.getElementById('searchBar');

  if (resultadoFavoritos) {
    mostrarGuardadas(resultadoFavoritos);
  }
  if (categoryId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryId}`)
      .then((respuesta) => respuesta.json())
      .then((resultado) => {
        mostrarRecetas(resultado.meals, categoryId);
      });
  }

  function mostrarRecetas(recetas = [], categoria) {
    resultadoRecetas.innerHTML = `
    <h2 class="text-center text-black">${categoria} recipes</h2>
  `;
    cards(recetas, resultadoRecetas);
  }

  function mostrarGuardadas(contenedor) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
    if (favoritos.length) {
      cards(favoritos, contenedor);
      return;
    }
  }

  function cards(recetas = [], contenedor) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

    recetas.forEach((receta) => {
      const id = receta.idMeal || receta.id;
      const title = receta.strMeal || receta.title;
      const img = receta.strMealThumb || receta.img;

      const esFavorito = favoritos.some((fav) => fav.id === id.toString());
      const claseBookmark = esFavorito ? 'bi-bookmark-fill' : 'bi-bookmark';

      const recetaContenedor = document.createElement('DIV');
      recetaContenedor.classList.add(
        'col-12',
        'col-sm-6',
        'col-md-4',
        'col-lg-3',
        'mb-4'
      );

      recetaContenedor.innerHTML = ` 
      <div class="card card-recetas position-relative rounded-3">
        <img src="${img}" alt="Imagen de la receta ${title}" class="card-img-top" style="object-fit: cover">
        <div class="barra-superior-recetas d-flex justify-content-center flex-column">
        <p class="titulo-recetas mt-3 mx-2">${title}</p>
        <div class="mb-3">
        <i class="bi ${claseBookmark}" data-id="${id}"></i>
        <i class="bi bi-eye-fill" data-id="${id}"></i>
        <i class="bi bi-share-fill" data-id="${id}"></i>
        </div>
        </div>
      </div>
    `;
      contenedor.appendChild(recetaContenedor);
    });
  }

if(searchBar){
  searchBar.addEventListener('keyup', function (e) {
    const termino = e.target.value.toLowerCase().trim();
    const tarjetas = document.querySelectorAll('.card-recetas');
    
    tarjetas.forEach(tarjeta => {
      const titulo = tarjeta.querySelector('.titulo-recetas').textContent.toLowerCase();
      if (titulo.includes(termino)) {
        tarjeta.parentElement.style.display = '';
      } else {
        tarjeta.parentElement.style.display = 'none';
      }
    });
  });
}
});


