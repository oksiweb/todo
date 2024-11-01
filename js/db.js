import { displayTask } from "./app.js";
export let db;

export function openDatabase() {
  const request = indexedDB.open("ToDoAppDB", 1);

  request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("tasks")) {
      db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened successfully");
    loadTasks(); // Load tasks on startup
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
  };
}

// Function to add a new task to the database
export function addTask(taskText) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.add({ text: taskText, completed: false });

  request.onsuccess = function () {
    console.log("Task added to the database:", taskText);
    loadTasks(); // Reload tasks after adding
  };

  request.onerror = function (event) {
    console.error("Error adding task:", event.target.errorCode);
  };
}

// Function to load tasks from the database and display them
export function loadTasks() {
  const transaction = db.transaction(["tasks"], "readonly");
  const objectStore = transaction.objectStore("tasks");

  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = ""; // Clear existing tasks

  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const task = cursor.value;
      displayTask(task); // Display each task
      cursor.continue();
    }
  };
}

export function deleteTask(taskId) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.delete(taskId);

  request.onsuccess = function () {
    console.log("Task deleted from the database, ID:", taskId);
    loadTasks(); // Reload tasks after deletion
  };

  request.onerror = function (event) {
    console.error("Error deleting task:", event.target.errorCode);
  };
}
