let todo = JSON.parse(localStorage.getItem("todo")) || []; //string --> array

// const todo = [
//   { text: "งาน", meta: { done: false } }, // index 0
//   { text: "เล่นเกม", meta: { done: true } } // index 1
// ];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// State Menagement
function setTodo(newTodo){
    todo = newTodo;
    saveToLocalStorage();
    render();
}

// Pure Function
function addTaskLogic(todo, text){
    return [...todo, { text, disabled: false}];
}

// map --> ต้องใช้ array

function toggleTaskLogic (todo, index) {
    return todo.map((item, i) =>
        i === index ? { ...item, disabled: !item.disabled } : item
    );
    // { text: "B", disabled: false } --> { text: "B", disabled: true } or alternate
}

function editTaskLogic (todo, index, newText) {
    return todo.map((item, i) =>
        i === index ? { ...item, text: newText} : item 
    );
}

function deleteAllLogic () {
    return [];
}

// UI and Event
function getTodoHTML (todo) {
    return todo.map((item, index) => `
        <div class="todo-container" data-index="${index}">
            <input type="checkbox" class="todo-checkbox" ${item.disabled ? "checked" : ""}>\

            <p class="todo-text ${item.disabled ? "disabled" : ""}">${item.text}</p>
        </div>
    `)
    .join("");
}

function render() {
    todoList.innerHTML = getTodoHTML(todo);
    todoCount.textContent = todo.length;
}

// Event
document.addEventListener("DOMContentLoaded", () =>{
    render();

    addButton.addEventListener("click", handleAdd);

    todoInput.addEventListener("keydown", (e) =>{
        if (e.key === "Enter"){
            handleAdd();
        }
    });

    deleteButton.addEventListener("click", () =>{
        setTodo(deleteAllLogic());
    });

    //Event Delegation
    todoList.addEventListener("click", handleListClick);
    todoList.addEventListener("change", handleCheckbox);
});

function handleAdd(){
    const text = todoInput.value.trim();
    if (!text) return;

    setTodo(addTaskLogic(todo, text));
    todoInput.value = "";
}

function handleCheckbox(e) {
    if (!e.target.classList.contains("todo-checkbox")) return; //ไม่มี checked ให้ออก

    const index = +e.target.closest(".todo-container").dataset.index; // หา parent ที่ใกล้สุด 
    setTodo(toggleTaskLogic(todo, index));
}

function handleListClick(e){
    if (!e.target.classList.contains("todo-text")) return;

    const container = e.target.closest(".todo-container");
    const index = container.dataset.index;

    const input = document.createElement("input")
    input.value = todo[index].text;

    e.target.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () =>{
        const newText = input.value.trim();
        if(newText){
            setTodo(editTaskLogic(todo, index, newText));
        }else{
            render();
        }
    });
}

function saveToLocalStorage(){
    localStorage.setItem("todo", JSON.stringify(todo));
}
