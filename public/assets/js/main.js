'use strict';

let showResultsContainer = document.body.querySelector('#show-results');
let showInputElem = document.body.querySelector('#show-input');
let searchShowButton = document.body.querySelector('#search-show');
let errorBlock = document.body.querySelector('#error');

function toggleFavorite(event) {
    // event.currentTarget nos dará el <li> que se ha seleccionado
    let toggledResultItem = event.currentTarget;
    toggledResultItem.classList.toggle('show-result-item-active');
    // let id = show.id;
    // localStorage.setItem(id, toggledResultItem);
    // console.log('Cacheado resultado para ', id);
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

//# sourceMappingURL=main.js.map
