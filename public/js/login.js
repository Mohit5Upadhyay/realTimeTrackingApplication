document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    let valid = true;

    // Email validation
    if (!email.includes('@')) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        valid = false;
    } else {
        document.getElementById('email-error').textContent = '';
    }

    // Password validation
    if (password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
        valid = false;
    } else {
        document.getElementById('password-error').textContent = '';
    }

    // If form is valid, submit it (this is just a placeholder for the actual form submission logic)
    if (valid) {
        alert('Login successful!');
    }
});
