document.addEventListener('DOMContentLoaded', () => {
    // Handling registration form submission with validation
    const registerForm = document.getElementById('registerForm');
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

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = emailInput.value;
            const password = passwordInput.value;

            // Additional validation checks before submitting
            if (emailError.textContent || passwordError.textContent) {
                return;
            }

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                alert('Successfully registered!');
                window.location.href = '/';
            } else {
                alert('Registration failed!');
            }
        });
    }

    // Handling login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                window.location.href = '../dashboard.html';
            } else {
                alert('Login failed!');
            }
        });
    }

    // Redirect to registration page
    const signUpBtn = document.getElementById('signUpBtn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', () => {
            window.location.href = '/register.html';
        });
    }

    // Cancel button to redirect to the main page
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // Handle logout from the dashboard
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/';
        });
    }
});
