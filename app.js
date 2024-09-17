document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const completedTaskList = document.getElementById("completedTaskList");
  const tasksSection = document.getElementById("tasksSection");
  const completedTasksSection = document.getElementById(
    "completedTasksSection"
  );
  const noTaskMessage = document.getElementById("noTaskMessage");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const editTaskInput = document.getElementById("editTaskInput");
  const saveTaskBtn = document.getElementById("saveTaskBtn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskToEditIndex = null; // To track which task is being edited

  const renderTasks = () => {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    const activeTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    // Show or hide sections based on tasks count
    if (activeTasks.length === 0 && completedTasks.length === 0) {
      noTaskMessage.classList.remove("hidden");
      tasksSection.classList.add("hidden");
      completedTasksSection.classList.add("hidden");
    } else {
      noTaskMessage.classList.add("hidden");
      tasksSection.classList.toggle("hidden", activeTasks.length === 0);
      completedTasksSection.classList.toggle(
        "hidden",
        completedTasks.length === 0
      );
    }

    // Render active tasks
    activeTasks.forEach((task) => {
      const index = tasks.indexOf(task); // Correct index from the main tasks array
      const taskItem = document.createElement("li");
      taskItem.className = "active";
      taskItem.innerHTML = `
                <span>${task.name}</span>
                <div class="actions">
                    <i class="fas fa-pen" onclick="editTask(${index})"></i>
                    <i class="fas fa-trash" onclick="deleteTask(${index})"></i>
                    <i class="fas fa-check" onclick="toggleComplete(${index})"></i>
                </div>
            `;
      taskList.appendChild(taskItem);
    });

    // Render completed tasks
    completedTasks.forEach((task) => {
      const index = tasks.indexOf(task); // Correct index from the main tasks array
      const taskItem = document.createElement("li");
      taskItem.className = "completed";
      taskItem.innerHTML = `
                <span>${task.name}</span>
                <div class="actions">
                    <i class="fas fa-trash" onclick="deleteTask(${index})"></i>
                    <i class="fas fa-undo" onclick="toggleComplete(${index})"></i>
                </div>
            `;
      completedTaskList.appendChild(taskItem);
    });
  };

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const addTask = () => {
    const task = taskInput.value.trim();
    if (task) {
      tasks.push({ name: task, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  };

  // Add task when clicking the "Add" button
  addTaskBtn.addEventListener("click", addTask);

  // Add task when pressing "Enter" key
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission behavior
      addTask(); // Add the task
    }
  });

  window.toggleComplete = (index) => {
    tasks[index].completed = !tasks[index].completed; // Toggle the completed state
    saveTasks();
    renderTasks();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1); // Delete the task
    saveTasks();
    renderTasks();
  };

  window.editTask = (index) => {
    taskToEditIndex = index;
    editTaskInput.value = tasks[index].name;
    editModal.classList.remove("hidden"); // Show modal
  };

  saveTaskBtn.addEventListener("click", () => {
    const updatedTaskName = editTaskInput.value.trim();
    if (updatedTaskName && taskToEditIndex !== null) {
      tasks[taskToEditIndex].name = updatedTaskName;
      taskToEditIndex = null;
      saveTasks();
      renderTasks();
      editModal.classList.add("hidden"); // Close modal
    }
  });

  // Save task when pressing "Enter" key in modal
  editTaskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveTaskBtn.click(); // Trigger save button
    }
  });

  closeModal.addEventListener("click", () => {
    editModal.classList.add("hidden");
  });

  renderTasks();
});
