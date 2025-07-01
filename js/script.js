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
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then((respuesta) =>
        console.log('sw registrado correctamente', respuesta)
      )
      .catch((error) => console.log('sw no se pudo registrar', error));
  }

  const resultado = document.querySelector('#resultado');

  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => mostrarCategorias(resultado.categories));

    function mostrarCategorias(categorias = []) {
  categorias.forEach((categoria) => {
    const { strCategory, strCategoryThumb} = categoria;

    const categoriaContenedor = document.createElement('DIV');
    categoriaContenedor.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

    categoriaContenedor.innerHTML = `
      <div class="card position-relative rounded-3">
        <img 
          src="${strCategoryThumb ?? categoria.img ?? categoria.title}" 
          alt="Imagen de la categoria ${strCategory}" 
          class="card-img-top imagen-cat"
          style="object-fit: cover"
        >

        <div class="barra-superior">
        <p class="titulo-cat">${strCategory}</p>
        </div>
      </div>
    `;

    const categoriaButton = categoriaContenedor.querySelector('.barra-superior');
    categoriaButton.onclick = () => {
      location.href = `categoria-recetas.html?c=${strCategory}`;
    };

    resultado.appendChild(categoriaContenedor);
  });
}
});
