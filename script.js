import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase.js';

// Check if user is logged in and set welcome message
document.addEventListener("DOMContentLoaded", function() {
    onAuthStateChanged(auth, (user) => {
        const welcomeMessage = document.getElementById("welcomeMessage");

        if (user) {
            // User is logged in
            document.getElementById("loginOverlay").style.display = "none";
            if (welcomeMessage) {
                welcomeMessage.style.display = "inline";
                welcomeMessage.textContent = `Welcome, ${user.email}`;
            }
        } else {
            // No user is logged in
            if (window.location.pathname !== "/index.html") {
                window.location.href = "index.html";
            }
        }
    });
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

    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in
            document.getElementById("loginOverlay").style.display = "none";
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.display = "inline";
                welcomeMessage.textContent = `Welcome, ${username}`;
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/user-not-found") {
                document.getElementById("loginError").textContent = "User not found. Please sign up.";
            } else if (errorCode === "auth/wrong-password") {
                document.getElementById("loginError").textContent = "Incorrect password.";
            } else {
                document.getElementById("loginError").textContent = "Error: " + error.message;
            }
        });
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

    createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed up
            document.getElementById("loginOverlay").style.display = "none";
            const welcomeMessage = document.getElementById("welcomeMessage");
            if (welcomeMessage) {
                welcomeMessage.style.display = "inline";
                welcomeMessage.textContent = `Welcome, ${username}`;
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
                document.getElementById("signupError").textContent = "User already exists. Please log in.";
            } else {
                document.getElementById("signupError").textContent = "Error: " + error.message;
            }
        });
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
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

// Get current user
function getCurrentUser() {
    const user = auth.currentUser;
    return user ? user.email : null;
}
function getCurrentUser() {
    return localStorage.getItem("loggedInUser");
}
