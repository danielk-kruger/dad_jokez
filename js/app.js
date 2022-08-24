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
const jokesList = document.getElementById('jokesList');

const menuToggleBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu-options');

let loading;
let favorites = [];

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

window.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('favorites') === null) {
    localStorage.setItem('favorites', JSON.stringify([]));
  }

  favorites = getFromStorage();
  await displayJoke();
});

saveFavorite.addEventListener('click', e => {
  e.preventDefault();
  saveFavorites(favorites);

  removeClass(modal, 'show');
  removeClass(overlay, 'show');
});

function saveFavorites(data) {
  if (favTitle.value === '') return;

  data.push({
    id: Math.random() * 500,
    title: favTitle.value,
    content: jokeText.textContent,
  });

  saveToStorage(data);
}

function displaySelection() {
  const savedJokes = [...document.querySelectorAll('.joke-card')];

  savedJokes.forEach(elem => {
    elem.addEventListener('click', e => {
      const jokeID = e.target.getAttribute('data-id');

      if (elem.getAttribute('data-id') === jokeID) {
        restoreFavorites(e.target);
      }
    });
  });

  // return res;
}

function restoreFavorites(element) {
  console.log(element);

  favorites.forEach(item => {
    console.log(item);
  });
}

function displayFavorites(data) {
  data.forEach(val => {
    const item = `
    <div class="joke-card" data-id="${val.id}">
      <h6 class="joke-title">${val.title}</h6>
      <p class="joke-body">
        ${val.content}
      </p>
   </div>
    `;

    jokesList.insertAdjacentHTML('beforeend', item);
  });

  // restoreFavorites();
}

function saveToStorage(data) {
  localStorage.setItem('favorites', JSON.stringify(data));
}

function getFromStorage() {
  return JSON.parse(localStorage.getItem('favorites'));
}

// DOM ELEMENT CLASS MANIPULATIONS

function removeClass(elem, className) {
  elem.classList.remove(className);
}

function addClass(elem, className) {
  elem.classList.add(className);
}

openSidebar.addEventListener('click', () => {
  addClass(sidebar, 'active');
  displayFavorites(favorites);
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

function showModal() {
  modal.classList.add('show');
  overlay.classList.add('show');
}