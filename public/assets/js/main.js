'use strict';

const FAVORITES_KEY = 'favorites';
let showResultsContainer = document.body.querySelector('#show-results');
let showInputElem = document.body.querySelector('#show-input');
let searchShowButton = document.body.querySelector('#search-show');
let errorBlock = document.body.querySelector('#error');
let selectOption = document.querySelector('#list');

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

  fetch(`https://api.tvmaze.com/search/${selectOption.value}?q=${query}`)
    .then(response => response.json())
    .then(response => {
      if (response.length === 0) {
        errorBlock.innerText =
          'No se han encontrado resultados para esta búsqueda';
      } else {
        errorBlock.innerText = '';
      }

      if (selectOption.value === 'shows') {
        for (const showData of response) {
          let show = showData.show;
          let showName = show.name;
          let showLanguage = show.language;
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

          let showLanElem = document.createElement('p');
          let showLanText = document.createTextNode(`Language: ${showLanguage}`);
          showLanElem.appendChild(showLanText);
          showResultItem.appendChild(showLanElem);

          showResultItem.addEventListener('click', toggleFavorite);

          showResultsContainer.appendChild(showResultItem);
        }
      } else if (selectOption.value === 'people') {
        // Selector de serie o actores, contenido (con ayuda de la variable el inicio 'selectOption').
        for (const showData of response) {
          let person = showData.person;
          let showName = person.name;
          let showImage;
          if (person.image && person.image.medium) {
            showImage = person.image.medium;
          } else {
            showImage = `https://via.placeholder.com/210x295/cccccc/666666/?text=TV`;
          }

          let showResultItem = document.createElement('li');
          showResultItem.className = 'show-result-item';

          if (hasFavorite(person.id)) {
            showResultItem.classList.add('show-result-item-active');
          }

          showResultItem.dataset.showId = person.id;

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
      }
      incrementCounter();
    });
}
searchShowButton.addEventListener('click', searchShow);

// Contador (las siguientes líneas de código + la línea 'incrementCounter();' al final de la función 'searchShow').

let counterElem = document.body.querySelector('#counter');
let counter = 0;

function init() {
  counterElem.innerText = '';
  searchShowButton.addEventListener('click', searchShow);
}

function incrementCounter() {
  counter += 1;
  counterElem.innerText = `Number of searchs you have made: ${counter}`;
}

init();


// Código para audio

let myAudio = document.getElementById("myAudio");
let isPlaying = false;

function togglePlay() {
  if (isPlaying) {
    myAudio.pause();
  } else {
    myAudio.play();
  }
}
myAudio.onplaying = function() {
  isPlaying = true;
}
myAudio.onpause = function() {
  isPlaying = false;
}


let iconImage = document.querySelector('i');
function toggleIcon(){
  if (iconImage.classList.contains('fa-volume-mute')) {
    iconImage.classList.toggle('fa-volume-up');
  } else if ((iconImage.classList.contains('fa-volume-up'))){
    iconImage.classList.toggle('fa-volume-mute');
  }
}
iconImage.addEventListener('click', toggleIcon);
//# sourceMappingURL=main.js.map
