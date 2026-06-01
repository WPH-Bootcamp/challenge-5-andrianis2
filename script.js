class Todo {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  toggleStatus() {
    this.completed = !this.completed;
  }
}

class TodoList {
  constructor() {
    this.tasks = [];
    this.listElement = document.getElementById('todoList');
    this.messageElement = document.getElementById('message');
  }

  addTask(title) {
    if (!title || title.trim() === '') {
      throw new Error('Tugas tidak boleh kosong!');
    }

    const todo = new Todo(Date.now(), title.trim());

    this.tasks.push(todo);
    this.render();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.render();
  }

  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.toggleStatus();
    }
    this.render();
  }

  render() {
    this.listElement.innerHTML = '';

    if (this.tasks.length === 0) {
      this.listElement.innerHTML = '<li>Belum ada tugas</li>';
      return;
    }

    this.tasks.forEach((task) => {
      const li = document.createElement('li');

      li.innerHTML = `
        <span class='${task.completed ? 'completed' : ''}'>${task.title}</span>
        <div>
          <button class='toggle-btn'>${task.completed ? 'Undo' : 'Done'}</button>
          <button class='delete-btn'>Hapus</button>
        </div>
      `;

      li.querySelector('.toggle-btn').addEventListener('click', () => {
        this.toggleTask(task.id);
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteTask(task.id);
      });

      this.listElement.appendChild(li);
    });
  }

  showMessage(msg) {
    this.messageElement.textContent = msg;

    setTimeout(() => {
      this.messageElement.textContent = '';
    }, 3000);
  }

  async loadInitialData() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=5'
      );
      if (!response.ok) {
        throw new Error('Gagal mengambil data...');
      }

      const data = await response.json();
      this.tasks = data.map(
        (item) => new Todo(item.id, item.title, item.completed)
      );

      this.render();
    } catch (error) {
      console.error(error);
      this.showMessage('Gagal mengambil data dari server.');
    }
  }
}

//Tahap Inisialisasi
const todoList = new TodoList();
todoList.loadInitialData();

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');

addBtn.addEventListener('click', (event) => {
  try {
    todoList.addTask(taskInput.value);
    taskInput.value = '';
  } catch (error) {
    todoList.showMessage(error.message);
  }
});

taskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addBtn.click();
  }
});
