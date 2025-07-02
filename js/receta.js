import {getParametroURL, detalleReceta} from './utils.js'

window.addEventListener('DOMContentLoaded', () => {
  const id = getParametroURL('id');

  if (id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => detalleReceta(resultado.meals[0]));
  }

});
