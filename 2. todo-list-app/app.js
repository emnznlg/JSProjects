//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");

//Event Listeners

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);

//Functions

function addTodo(e) {
  e.preventDefault();

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  todoDiv.innerHTML = `
                        <li>${todoInput.value}</li>
                        <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                        <button class="checked-btn"><i class="fa-solid fa-check"></i></button>
                    `;

  todoList.appendChild(todoDiv);
  todoInput.value = "";
}

function deleteCheck(e) {
  const item = e.target;

  if (item.classList[0] == "delete-btn") {
    const todoDiv = item.parentElement;
    todoDiv.classList.add("fall");
    todoDiv.addEventListener("transitionend", function () {
      todoDiv.remove();
    });
  } else {
    const todoDiv = item.parentElement;
    todoDiv.classList.toggle("completed");
  }
}
