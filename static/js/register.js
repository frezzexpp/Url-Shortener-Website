document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register-btn").addEventListener("click", function (e) {
        e.preventDefault();

        let username = document.getElementById("username").value;
        let email = document.getElementById("email").value;
        let firstname = document.getElementById("firstname").value;
        let lastname = document.getElementById("lastname").value;
        let password = document.getElementById("password").value;
        let password2 = document.getElementById("password2").value;

        if (password !== password2) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Passwords do not match!",
            });
            return;
        }

        fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                first_name: firstname,
                last_name: lastname,
                password: password,
                password2: password2,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);

            if (data.token || data.message) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "Account created successfully!",
                });
                setTimeout(() => {
                    window.location.href = "http://127.0.0.1:5500/templates/main.html";
                }, 2000);
            } else {
                let errorMsg = data.detail || "Something went wrong!";
                if (data.password2) errorMsg = data.password2.join(" ");
                if (data.username) errorMsg = data.username.join(" ");  // ✅ Username band bo‘lsa xabar berish

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: errorMsg,
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to register. Please try again!",
            });
        });
    });
});
