const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

async function loadTasks() {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();

  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    li.innerHTML = `
      <span class="task-title ${task.completed ? 'completed' : ''}">
        ${task.title}
      </span>

      <div class="task-actions">
        <button
          class="complete-btn"
          onclick="toggleTask(${task.id}, ${task.completed})"
        >
          ${task.completed ? 'Pendiente' : 'Completar'}
        </button>

        <button
          class="delete-btn"
          onclick="deleteTask(${task.id})"
        >
          Eliminar
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

async function addTask() {
  const title = taskInput.value.trim();

  if (!title) {
    alert('Escribe una tarea');
    return;
  }

  await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });

  taskInput.value = '';
  loadTasks();
}

async function toggleTask(id, completed) {
  await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      completed: !completed
    })
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  });

  loadTasks();
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

loadTasks();