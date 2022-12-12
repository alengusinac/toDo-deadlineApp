/* eslint-disable @typescript-eslint/no-use-before-define */
import './style/style.scss';

/* **********************VARIABLES********************** */

// HEADER BUTTONS
const sortBtn = document.querySelector('#sorting-btn') as HTMLButtonElement;
const categoriesBtn = document.querySelector('#categories-btn') as HTMLButtonElement;
const addBtn = document.querySelector('#add-btn') as HTMLButtonElement;

// HEADER CONTAINERS
const sortContainer = document.querySelector('.sort-container') as HTMLDivElement;
const addContainer = document.querySelector('.add-item-container') as HTMLDivElement;

type Item = {
  title?: string,
  category?: string,
  deadline?: Date,
  dateAddedToList?: Date,
  isChecked?: boolean,
};

// toDo ITEM LIST
let itemList: object[] = [];

const todoItemsContainer = document.querySelector('#todo-items-container') as HTMLDivElement;

// ADD ITEM FORM
const titleInput = document.querySelector('#title-input') as HTMLInputElement;
const categoryInput = document.querySelector('#category-input') as HTMLInputElement;
const dateInput = document.querySelector('#date-input') as HTMLInputElement;
const addItemBtn = document.querySelector('#add-item-btn') as HTMLButtonElement;

let validTitleInput = false;
let validCategoryInput = false;
let validDateInput = false;

/* **********************FUNCTIONS********************** */

