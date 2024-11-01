import {
  openDatabase,
  addTask,
  deleteTask,
  toggleTaskCompletion,
} from "./db.js";

// Function to display a task on the page
export function displayTask(task) {
  const taskList = document.querySelector(".task-list");

  const taskRow = document.createElement("div");
  taskRow.className = "task-row";
  taskRow.dataset.id = task.id;

  // Apply the "checked" class if the task is completed
  const completedClass = task.completed ? "completed" : "";

  taskRow.innerHTML = `
        <div class="checkbox-circle ${completedClass}">
            <span class="checkmark">✓</span>
        </div>
        <div class="task-content ${completedClass}">
            <span class="task-text">${task.text}</span>
        </div>
        <div class="task-controls">
            <button class="delete-button">Delete</button>
        </div>
    `;

  // Toggle completion status when the checkbox is clicked
  taskRow.querySelector(".checkbox-circle").onclick = function () {
    toggleTaskCompletion(task.id); // Toggle the completion status in IndexedDB
  };

  taskRow.querySelector(".task-content").onclick = function () {
    toggleTaskCompletion(task.id); // Toggle the completion status in IndexedDB
  };

  // Delete task when the delete button is clicked
  taskRow.querySelector(".delete-button").onclick = function () {
    deleteTask(task.id);
  };

  taskList.appendChild(taskRow);
}

// Function to delete a task from the database

// Event listener for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  openDatabase(); // Open the database when the page loads

  const addTaskButton = document.querySelector(".add-task-button");
  const taskContainer = document.querySelector(".task-container");
  const saveButton = document.querySelector(".save-button");
  const cancelButton = document.querySelector(".cancel-button");
  const taskInput = document.querySelector(".task-input");
  const taskList = document.querySelector(".task-list");

  // Show the task container and hide the add task button on click
  addTaskButton.addEventListener("click", function () {
    addTaskButton.style.display = "none";
    taskContainer.style.display = "block";
  });

  // Hide the task container and show the add task button on cancel click
  cancelButton.addEventListener("click", function () {
    taskContainer.style.display = "none";
    addTaskButton.style.display = "flex";
  });

  // Save task to the database when the save button is clicked
  saveButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    if (taskText) {
      addTask(taskText);
      taskInput.value = ""; // Clear the input field after saving
      taskContainer.style.display = "none";
      addTaskButton.style.display = "flex";
    }
  });
});
