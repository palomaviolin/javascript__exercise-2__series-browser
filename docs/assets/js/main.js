"use strict";
const FAVORITES_KEY = "favorites";
let showResultsContainer = document.body.querySelector("#show-results"),
  showInputElem = document.body.querySelector("#show-input"),
  searchShowButton = document.body.querySelector("#search-show"),
  errorBlock = document.body.querySelector("#error");
function getLocalStorageFavorites() {
  let e = localStorage.getItem(FAVORITES_KEY) || "[]";
  return JSON.parse(e);
}
function addFavorite(e) {
  let t = getLocalStorageFavorites();
  t.push(e), localStorage.setItem(FAVORITES_KEY, JSON.stringify(t));
}
function removeFavorite(e) {
  let t = getLocalStorageFavorites(),
    o = t.indexOf(e);
  -1 !== o && t.splice(o, 1),
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(t));
}
function hasFavorite(e) {
  return -1 !== getLocalStorageFavorites().indexOf(e.toString());
}
function toggleFavorite(e) {
  let t = e.currentTarget;
  t.classList.toggle("show-result-item-active");
  let o = t.dataset.showId;
  o &&
    (t.classList.contains("show-result-item-active")
      ? addFavorite(o)
      : removeFavorite(o));
}
function searchShow() {
  let e = showInputElem.value;
  (showResultsContainer.innerHTML = ""),
    fetch(`https://api.tvmaze.com/search/shows?q=${e}`)
      .then(e => e.json())
      .then(e => {
        0 === e.length
          ? (errorBlock.innerText =
              "No se han encontrado resultados para esta búsqueda")
          : (errorBlock.innerText = "");
        for (const t of e) {
          let e,
            o = t.show,
            r = o.name;
          e =
            o.image && o.image.medium
              ? o.image.medium
              : "https://via.placeholder.com/210x295/cccccc/666666/?text=TV";
          let n = document.createElement("li");
          (n.className = "show-result-item"),
            hasFavorite(o.id) && n.classList.add("show-result-item-active"),
            (n.dataset.showId = o.id);
          let a = document.createElement("img");
          (a.src = e), n.appendChild(a);
          let c = document.createElement("h2"),
            s = document.createTextNode(r);
          c.appendChild(s),
            n.appendChild(c),
            n.addEventListener("click", toggleFavorite),
            showResultsContainer.appendChild(n);
        }
        incrementCounter();
      });
}
searchShowButton.addEventListener("click", searchShow);
let counterElem = document.body.querySelector("#counter"),
  counter = 0;
function init() {
  (counterElem.innerText = ""),
    searchShowButton.addEventListener("click", searchShow);
}
function incrementCounter() {
  (counter += 1),
    (counterElem.innerText = `Número de búsquedas que has realizado: ${counter}`);
}
init();
