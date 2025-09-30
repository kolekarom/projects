const API_URL = '/api/todos';

async function fetchTodos() {
  const res = await fetch(API_URL);
  const todos = await res.json();
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'done' : '';
    li.textContent = todo.title;
    li.onclick = () => toggleTodo(todo);
    list.appendChild(li);
  });
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  if (!input.value) return;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value, completed: false })
  });
  input.value = '';
  fetchTodos();
}

async function toggleTodo(todo) {
  await fetch(`${API_URL}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...todo, completed: !todo.completed })
  });
  fetchTodos();
}

// Load todos on page start
fetchTodos();
