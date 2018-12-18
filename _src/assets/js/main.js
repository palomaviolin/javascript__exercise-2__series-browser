'use strict';

const FAVORITES_KEY = 'favorites';
let showResultsContainer = document.body.querySelector('#show-results');
let showInputElem = document.body.querySelector('#show-input');
let searchShowButton = document.body.querySelector('#search-show');
let errorBlock = document.body.querySelector('#error');

function getLocalStorageFavorites() {
    // Obtenemos array de IDs de favoritos o array vacío por defecto si no había nada en localStorage
    let favorites = localStorage.getItem(FAVORITES_KEY) || '[]';

    // Importante: los arrays vienen como strings, hay que convertirlos a arrays normales con JSON.parse
    return JSON.parse(favorites);
}

function addFavorite(showId) {
    // Obtenemos lista de favoritos (array)
    let favorites = getLocalStorageFavorites();
    // Añadimos ID de serie a lista de favoritos
    favorites.push(showId);

    // Actualizamos localStorage, sin olvidar convertir el array a un string con JSON.stringify
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function removeFavorite(showId) {
    // Obtenemos lista de favoritos como array
    let favorites = getLocalStorageFavorites();

    // Buscamos índice (posición) de array de favoritos del ID de la serie a quitar de lista de favoritos
    let indexToDelete = favorites.indexOf(showId);

    // Si el índice encontrado es distinto de -1, significa que el ID de serie a borrar estaba en la lista
    if (indexToDelete !== -1) {
        // Borramos elemento en la posición de ID de serie a borrar
        favorites.splice(indexToDelete, 1);
    }

    // Actualizamos lista de favoritos en localStorage, sin olvidar de convertir array a string con JSON.stringify
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function hasFavorite(showId) {
    // Obtenemos lista de favoritos como array
    let favorites = getLocalStorageFavorites();

    // Comprobamos si ID de serie existe en array.
    // Importante, los IDs de serie se guardan como strings en el array, pero showId es un número
    // Por seguridad, convertimos showId en String para que la comparación sea entre strings
    // si fuera entre string y número, no funcionaría
    if (favorites.indexOf(showId.toString()) !== -1) {
        return true; // Indicamos que existe
    }
    return false;
}

function toggleFavorite(event) {
    // event.currentTarget nos dará el <li> que se ha seleccionado
    let toggledResultItem = event.currentTarget;
    toggledResultItem.classList.toggle('show-result-item-active');

    // El elemento <li> debería tener un atributo data-showId: lo obtenemos así
    let showId = toggledResultItem.dataset.showId;

    // Si hay showId
    if (showId) {
        if (toggledResultItem.classList.contains('show-result-item-active')) {
            // Si la clase de favorito está aplicada al <li>, añadimos la serie como favorita a la lista
            addFavorite(showId);
        } else {
            // Si la clase de favorito NO está aplicada al <li>, quitamos la serie de la lista de favoritos
            removeFavorite(showId);
        }
    }
}

function searchShow() {
    // Obtenemos el valor introducido en el input del buscador de series
    let query = showInputElem.value;

    showResultsContainer.innerHTML = '';

    // Realizar la petición a la API para el valor que hemos introducido
    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
        .then(response => response.json())
        .then(response => {            
            // Mostrar un texto informativo si no hay resultados
            if (response.length === 0) {
                errorBlock.innerText = 'No se han encontrado resultados para esta búsqueda';
            } else {
                // Resetear el texto de error en caso contrario, para evitar confusiones si hay resultados
                errorBlock.innerText = '';
            }

            // La estructura de los datos:
            // 1. Es un array de objetos
            // 2. Cada objeto tiene dos campos: 'score' y 'show' ('show' es un objeto con los campos de interés: nombre, géneros de la serie, imagen, sinopsis...).

            // Iterar por cada elemento del array de resultados
            for (const showData of response) {
                // Nos interesa el campo 'show' de cada objeto del array
                let show = showData.show;

                // De momento nos interesan dos cosas: nombre de la serie e imagen
                let showName = show.name;

                // El campo 'image' tiene a su vez dos campos: 'medium' y 'original'. Creo que la 'original' contiene una imagen muy grande, y la 'medium' tendría una imagen de un tamaño más asequible para meter en nuestro listado.

                let showImage;
                if (show.image && show.image.medium) {
                    showImage = show.image.medium;
                } else {
                    showImage = `https://via.placeholder.com/210x295/cccccc/666666/?text=TV`;
                }

                // Creamos un elemento li para cada resultado de serie
                let showResultItem = document.createElement('li');
                showResultItem.className = 'show-result-item';

                // Si existe la serie en la lista de favoritos del local storage, añadimos la clase de favorito al <li>
                if (hasFavorite(show.id)) {
                    showResultItem.classList.add('show-result-item-active');
                }
                
                // Añadimos el id de serie como data-showId al <li>, para usarlo en las funciones de localStorage
                showResultItem.dataset.showId = show.id;

                // Cada elemento li tendrá dos hijos: título de la serie, y su imagen asociada

                // Creamos elemento de imagen
                let showImageElem = document.createElement('img');
                showImageElem.src = showImage;
                showResultItem.appendChild(showImageElem);

                // Creamos elemento de título
                let showTitleElem = document.createElement('h2');
                let showTitleText = document.createTextNode(showName);
                showTitleElem.appendChild(showTitleText);
                showResultItem.appendChild(showTitleElem);

                // Añadimos evento al elemento <li> para que se marque como destacado
                showResultItem.addEventListener('click', toggleFavorite);
            
                // Finalmente, añadimos elemento <li> a listado
                showResultsContainer.appendChild(showResultItem);
            }
        })
}

searchShowButton.addEventListener('click', searchShow);
