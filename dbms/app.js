// ...AUTH LOGIC START (assume you already have these elements)...
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toggleAuth = document.getElementById('toggle-auth');
const authError = document.getElementById('auth-error');
const authTitle = document.getElementById('auth-title');
let isAuthenticated = false; // Track login state

function showAuthModal() {
  authModal.style.display = 'flex';
  setTimeout(() => authModal.querySelector('.modal-content').style.animation = 'modalFadeIn 0.4s', 10);
  // Optionally, hide or disable rest of the app UI here if needed
}
function hideAuthModal() {
  authModal.style.display = 'none';
  authError.textContent = '';
  isAuthenticated = true;
  // Now initialize the app UI
  enableTaskMasterUI();
}

toggleAuth.onclick = () => {
  if (loginForm.style.display !== 'none') {
    loginForm.style.display = 'none';
    registerForm.style.display = '';
    authTitle.textContent = 'Register';
    toggleAuth.textContent = 'Already have an account? Login here';
  } else {
    loginForm.style.display = '';
    registerForm.style.display = 'none';
    authTitle.textContent = 'Login';
    toggleAuth.textContent = 'No account? Register here';
  }
  authError.textContent = '';
};

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) {
    authError.textContent = "Please enter username and password.";
    return;
  }
  const resp = await fetch('api.php?auth=login', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  }).then(r => r.json());
  if (resp.success) {
    hideAuthModal();
  } else {
    authError.textContent = resp.error || "Login failed.";
  }
};

registerForm.onsubmit = async (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value;
  if (!username || !password) {
    authError.textContent = "Please enter username and password.";
    return;
  }
  const resp = await fetch('api.php?auth=register', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  }).then(r => r.json());
  if (resp.success) {
    authError.style.color = "var(--secondary-color)";
    authError.textContent = "Registered! You can now login.";
    setTimeout(() => {
      toggleAuth.click();
      authError.style.color = "var(--accent-color)";
      authError.textContent = '';
    }, 1200);
  } else {
    authError.textContent = resp.error || "Registration failed.";
  }
};

// Only show modal on initial load
window.addEventListener('DOMContentLoaded', () => {
  showAuthModal();
});

// --- AUTH LOGIC END ---

// This function enables the main app UI after login/register
function enableTaskMasterUI() {
  // All your TaskMaster UI initialization goes here
  // Example: attach event listeners, load tasks, etc.
  loadTasks();

  // Example: attach event listeners for buttons if needed
  document.getElementById('add-subject-btn').onclick = () => {
    // your logic to add a subject
  };
  document.getElementById('show-team-btn').onclick = () => {
    // your logic to show the team modal
  };

  // Enable any other app features here
}
// --- AUTH LOGIC END ---

// ... rest of your existing TaskMaster JS code ...

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
