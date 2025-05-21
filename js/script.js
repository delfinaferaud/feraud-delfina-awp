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
      const {
        strCategory,
        strCategoryThumb,
        strCategoryDescription,
      } = categoria;

      const categoriaContenedor = document.createElement('DIV');
      categoriaContenedor.classList.add('col-sm-6', 'col-md-4');

      const categoriaCard = document.createElement('DIV');
      categoriaCard.classList.add('card', 'mb-4');

      const categoriaImagen = document.createElement('IMG');
      categoriaImagen.classList.add('card-img-top');
      categoriaImagen.alt = `Imagen de la categoria ${strCategory}`;
      categoriaImagen.src =
        strCategoryThumb ?? categoria.img ?? categoria.title;

      const categoriaCardBody = document.createElement('DIV');
      categoriaCardBody.classList.add('card-body');

      const categoriaHeading = document.createElement('H3');
      categoriaHeading.classList.add('card-title', 'mb-3');
      categoriaHeading.textContent = strCategory;

      const categoriaDesc = document.createElement('P');
      categoriaDesc.classList.add('card-text');

      const descCompleta = strCategoryDescription;
      const descCorta = descCompleta.substring(0, 100);

      categoriaDesc.textContent = `${descCorta}...`;

      const verMasBtn = document.createElement('BUTTON');
      verMasBtn.classList.add('btn', 'btn-link', 'p-0', 'mb-3');
      verMasBtn.textContent = 'See more';

      mostrarDesc(descCorta, descCompleta, categoriaDesc, verMasBtn);
      const categoriaButton = document.createElement('BUTTON');
      categoriaButton.classList.add('btn', 'btn-primary', 'w-100');
      categoriaButton.textContent = 'See category';
      categoriaButton.onclick = () => {
  location.href = `categoria-recetas.html?c=${strCategory}`;
};
   
      categoriaCardBody.appendChild(categoriaHeading);
      categoriaCardBody.appendChild(categoriaDesc);
      categoriaCardBody.appendChild(verMasBtn);
      categoriaCardBody.appendChild(categoriaButton);
      categoriaCard.appendChild(categoriaImagen);
      categoriaCard.appendChild(categoriaCardBody);

      categoriaContenedor.appendChild(categoriaCard);

      resultado.appendChild(categoriaContenedor);
    });
  }

  function mostrarDesc(descCorta, descCompleta, categoriaDesc, verMasBtn) {
    let mostrandoTodo = false;
    verMasBtn.onclick = () => {
      mostrandoTodo = !mostrandoTodo;
      categoriaDesc.textContent = mostrandoTodo
        ? descCompleta
        : `${descCorta}...`;
      verMasBtn.textContent = mostrandoTodo ? 'See less' : 'See more';
    };
  }

});
