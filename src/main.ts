/* eslint-disable @typescript-eslint/no-use-before-define */
import './style/style.scss';
import './style/desktop.scss';

/* **********************VARIABLES********************** */

// HEADER BUTTONS
const sortBtn = document.querySelector('#sorting-btn') as HTMLButtonElement;
const categoriesBtn = document.querySelector('#categories-btn') as HTMLButtonElement;
const addBtn = document.querySelector('#add-btn') as HTMLButtonElement;

// HEADER CONTAINERS
const sortContainer = document.querySelector('.sort-container') as HTMLDivElement;
const categoriesContainer = document.querySelector('.categories-container') as HTMLDivElement;
const addContainer = document.querySelector('.add-item-container') as HTMLDivElement;

// ADD ITEM FORM
const titleInput = document.querySelector('#title-input') as HTMLInputElement;
const categoryInput = document.querySelector('#category-input') as HTMLInputElement;
const dateInput = document.querySelector('#date-input') as HTMLInputElement;
const addItemBtn = document.querySelector('#add-item-btn') as HTMLButtonElement;

let validTitleInput = false;
let validCategoryInput = false;
let validDateInput = false;

// SORT ITEMS
const sortByNameBtn = document.querySelector('#sort-name-btn') as HTMLButtonElement;
const sortByDeadlineBtn = document.querySelector('#sort-deadline-btn') as HTMLButtonElement;
const sortByDateAddedBtn = document.querySelector('#sort-date-added-btn') as HTMLButtonElement;

let sortBy = 'deadline';

// CATEGORIES
let categoryFilter = 'all categories';

// toDo ITEM LIST
type Item = {
  title: string,
  category: string,
  deadline: Date,
  dateAddedToList: Date,
  isChecked: boolean,
};

let itemList: Item[] = [];
let filteredList: Item[] = [];

const todoItemsContainer = document.querySelector('#todo-items-container') as HTMLDivElement;

/* **********************FUNCTIONS********************** */

// Opening sort, categories and add container
function openContainer(e: MouseEvent): void {
  const target = e.currentTarget as HTMLButtonElement;
  const targetID = target.id;

  if (targetID === 'sorting-btn') {
    if (sortContainer.style.visibility === 'visible') {
      sortContainer.style.visibility = 'hidden';
    } else {
      sortContainer.style.visibility = 'visible';
    }
    sortContainer?.classList.toggle('open');
    addContainer?.classList.remove('open');
    categoriesContainer?.classList.remove('open');
    addContainer.style.visibility = 'hidden';
    categoriesContainer.style.visibility = 'hidden';
  } else if (targetID === 'add-btn') {
    if (addContainer.style.visibility === 'visible') {
      addContainer.style.visibility = 'hidden';
    } else {
      addContainer.style.visibility = 'visible';
    }
    addContainer?.classList.toggle('open');
    sortContainer?.classList.remove('open');
    categoriesContainer?.classList.remove('open');
    sortContainer.style.visibility = 'hidden';
    categoriesContainer.style.visibility = 'hidden';
  } else if (targetID === 'categories-btn') {
    if (categoriesContainer.style.visibility === 'visible') {
      categoriesContainer.style.visibility = 'hidden';
    } else {
      categoriesContainer.style.visibility = 'visible';
    }
    categoriesContainer?.classList.toggle('open');
    sortContainer?.classList.remove('open');
    addContainer?.classList.remove('open');
    addContainer.style.visibility = 'hidden';
    sortContainer.style.visibility = 'hidden';
  }
}

// Form validation
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

// Chnaging the global sortBy variable
function changeSortItemList(e: Event): void {
  const target = e.currentTarget as HTMLButtonElement;
  const targetID = target.id;

  if (targetID === 'sort-name-btn') {
    if (sortBy === 'name') {
      sortBy = 'nameReversed';
    } else {
      sortBy = 'name';
    }
  }

  if (targetID === 'sort-deadline-btn') {
    if (sortBy === 'deadline') {
      sortBy = 'deadlineReversed';
    } else {
      sortBy = 'deadline';
    }
  }

  if (targetID === 'sort-date-added-btn') {
    if (sortBy === 'dateAdded') {
      sortBy = 'dateAddedReversed';
    } else {
      sortBy = 'dateAdded';
    }
  }
  renderList();
  sortContainer?.classList.remove('open');
  sortContainer.style.visibility = 'hidden';
}

// Sorting itemList between name, deadline or date added to list
function sortItemList(): void {
  if (sortBy === 'name') {
    itemList.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
  }

  if (sortBy === 'nameReversed') {
    itemList.sort((a, b) => (b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1));
  }

  if (sortBy === 'deadline') {
    itemList.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateA.valueOf() - dateB.valueOf();
    });
  }

  if (sortBy === 'deadlineReversed') {
    itemList.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      return dateB.valueOf() - dateA.valueOf();
    });
  }

  if (sortBy === 'dateAdded') {
    itemList.sort((a, b) => {
      const dateA = new Date(a.dateAddedToList);
      const dateB = new Date(b.dateAddedToList);
      return dateA.valueOf() - dateB.valueOf();
    });
  }

  if (sortBy === 'dateAddedReversed') {
    itemList.sort((a, b) => {
      const dateA = new Date(a.dateAddedToList);
      const dateB = new Date(b.dateAddedToList);
      return dateB.valueOf() - dateA.valueOf();
    });
  }
}

