const User = require('./Models/signup'); // Import the User model defined in your signup model file

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission
        
        // Retrieve form data
        const fullName = document.getElementById("fullname").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // Prepare data for submission
        const formData = {
            fullName: fullName,
            username: username,
            email: email,
            password: password
        };

        // Send form data to the server
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                // Redirect or show success message
                window.location.href = '/success'; // Redirect to success page
            } else {
                // Handle failed registration
                return response.json().then(error => {
                    throw new Error(error.message);
                });
            }
        })
        .then(data => {
            // Add the signed-up user to the database
            return User.create({
                fullName: data.fullName,
                username: data.username,
                email: data.email,
                password: data.password,
                profilePicture: data.profilePicture
            });
        })
        .then(() => {
            console.log('User added to database successfully');
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
