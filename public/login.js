document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // Perform your validation here
    if (username === '' || password === '') {
        alert('Username and password are required.');
        return;
    }

    // If validation passes, submit the form
    this.submit();
});
