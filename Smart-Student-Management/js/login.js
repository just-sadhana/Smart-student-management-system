function login() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("error");

    if (username === "admin" && password === "admin123") {

        localStorage.setItem("loggedIn", "true");
window.location.href = "dashboard.html";

    } else {

        error.textContent = "Invalid Username or Password";

    }

}