import './style/style.scss';

/* **********************VARIABLES********************** */

// HEADER BUTTONS
const sortBtn = document.querySelector('#sorting-btn');
const categoriesBtn = document.querySelector('#categories-btn');
const addBtn = document.querySelector('#add-btn');

// HEADER CONTAINERS
const sortContainer = document.querySelector('.sort-container');
const addContainer = document.querySelector('.add-item-container');

/* **********************FUNCTIONS********************** */

// Opening sort and add container
function openContainer(e): void {
  const targetID = e.currentTarget.id;

  if (targetID === 'sorting-btn') {
    sortContainer?.classList.toggle('open');
    if (addContainer?.classList.contains('open')) {
      addContainer?.classList.remove('open');
    }
  } else if (targetID === 'add-btn') {
    addContainer?.classList.toggle('open');
    if (sortContainer?.classList.contains('open')) {
      sortContainer?.classList.remove('open');
    }
  }
}

/* **********************LOGIC********************** */

// HEADER EVENTLISTENERS
sortBtn?.addEventListener('click', openContainer);
categoriesBtn?.addEventListener('click', openContainer);
addBtn?.addEventListener('click', openContainer);
