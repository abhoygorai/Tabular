function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

async function Login(event) {
    event.preventDefault();

    console.log("login called")
    
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    console.log(username, password)

    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        if (response.ok) {
            const data = await response.json();  
            window.location.href = 'secondPage.html';
            // Handle successful registration here
        } else{
            console.log('Login failed');        
            alert('Login failed');
            // Handle registration failure here
        }
    } catch (error) {
        console.log(error)
    }
}

async function Register(event) {
    event.preventDefault();

    console.log("register called")
    
    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;
    const signupConfirmPassword = document.getElementById("signupConfirmPassword").value;

    console.log(username, password, signupConfirmPassword)

    if (password !== signupConfirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {

        const response = await fetch('http://127.0.0.1:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);        
            alert('Registration successful:', data);
            // Handle successful registration here
        } else {
            console.log('Registration failed');        
            alert('Registration failed');
            // Handle registration failure here
        }
    } catch (error) {
        console.log(error)
    }
}