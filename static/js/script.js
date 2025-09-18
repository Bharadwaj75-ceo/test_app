// static/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch and display tasks on page load
    const fetchTasks = async () => {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        taskList.innerHTML = ''; // Clear the list before rendering
        tasks.forEach(renderTask);
    };

    // Render a single task to the DOM
    const renderTask = (task) => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        if (task.completed) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

        const span = document.createElement('span');
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    };

    // Add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text === '') return;

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text }),
        });

        if (response.ok) {
            const newTask = await response.json();
            renderTask(newTask);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    // Toggle task completion status
    const toggleTask = async (id, completed) => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: completed }),
        });
        
        if (response.ok) {
            const li = document.querySelector(`li[data-id='${id}']`);
            li.classList.toggle('completed', completed);
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            const li = document.querySelector(`li[data-id='${id}']`);
            li.remove();
        }
    };

    // Initial fetch of tasks
    fetchTasks();
});