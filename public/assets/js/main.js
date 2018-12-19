'use strict';

const FAVORITES_KEY = 'favorites';
let showResultsContainer = document.body.querySelector('#show-results');
let showInputElem = document.body.querySelector('#show-input');
let searchShowButton = document.body.querySelector('#search-show');
let errorBlock = document.body.querySelector('#error');

function getLocalStorageFavorites() {
  let favorites = localStorage.getItem(FAVORITES_KEY) || '[]';
  return JSON.parse(favorites);
}

function addFavorite(showId) {
  let favorites = getLocalStorageFavorites();
  favorites.push(showId);

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function removeFavorite(showId) {
  let favorites = getLocalStorageFavorites();
  let indexToDelete = favorites.indexOf(showId);
  if (indexToDelete !== -1) {
    favorites.splice(indexToDelete, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function hasFavorite(showId) {
  let favorites = getLocalStorageFavorites();
  if (favorites.indexOf(showId.toString()) !== -1) {
    return true;
  }
  return false;
}

function toggleFavorite(event) {
  let toggledResultItem = event.currentTarget;
  toggledResultItem.classList.toggle('show-result-item-active');

  let showId = toggledResultItem.dataset.showId;

  if (showId) {
    if (toggledResultItem.classList.contains('show-result-item-active')) {
      addFavorite(showId);
    } else {
      removeFavorite(showId);
    }
  }
}

function searchShow() {
  let query = showInputElem.value;
  showResultsContainer.innerHTML = '';

  fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
    .then(response => response.json())
    .then(response => {
      if (response.length === 0) {
        errorBlock.innerText =
          'No se han encontrado resultados para esta búsqueda';
      } else {
        errorBlock.innerText = '';
      }

      for (const showData of response) {
        let show = showData.show;
        let showName = show.name;
        let showImage;
        if (show.image && show.image.medium) {
          showImage = show.image.medium;
        } else {
          showImage = `https://via.placeholder.com/210x295/cccccc/666666/?text=TV`;
        }

        let showResultItem = document.createElement('li');
        showResultItem.className = 'show-result-item';

        if (hasFavorite(show.id)) {
          showResultItem.classList.add('show-result-item-active');
        }

        showResultItem.dataset.showId = show.id;

        let showImageElem = document.createElement('img');
        showImageElem.src = showImage;
        showResultItem.appendChild(showImageElem);

        let showTitleElem = document.createElement('h2');
        let showTitleText = document.createTextNode(showName);
        showTitleElem.appendChild(showTitleText);
        showResultItem.appendChild(showTitleElem);

        showResultItem.addEventListener('click', toggleFavorite);

        showResultsContainer.appendChild(showResultItem);
      }
      incrementCounter()
    });
}
searchShowButton.addEventListener('click', searchShow);



// Contador (las siguientes líneas de código + la línea 'incrementCounter()' al final de la función 'searchShow').
let counterElem = document.body.querySelector('#counter');
let counter = 0;

function init() {
    counterElem.innerText = '';
    searchShowButton.addEventListener('click', searchShow);
}

function incrementCounter() {
    counter += 1;
    counterElem.innerText = `Número de búsquedas que has realizado: ${counter}`;
}

init();

//# sourceMappingURL=main.js.map