// Opening sort and add container
function openContainer(e: MouseEvent): void {
  const target = e.currentTarget as HTMLButtonElement;
  const targetID = target.id;

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

function validateForm(e: Event): void {
  const targetInput = e.currentTarget as HTMLInputElement;
  const targetInputValue = targetInput.value;
  const targetLabelContainer = targetInput.parentElement as HTMLLabelElement;
  const errorMsgContainer = targetLabelContainer.querySelector('.input-error') as HTMLSpanElement;

  // VALIDATE DATE INPUT
  if (targetInput.id === 'date-input') {
    // Get todays date
    const todaysFullDate = new Date();
    const todaysYear = todaysFullDate.getFullYear();
    const todaysMonth = todaysFullDate.getMonth() + 1;
    const todaysDate = todaysFullDate.getDate();

    // Get input date
    const inputSplit = targetInputValue.split('-');
    const inputYear = Number(inputSplit[0]);
    const inputMonth = Number(inputSplit[1]);
    const inputDate = Number(inputSplit[2]);

    // Compare todays date to input date (valid if input date is bigger or equal to todays date)
    if (inputYear > todaysYear && inputYear.toString().length === 4) {
      validDateInput = true;
      errorMsgContainer.innerHTML = '';
    } else if (inputYear === todaysYear && inputMonth > todaysMonth) {
      console.log('HEY!');
      validDateInput = true;
      errorMsgContainer.innerHTML = '';
    } else if (inputYear === todaysYear && inputMonth === todaysMonth && inputDate >= todaysDate) {
      validDateInput = true;
      errorMsgContainer.innerHTML = '';
    } else if (!targetInputValue) {
      validDateInput = false;
      errorMsgContainer.innerHTML = 'is Required';
    } else {
      validDateInput = false;
      errorMsgContainer.innerHTML = 'cannot be in the Past';
    }
  }

  // VALIDATE IF TITLE INPUT IS EMPTY
  if (targetInput.id === 'title-input') {
    if (targetInputValue) {
      validTitleInput = true;
      errorMsgContainer.innerHTML = '';
    } else {
      validTitleInput = false;
      errorMsgContainer.innerHTML = 'is Required';
    }
  }

  // VALIDATE IF CATEGORY INPUT IS EMPTY
  if (targetInput.id === 'category-input') {
    if (targetInputValue) {
      validCategoryInput = true;
      errorMsgContainer.innerHTML = '';
    } else {
      validCategoryInput = false;
      errorMsgContainer.innerHTML = 'is Required';
    }
  }

  if (validTitleInput && validCategoryInput && validDateInput) {
    addItemBtn?.removeAttribute('disabled');
  } else {
    addItemBtn?.setAttribute('disabled', 'true');
  }
}

function checkIfChecked(item: Item): string {
  if (item.isChecked) {
    return ' checked';
  }
  return '';
}

function calculateDeadline(item: Item): number {
  const datefromJSON = new Date(item.deadline!);
  const itemDeadlineDate: number = datefromJSON.getTime();
  const todaysDate: number = new Date().getTime();
  const difference = itemDeadlineDate - todaysDate;
  const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

function renderList(): void {
  todoItemsContainer.innerHTML = '';

  for (let i = 0; i < itemList.length; i++) {
    const item: Item = itemList[i];
    const isChecked = checkIfChecked(item);
    const deadlineInDays = calculateDeadline(item);

    todoItemsContainer.innerHTML += `
    <article class="todo-item open${isChecked}">

      <button>
        <span id="${i}" class="material-symbols-outlined check-item-btn">task_alt</span>
      </button>

      <p>${item.title!}</p>

      <div class="time-left">
        <span class="material-symbols-outlined">hourglass_empty</span>
        <span>${deadlineInDays}days</span>
      </div>

      <button>
        <span id="${i}" class="material-symbols-outlined remove-item-btn">do_not_disturb_on</span>
      </button>
    
    </article>
    `;
  }
  addEventListenersToItemBtns();
  saveData();
}

function removeItem(e: Event): void {
  const button = e.currentTarget as HTMLSpanElement;
  const buttonID = Number(button.id);

  itemList.splice(buttonID, 1);
  renderList();
}

function checkItem(e: Event): void {
  const button = e.currentTarget as HTMLSpanElement;
  const buttonID = Number(button.id);
  const item = itemList[buttonID];

  if (item.isChecked) {
    item.isChecked = false;
  } else {
    item.isChecked = true;
  }

  renderList();
}

function addEventListenersToItemBtns(): void {
  const removeItemBtns = document.querySelectorAll('.remove-item-btn') as NodeList;
  const checkItemBtns = document.querySelectorAll('.check-item-btn') as NodeList;

  for (let i = 0; i < removeItemBtns.length; i++) {
    const removeItemBtn = removeItemBtns[i];
    removeItemBtn.addEventListener('click', removeItem);
  }

  for (let i = 0; i < checkItemBtns.length; i++) {
    const removeItemBtn = checkItemBtns[i];
    removeItemBtn.addEventListener('click', checkItem);
  }
}

function clearForm(): void {
  addContainer?.classList.remove('open');
  addItemBtn?.setAttribute('disabled', 'true');
  titleInput.value = '';
  categoryInput.value = '';
  dateInput.value = '';
}

function addItemToList(): void {
  const titleValue = titleInput?.value;
  const categoryValue = categoryInput?.value;
  const dateValue = new Date(dateInput.value);
  const dateAdded = new Date();

  const newItem: Item = {
    title: titleValue,
    category: categoryValue,
    deadline: dateValue,
    dateAddedToList: dateAdded,
    isChecked: false,
  };

  itemList.push(newItem);
  clearForm();
  renderList();
}

function saveData(): void {
  localStorage.setItem('data', JSON.stringify(itemList));
}

function loadData(): void {
  if (localStorage.getItem('data') !== null) {
    itemList = JSON.parse(localStorage.getItem('data'));
  }
}
/* **********************LOGIC********************** */

// HEADER EVENTLISTENERS
sortBtn?.addEventListener('click', openContainer);
categoriesBtn?.addEventListener('click', openContainer);
addBtn?.addEventListener('click', openContainer);

// ADD ITEM EVENTLISTENER
titleInput?.addEventListener('blur', validateForm);
categoryInput?.addEventListener('blur', validateForm);
dateInput?.addEventListener('change', validateForm);
addItemBtn?.addEventListener('click', addItemToList);

loadData();
renderList();
console.log(itemList);
