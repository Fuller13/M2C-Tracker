// Simulated user database (in a real app, this would be a backend database)
const users = {
    "chaos@transitiontracker.com": { password: "admin", isAdmin: true }
};

// Check if user is logged in
document.addEventListener("DOMContentLoaded", function() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser && window.location.pathname !== "/index.html") {
        window.location.href = "index.html";
    } else if (loggedInUser && window.location.pathname === "/index.html") {
        document.getElementById("loginOverlay").style.display = "none";
    }
});

// Login form submission
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        document.getElementById("loginError").textContent = "Please enter a valid email address.";
        return;
    }

    if (!users[username]) {
        document.getElementById("loginError").textContent = "User not found. Please sign up.";
        return;
    }

    if (users[username].password !== password) {
        document.getElementById("loginError").textContent = "Incorrect password.";
        return;
    }

    localStorage.setItem("loggedInUser", username);
    document.getElementById("loginOverlay").style.display = "none";
});

// Signup form submission
document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        document.getElementById("signupError").textContent = "Username must be a valid email.";
        return;
    }

    // Validate password (at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
        document.getElementById("signupError").textContent = "Password must contain at least one letter and one number.";
        return;
    }

    if (users[username]) {
        document.getElementById("signupError").textContent = "User already exists. Please log in.";
        return;
    }

    users[username] = { password: password, isAdmin: false };
    localStorage.setItem("loggedInUser", username);
    document.getElementById("loginOverlay").style.display = "none";
});

// Show signup form
function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
    document.getElementById("loginError").textContent = ""; // Clear login errors
}

// Show login form
function showLogin() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("signupError").textContent = ""; // Clear signup errors
}

// Logout
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Get current user
function getCurrentUser() {
    return localStorage.getItem("loggedInUser");
}
// Get current user
function getCurrentUser() {
    return localStorage.getItem("loggedInUser");
}
