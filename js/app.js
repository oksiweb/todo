import {
  openDatabase,
  addTask,
  deleteTask,
  toggleTaskCompletion,
  editTask,
  loadTasks,
} from "./db.js";
import { sanitizeInput } from "./utils.js";

let editingTaskId = null;

export function displayTask(task) {
  const taskList = document.querySelector(".task-list");

  const taskRow = document.createElement("div");
  taskRow.className = "task-row";
  taskRow.dataset.id = task.id;

  const completedClass = task.completed ? "completed" : "";

  const formattedDate = task.date;

  taskRow.innerHTML = `
        <div class="checkbox-circle ${completedClass}">
            <span class="checkmark">✓</span>
        </div>
        <div class="task-content ${completedClass}">
            <span class="text">${task.text}</span>
            <span class="description">${task.description}</span>
            <span class="date">(${formattedDate})</span>
        </div>
        <div class="task-controls">
            <button type="button" class="edit-button">Edit</button>
            <button type="button" class="delete-button">Delete</button>
        </div> 
    `;

  const checkboxCircle = taskRow.querySelector(".checkbox-circle");

  checkboxCircle.addEventListener("click", (event) => {
    event.preventDefault();
    toggleTaskCompletion(task.id, taskRow, checkboxCircle);
  });

  taskRow.querySelector(".task-content").addEventListener("click", (event) => {
    event.preventDefault();
    toggleTaskCompletion(task.id, taskRow, checkboxCircle);
  });

  taskRow.querySelector(".delete-button").addEventListener("click", (event) => {
    event.preventDefault();
    deleteTask(task.id);
  });

  taskRow.querySelector(".edit-button").addEventListener("click", (event) => {
    event.preventDefault();
    const taskInput = document.querySelector(".task-title");
    const taskDescription = document.querySelector(".task-description");
    const taskDueDate = document.querySelector(".task-due-date");
    const taskContainer = document.querySelector(".task-container");
    const addTaskButton = document.querySelector(".add-task-button");

    taskInput.value = task.text;
    taskDescription.value = task.description;
    taskDueDate.value = task.date;
    editingTaskId = task.id;

    taskContainer.style.display = "block";
    addTaskButton.style.display = "none";
  });

  taskList.appendChild(taskRow);
}

document.addEventListener("DOMContentLoaded", function () {
  openDatabase();

  const addTaskButton = document.querySelector(".add-task-button");
  const taskContainer = document.querySelector(".task-container");
  const cancelButton = document.querySelector(".cancel-button");
  const taskInput = document.querySelector(".task-title");
  const taskDescription = document.querySelector(".task-description");
  const taskDueDate = document.querySelector(".task-due-date");
  const titleFilterInput = document.querySelector(".task-filter-by-title");
  const dateFilterInput = document.querySelector(".task-filter-by-date");

  addTaskButton.addEventListener("click", function (event) {
    event.preventDefault();
    addTaskButton.style.display = "none";
    taskContainer.style.display = "block";
  });

  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
    taskContainer.style.display = "none";
    addTaskButton.style.display = "flex";
  });

  taskContainer.addEventListener("submit", function (event) {
    event.preventDefault();

    let taskText = sanitizeInput(taskInput.value.trim());
    let description = sanitizeInput(taskDescription.value.trim());
    let date = sanitizeInput(taskDueDate.value);

    if (taskText && description && date) {
      if (editingTaskId) {
        editTask(editingTaskId, taskText, description, date);
        editingTaskId = null;
      } else {
        addTask(taskText, description, date);
      }
      taskContainer.reset();
      taskContainer.style.display = "none";
      addTaskButton.style.display = "flex";
    }
  });

  titleFilterInput.addEventListener("input", function (event) {
    event.preventDefault();
    loadTasks();
  });

  dateFilterInput.addEventListener("change", function (event) {
    event.preventDefault();
    loadTasks();
  });
});
