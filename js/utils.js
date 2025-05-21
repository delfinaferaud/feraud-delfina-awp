export function getParametroURL(nombre) {
  const url = new URL(window.location.href);
  return url.searchParams.get(nombre);
}

export function limpiarHTML(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}

export function btnFav(idMeal, strMeal, strMealThumb, actualizarFavoritos) {
  const btnFavorito = document.createElement('BUTTON');
  btnFavorito.classList.add('btn', 'btn-primary', 'col', 'mx-1');
  btnFavorito.textContent = existeStorage(idMeal)
    ? 'Delete as favorite'
    : 'Add as favorite';

  btnFavorito.onclick = function () {
    if (existeStorage(idMeal)) {
      eliminarFavorito(idMeal);
      btnFavorito.textContent = 'Add as favorite';
      mostrarToast('Successfully deleted');

      if (typeof actualizarFavoritos === 'function') {
        actualizarFavoritos();
      }
      return;
    }

    agregarFavorito({
      id: idMeal,
      title: strMeal,
      img: strMealThumb,
    });
    btnFavorito.textContent = 'Delete as favorite';
    mostrarToast('Successfully added');
  };

  return btnFavorito;
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
