document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log("Login response:", data); 

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        window.location.href = "dashboard.html";
    } else {
        alert("Login failed: " + data.message);
    }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("role").value;
    
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role })
    });
    
    const data = await response.json();
    console.log("Register response:", data); 
    
    if (response.ok) {
        alert("Registration successful! Please login.");
        window.location.href = "index.html";
    } else {
        alert("Registration failed: " + data.message);
    }
});
