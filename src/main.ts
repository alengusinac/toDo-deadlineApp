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
  dateAddedToList?: Date;
};

// toDo ITEM LIST
const itemList: Item[] = [
  {
    title: 'Example',
    category: 'example',
    deadline: new Date('2023-01-17 00:00:00'),
    dateAddedToList: new Date('Sat Dec 10 2022 16:10:26 GMT+0800 (Central Indonesia Time)'),
  },
];

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

function calculateDeadline(item: Item): number {
  const itemDeadlineDate: number = item.deadline!.getTime();
  const todaysDate: number = new Date().getTime();
  const difference = itemDeadlineDate - todaysDate;
  const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

function renderList(): void {
  todoItemsContainer.innerHTML = '';

  for (let i = 0; i < itemList.length; i++) {
    const item: Item = itemList[i];
    const deadlineInDays = calculateDeadline(item);

    todoItemsContainer.innerHTML += `
    <article class="todo-item">

      <button>
        <span class="material-symbols-outlined">task_alt</span>
      </button>

      <p>${item.title!}</p>

      <div class="time-left">
        <span class="material-symbols-outlined">hourglass_empty</span>
        <span>${deadlineInDays}days</span>
      </div>

      <button>
        <span class="material-symbols-outlined">do_not_disturb_on</span>
      </button>
    
    </article>
    `;
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
  };

  itemList.push(newItem);
  clearForm();
  renderList();
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

renderList();
