const jokeText = document.querySelector('.dad_joke');
const saveBtn = document.querySelector('.btn_save');
const generateBtn = document.querySelector('.btn_gen');
const closeSidebar = document.querySelector('.close-sidebar');
const openSidebar = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar-fav');
const closeModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.joke-title_modal');

const favTitle = document.getElementById('custom_title');
const saveFavorite = document.querySelector('.modal-save_btn');
const jokesList = document.querySelector('.fav-jokes');

const menuToggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-options');
const trashBtn = document.querySelector('.selected-trash');

let loading;
let favorites = [];
let selected = [];
let selectMode = false;
let isShown = false;

const getDadJoke = async () => {
  loading = true;
  jokeText.textContent = 'Loading joke...';

  return await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  })
    .then(res => res.json())
    .catch(err => console.log(err))
    .finally(() => (loading = false));
};

const displayJoke = async () => {
  const { joke } = await getDadJoke();

  jokeText.textContent = joke;
};

generateBtn.addEventListener('click', async e => {
  e.preventDefault();
  await displayJoke();
});

// Startup actions
window.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('favorites') === null) {
    localStorage.setItem('favorites', JSON.stringify([]));
  }

  favorites = getFromStorage();
  await displayJoke();
  displayFavorites(favorites);
});

saveFavorite.addEventListener('click', e => {
  e.preventDefault();
  saveFavorites(favorites);

  removeClass(modal, 'show');
  removeClass(overlay, 'show');
});

function setJoke(item) {
  jokeText.textContent = item.content;
}

function saveFavorites(data) {
  if (favTitle.value === '') return;

  const item = {
    id: Math.random() * 500,
    title: favTitle.value,
    content: jokeText.textContent,
  };

  data.push(item);
  displayItem(data[data.indexOf(item)]);

  const cache = [...new Map(data.map(item => [item.id, item])).values()];
  saveToStorage(cache);

  reloadData(favorites);
}

function highlightSelected(item) {
  item.classList.toggle('selected');
}

function displaySelection(data, joke) {
  verifyJoke(data, joke, item => {
    highlightSelected(joke);

    selected.includes(item) ? (selected = selected.filter(elem => elem.id !== item.id)) : selected.push(item);

    console.log(selected);
  });

  return null;
}

function selectJoke(data) {
  const savedJokes = jokesList.children;

  for (let joke of savedJokes) {
    joke.addEventListener('click', e => {
      const target = e.target;

      !selectMode &&
        verifyJoke(data, target, item => {
          jokeText.textContent = item.content;
          removeClass(sidebar, 'active');
          hideMenu();
        });

      selectMode && displaySelection(data, target);
    });
  }
}

function displayFavorites(data) {
  data.forEach(val => {
    const item = showFavJokeCard(val);

    jokesList.insertAdjacentHTML('beforeend', item);
  });
}

function displayItem(itemData) {
  const item = showFavJokeCard(itemData);
  jokesList.insertAdjacentHTML('beforeend', item);
}

function removeSelected(data, selectedData) {
  if (selectedData == []) return; // if nothing is selected, do nothing

  // filter out the main array with the selected items
  const newData = data.filter(item => !selected.includes(item));

  // update everything!
  saveToStorage(newData);
  reloadData(newData);
}

function verifyJoke(data, elem, exec) {
  for (let item of data) {
    if (Number(elem.getAttribute('data-id')) === item.id) {
      exec(item);
    }
  }
}

function saveToStorage(data) {
  localStorage.setItem('favorites', JSON.stringify(data));
}

function getFromStorage() {
  return JSON.parse(localStorage.getItem('favorites'));
}

function reloadData(currentData) {
  currentData = getFromStorage();

  [...jokesList.children].forEach(item => jokesList.removeChild(item));
  displayFavorites(currentData);
}

// DOM ELEMENT CLASS MANIPULATIONS

function removeClass(elem, className) {
  elem.classList.remove(className);
}

function addClass(elem, className) {
  elem.classList.add(className);
}

function hasClass(elem, className) {
  return elem.classList.contains(className);
}

function hideMenu() {
  removeClass(menu, 'show');
}

openSidebar.addEventListener('click', () => {
  addClass(sidebar, 'active');
  selectJoke(favorites);
});

closeSidebar.addEventListener('click', () => {
  removeClass(sidebar, 'active');
});

closeModal.addEventListener('click', () => {
  removeClass(modal, 'show');
  removeClass(overlay, 'show');
});

saveBtn.addEventListener('click', () => {
  showModal();
});

menuToggleBtn.addEventListener('click', () => {
  menu.classList.toggle('show');
});

document.getElementById('selectOption').addEventListener('click', () => {
  selectMode = true;
  hideMenu();
  addClass(jokesList, 'select-mode');
  addClass(trashBtn, 'active');
});

function reset() {
  selectMode = false;
  removeClass(jokesList, 'select-mode');
  removeClass(trashBtn, 'active');
}

trashBtn.addEventListener('click', () => {
  removeSelected(favorites, selected);
  reset();
});

function showModal() {
  modal.classList.add('show');
  overlay.classList.add('show');
}

function showFavJokeCard(val) {
  return `
  <div class="joke-card" data-id="${val.id}">
    <h6 class="joke-title">${val.title}</h6>
    <p class="joke-body">
      ${val.content}
    </p>
 </div>
  `;
}
