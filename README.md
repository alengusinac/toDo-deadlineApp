# toDO - an app by Alen Gusinac

Keeping track of deadlines.

## Walkthrough

First screen shows a header with 3 main buttons for sorting, choosing category filter and adding toDo item.
Beneath the header is the main item list that at first sight contains the items title and days until deadline.

### Item container

An item container contains 2 buttons, check and remove, item titel and days until deadline.
When container is clicked the container expands to expose deadline date, category and date when item was added.

### Add item container

The add item container slides in from right when the + in the upper right corner is clicked.
It contains of 3 input fields, title, category and deadline date togheter with a submit button that will add the item to the item list array and close the add item container.

All inputs are required and validated by not being empty.

The category input is a text field with options where you can write a new category or choose one of the existing categorys in other items.
If there is no other item the category input will be empty.

The date input wants and input of YYYY/MM/DD or you can choose date through a calender. Not possible to choose a date before todays date.

When all inputs are validated the submit buttons is enabled.

### Category container

The category container slides in from top when the middle button in the header is clicked.

The category container will always have a button for 'all categories' and under that will existing categories come up.
If item list is empty there will be no other buttons.
When a category is choosen the item list will filter and only show item with the selected category.

### Sort container

The sort container slides in from left when the button in the upper left corner is clicked.

The container contains 3 buttons, by Name, by Deadline and by Date added and when pushed sorts the item list by just that.
When the same button is pushed twice the list will sort in reversed order.
