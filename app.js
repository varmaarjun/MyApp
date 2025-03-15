document.addEventListener('DOMContentLoaded', () => {
  // Handle registration form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
      handleRegistrationForm(registerForm);
  }

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
      handleLoginForm(loginForm);
  }

  // Handle sign-up button click
  const signUpBtn = document.getElementById('signUpBtn');
  if (signUpBtn) {
      signUpBtn.addEventListener('click', () => {
          window.location.href = '/register.html';
      });
  }

  // Handle cancel button click
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
          window.location.href = '/';
      });
  }

  // Handle logout button click
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
          localStorage.removeItem('token');
          window.location.href = '/';
      });
  }

  // Load dashboard data if the user is logged in
  const token = localStorage.getItem('token');
  if (token) {
      loadDashboardData(token);
  }
});

// Function to handle registration form submission
function handleRegistrationForm(registerForm) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // Dynamic email validation
  emailInput.addEventListener('input', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
          emailError.textContent = 'Invalid email format';
      } else {
          emailError.textContent = '';
      }
  });

  // Dynamic password validation
  passwordInput.addEventListener('input', () => {
      if (passwordInput.value.length < 8) {
          passwordError.textContent = 'Password must be at least 8 characters';
      } else {
          passwordError.textContent = '';
      }
  });

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = emailInput.value;
      const password = passwordInput.value;

      // Additional validation checks before submitting
      if (emailError.textContent || passwordError.textContent) {
          return;
      }

      try {
          const response = await fetch('/.netlify/functions/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email, password }),
          });

          if (response.ok) {
              alert('Successfully registered!');
              window.location.href = '/';
          } else {
              const errorData = await response.json();
              alert(`Registration failed: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error during registration:', error);
          alert('Registration failed. Please try again later.');
      }
  });
}

// Function to handle login form submission
function handleLoginForm(loginForm) {
  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('/.netlify/functions/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
              const data = await response.json();
              localStorage.setItem('token', data.token);
              window.location.href = '/dashboard.html';
          } else {
              const errorData = await response.json();
              alert(`Login failed: ${errorData.message}`);
          }
      } catch (error) {
          console.error('Error during login:', error);
          alert('Login failed. Please try again later.');
      }
  });
}

// Function to load dashboard data
function loadDashboardData(token) {
  fetch('/.netlify/functions/dashboard', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to load dashboard data');
      }
      return response.json();
  })
  .then(data => {
      // Display user's first name
      const userFirstName = data.currentUser.name.split(' ')[0];
      document.getElementById('userFirstName').innerText = userFirstName;

      // Show admin panel button if user is admin
      if (data.currentUser.role === 'admin') {
          document.getElementById('adminPanelBtn').style.display = 'block';
      }

      // Populate the table with player data
      const playersTableBody = document.getElementById('playersTableBody');
      playersTableBody.innerHTML = ''; // Clear the table body

      // Sort players by total of matchesWins and momWins
      data.users.sort((a, b) => (b.matchesWins + b.momWins) - (a.matchesWins + a.momWins));

      data.users.forEach((player, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${player.name}</td>
              <td>${player.balance || 0}</td>
              <td>${player.matchesWins || 0}</td>
              <td>${player.matchesLost || 0}</td>
              <td>${player.momWins || 0}</td>
          `;
          playersTableBody.appendChild(row);
      });

      // Handle admin panel button click
      document.getElementById('adminPanelBtn').addEventListener('click', () => {
          window.location.href = '/admin-panel.html';
      });
  })
  .catch(error => {
      console.error('Error loading dashboard data:', error);
      alert('Failed to load dashboard. Please try again later.');
  });
}