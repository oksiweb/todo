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
    loadTasks();
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.errorCode);
  };
}

export function addTask(taskText, description, date) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.add({
    text: taskText,
    description: description,
    date,
    completed: false,
  });

  request.onsuccess = function () {
    console.log("Task added to the database:", taskText);
    loadTasks();
  };

  request.onerror = function (event) {
    console.error("Error adding task:", event.target.errorCode);
  };
}

export function loadTasks() {
  const titleFilter = document.getElementsByClassName("task-filter-by-title")[0]
    .value;
  const dateFilter = document.getElementsByClassName("task-filter-by-date")[0]
    .value;

  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";
  const transaction = db.transaction(["tasks"], "readonly");
  const objectStore = transaction.objectStore("tasks");

  objectStore.openCursor().onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      const task = cursor.value;
      const taskText = task.text.toLowerCase();
      const taskDate = task.date;

      // Apply filters if they are provided
      const titleMatches = titleFilter
        ? taskText.includes(titleFilter.toLowerCase())
        : true;
      const dateMatches = dateFilter ? taskDate === dateFilter : true;

      if (titleMatches && dateMatches) {
        displayTask(task);
      }
      cursor.continue();
    }
  };
}

export function toggleTaskCompletion(taskId, taskRow, checkboxCircle) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");
  const request = objectStore.get(taskId);

  request.onsuccess = function (event) {
    const task = event.target.result;
    if (task) {
      task.completed = !task.completed;
      const updateRequest = objectStore.put(task);
      updateRequest.onsuccess = function () {
        taskRow.classList.toggle("completed", task.completed);
        checkboxCircle.classList.toggle("completed", task.completed);
        taskRow
          .querySelector(".task-content")
          .classList.toggle("completed", task.completed);
        console.log("Task completion status toggled successfully!");
      };
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching task for update:", event.target.errorCode);
  };
}

export function deleteTask(taskId) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.delete(taskId);

  request.onsuccess = function () {
    console.log("Task deleted from the database, ID:", taskId);
    loadTasks();
  };
  request.onerror = function (event) {
    console.error("Error deleting task:", event.target.errorCode);
  };
}

export function editTask(taskId, newText, newDescription, newDate) {
  const transaction = db.transaction(["tasks"], "readwrite");
  const objectStore = transaction.objectStore("tasks");

  const request = objectStore.get(taskId);

  request.onsuccess = function (event) {
    const task = event.target.result;
    if (task) {
      task.text = newText;
      task.description = newDescription;
      task.date = newDate;
      const updateRequest = objectStore.put(task);

      updateRequest.onsuccess = function () {
        console.log("Task updated successfully:", newText);
        loadTasks();
      };
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching task for edit:", event.target.errorCode);
  };
}
