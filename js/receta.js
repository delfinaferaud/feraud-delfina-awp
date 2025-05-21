import { limpiarHTML, btnFav} from './utils.js';


export function seleccionarReceta(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((resultado) => mostrarRecetaModal(resultado.meals[0]));
  }

export function mostrarRecetaModal(receta) {
    const { idMeal, strInstructions, strMeal, strMealThumb } = receta;

    const modalTitle = document.querySelector('.modal .modal-title');
    const modalBody = document.querySelector('.modal .modal-body');
    const modalElement = document.querySelector('#modal');
  const modal = new bootstrap.Modal(modalElement);

    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
            <h3 class="my-3">Instructions</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredients and measurements</h3>
        `;

    const listGroup = document.createElement('UL');
    listGroup.classList.add('list-group');

    for (let i = 1; i <= 20; i++) {
      if (receta[`strIngredient${i}`]) {
        const ingrediente = receta[`strIngredient${i}`];
        const cantidad = receta[`strMeasure${i}`];

        const ingredienteLi = document.createElement('LI');
        ingredienteLi.classList.add('list-group-item');
        ingredienteLi.textContent = `${ingrediente}, ${cantidad}`;

        listGroup.appendChild(ingredienteLi);
      }
    }
    modalBody.appendChild(listGroup);

    const modalFooter = document.querySelector('.modal-footer');
    limpiarHTML(modalFooter);
    modal.show();

    const btnCerrar = document.createElement('BUTTON');
    btnCerrar.classList.add('btn', 'btn-secondary', 'col');
    btnCerrar.textContent = 'Close';
    btnCerrar.onclick = function () {
      modal.hide();
      document.body.focus();
    };

    modalFooter.appendChild(btnFav(idMeal, strMeal, strMealThumb));
    modalFooter.appendChild(btnCerrar);

    modal.show();
  }