// Calculating deadline in days
function calculateDeadline(item: Item): string[] {
  const dateArray = [];
  if (item.deadline && item.dateAddedToList) {
    const deadlineDate = new Date(item.deadline);
    const dateAddedDate = new Date(item.dateAddedToList);

    // Calculate days to deadline, push to dateArray
    const itemDeadlineDate: number = deadlineDate.getTime();
    const todaysDate: number = new Date().getTime();
    const difference = itemDeadlineDate - todaysDate;
    const daysDifference = Math.ceil(difference / (1000 * 60 * 60 * 24));
    dateArray.push(String(daysDifference));

    // Get full date YY-MM-DD from item deadline, push to dateArray
    const deadlineDateMonth = (`0${deadlineDate.getMonth() + 1}`).slice(-2);
    const deadlineDateDate = (`0${deadlineDate.getDate()}`).slice(-2);

    const displayDeadlineDate = `${deadlineDate.getFullYear()}-${deadlineDateMonth}-${deadlineDateDate}`;
    dateArray.push(displayDeadlineDate);

    // Get full date YY-MM-DD from item dateAdded, push to dateArray
    const dateAddedDateMonth = (`0${dateAddedDate.getMonth() + 1}`).slice(-2);
    const dateAddedDateDate = (`0${deadlineDate.getDate()}`).slice(-2);

    const displayDateAddedDate = `${dateAddedDate.getFullYear()}-${dateAddedDateMonth}-${dateAddedDateDate}`;
    dateArray.push(displayDateAddedDate);
  }

  return dateArray;
}

// Marks a item with yellow color if deadline equal or under 5 days
function checkIfCloseDeadline(deadlineInDays: string): string {
  const deadlineNumber = Number(deadlineInDays);
  if (deadlineNumber <= 5 && deadlineNumber > 0) {
    return ' close-deadline';
  }
  if (deadlineNumber <= 0) {
    return ' after-deadline';
  }
  return '';
}

// Takes the deadline string and determines day or days to string output
function deadlineToString(deadline: string) {
  const deadlineNumber = Number(deadline);
  if (deadlineNumber === 1 || deadlineNumber === -1) {
    return `${deadlineNumber} day`;
  }
  return `${deadlineNumber} days`;
}

// Iterating through item list and adding all categories to new array
function buildCategoryList(): void {
  const categoriesList = [];
  const categoriesListElement = categoriesContainer.querySelector('ul') as HTMLUListElement;
  const browseCategoryElement = document.querySelector('#browse') as HTMLDataListElement;
  categoriesListElement.innerHTML = '<li>> <button class="category-btn">all categories</button> <</li>';
  browseCategoryElement.innerHTML = `
  <option value="Important">
  <option value="Home">
  <option value="Work">
  `;

  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i];

    categoriesList.push(item.category);
  }

  categoriesList.filter((item): item is string => !!item)
    .sort((a, b) => (a > b ? 1 : -1));

  const categoriesListNoDuplicates = [...new Set(categoriesList)];

  for (let i = 0; i < categoriesListNoDuplicates.length; i++) {
    const category = categoriesListNoDuplicates[i];
    categoriesListElement.innerHTML += `<li>> <button class="category-btn">${category}</button> <</li>`;

    browseCategoryElement.innerHTML += `<option value="${category}">`;
  }
}

// Changes categoryFilter to clicked category
function changeFilterCategories(e:Event): void {
  const target = e.currentTarget as HTMLButtonElement;
  categoryFilter = target.innerText;

  renderList();
  categoriesContainer?.classList.remove('open');
  categoriesContainer.style.visibility = 'hidden';
}

// Filtering item list to only show clicked category
function filterCategories(): void {
  const categoryTitleElm = document.querySelector('#category-title') as HTMLSpanElement;
  if (categoryFilter === 'all categories') {
    filteredList = itemList;
    categoryTitleElm.innerHTML = 'all categories';
    return;
  }

  filteredList = itemList.filter((item) => item.category === categoryFilter);
  categoryTitleElm.innerHTML = categoryFilter;
}

function checkCategoryIcon(item: Item): string {
  if (item.category === 'Important') {
    return '<span class="material-symbols-outlined">star</span>';
  }
  if (item.category === 'Home') {
    return '<span class="material-symbols-outlined">cottage</span>';
  }
  if (item.category === 'Work') {
    return '<span class="material-symbols-outlined">apartment</span>';
  }

  return '';
}

// Iterating through item list and moving all isChecked items to end of array
function moveCheckedToEnd() {
  for (let i = 0; i < filteredList.length; i++) {
    const checkedItemIndex = filteredList.findIndex((item) => item.isChecked === true);
    filteredList.push(filteredList.splice(checkedItemIndex, 1)[0]);
  }
}

