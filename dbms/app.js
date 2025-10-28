// Minimal TaskMaster app.js with MySQL backend via api.php

// Load all tasks on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});

function loadTasks() {
  fetch('api.php')
    .then(response => response.json())
    .then(tasks => {
      // Example: Print tasks to console, or build your UI here
      console.log("Loaded tasks:", tasks);
      // You can loop through tasks and display them in the DOM
      // For example:
      const container = document.getElementById('subjects-container');
      container.innerHTML = '';
      tasks.forEach(task => {
        const div = document.createElement('div');
        div.textContent = `Task: ${task.content} (Subject: ${task.subject_id})`;
        container.appendChild(div);
      });
    })
    .catch(err => console.error("Failed to fetch tasks:", err));
}

// Example: Add a new task (call this from your add task button)
function addTask(subjectId, content) {
  fetch('api.php', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject_id: subjectId, content: content })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert("Task added!");
      loadTasks(); // Refresh tasks
    } else {
      alert("Failed to add task.");
    }
  })
  .catch(err => alert("Error: " + err));
}

// Example usage (for testing)
// addTask(1, 'Test task from JS');