document.getElementById("loginBtn").addEventListener("click", function() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Login successful!",
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "http://127.0.0.1:5500/templates/main.html";
            });

        } else {
            throw { detail: "Invalid username or password!" };
        }
    })
    .catch(error => {
        let errorMessage = "Something went wrong. Please try again.";

        if (error.detail) {
            errorMessage = error.detail;
        }

        Swal.fire({
            icon: "error",
            title: "Error!",
            text: errorMessage
        });

        console.error("Error:", error);
    });
});