// Rendering itemList to main
function renderList(): void {
  todoItemsContainer.innerHTML = '';

  sortItemList();
  filterCategories();
  moveCheckedToEnd();

  for (let i = 0; i < filteredList.length; i++) {
    const item = filteredList[i];
    const isChecked = checkIfChecked(item);
    const deadline = calculateDeadline(item);
    const closeDeadline = checkIfCloseDeadline(deadline[0]);
    const renderDeadline = deadlineToString(deadline[0]);

    const categoryIcon = checkCategoryIcon(item);

    if (item.title !== undefined && item.category !== undefined) {
      todoItemsContainer.innerHTML += `
      <article id="${i}" class="todo-item${isChecked}${closeDeadline}">

        <button>
          <span id="${i}" class="material-symbols-outlined check-item-btn">task_alt</span>
        </button>

        <p>${categoryIcon}${item.title}</p>

        <p class="deadline-date">Deadline: ${deadline[1]}</p>
        <p class="item-category">Category: ${item.category}</p>
        <p class="date-added-date">Date added: ${deadline[2]}</p>

        <div class="time-left">
          <span class="material-symbols-outlined">hourglass_empty</span>
          <span>${renderDeadline}</span>
        </div>

        <button>
          <span id="${i}" class="material-symbols-outlined remove-item-btn">do_not_disturb_on</span>
        </button>
      
      </article>
      `;
    }
  }

  buildCategoryList();
  addEventListeners();
  saveData();
}

// Opens clicked item for details of item.
function openItemDetails(e: Event): void {
  const target = e.currentTarget as HTMLDivElement;
  const item = document.querySelector('.todo-item.open') as HTMLDivElement;

  if (item !== null) {
    if (target.id === item.id) {
      target.classList.toggle('open');
      return;
    }
    item.classList.remove('open');
    target.classList.add('open');
  }
  target.classList.add('open');
}

// Removing item from itemList
function removeItem(e: Event): void {
  const button = e.currentTarget as HTMLSpanElement;
  const buttonID = Number(button.id);

  itemList.splice(buttonID, 1);
  renderList();
}

// Marking a toDo as done
function checkItem(e: Event): void {
  const button = e.currentTarget as HTMLSpanElement;
  const buttonID = Number(button.id);
  const item = filteredList[buttonID];

  if (item.isChecked) {
    item.isChecked = false;
  } else {
    item.isChecked = true;
  }

  renderList();
}

// Visually marking an checked item
function checkIfChecked(item: Item): string {
  if (item.isChecked) {
    return ' checked';
  }
  return '';
}

// Add eventlisteners after rendering items
function addEventListeners(): void {
  const items = document.querySelectorAll('.todo-item') as NodeList;
  const removeItemBtns = document.querySelectorAll('.remove-item-btn') as NodeList;
  const checkItemBtns = document.querySelectorAll('.check-item-btn') as NodeList;
  const categoriesBtns = document.querySelectorAll('.category-btn') as NodeList;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.addEventListener('click', openItemDetails);
  }

  for (let i = 0; i < removeItemBtns.length; i++) {
    const removeItemBtn = removeItemBtns[i];
    removeItemBtn.addEventListener('click', removeItem);
  }

  for (let i = 0; i < checkItemBtns.length; i++) {
    const removeItemBtn = checkItemBtns[i];
    removeItemBtn.addEventListener('click', checkItem);
  }

  for (let i = 0; i < categoriesBtns.length; i++) {
    const categoryBtn = categoriesBtns[i];
    categoryBtn.addEventListener('click', changeFilterCategories);
  }
}

// Clear form-inputs
function clearForm(): void {
  addContainer?.classList.remove('open');
  addItemBtn?.setAttribute('disabled', 'true');
  titleInput.value = '';
  categoryInput.value = '';
  dateInput.value = '';
  addContainer.style.visibility = 'hidden';
}

// Add toDo item from form to itemList
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

// Takes todays date and puts it as min value of date input
function dateInputMinDate(): void {
  const date = new Date();
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);

  dateInput.setAttribute('min', `${year}-${month}-${day}`);
}

// LOCAL STORAGE

// Save itemList to localStorage
function saveData(): void {
  localStorage.setItem('data', JSON.stringify(itemList));
}

// Load itemList from localStorage
function loadData(): void {
  itemList = JSON.parse(localStorage.getItem('data') || '[]') as [];
}

/* **********************LOGIC********************** */

// HEADER EVENTLISTENERS
sortBtn?.addEventListener('click', openContainer);
categoriesBtn?.addEventListener('click', openContainer);
addBtn?.addEventListener('click', openContainer);

// ADD ITEM EVENTLISTENERS
titleInput?.addEventListener('blur', validateForm);
categoryInput?.addEventListener('blur', validateForm);
dateInput?.addEventListener('change', validateForm);
addItemBtn?.addEventListener('click', addItemToList);

// SORT ITEM EVENTLISTENERS
sortByNameBtn.addEventListener('click', changeSortItemList);
sortByDeadlineBtn.addEventListener('click', changeSortItemList);
sortByDateAddedBtn.addEventListener('click', changeSortItemList);

loadData();
dateInputMinDate();
renderList();
