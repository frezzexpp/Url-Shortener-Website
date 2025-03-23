document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register-btn").addEventListener("click", function (e) {
        e.preventDefault();

        let username = document.getElementById("username").value.trim();
        let email = document.getElementById("email").value.trim();
        let firstname = document.getElementById("firstname").value.trim();
        let lastname = document.getElementById("lastname").value.trim();
        let password = document.getElementById("password").value.trim();
        let password2 = document.getElementById("password2").value.trim();

        if (!username || !email || !firstname || !lastname || !password || !password2) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Warning!",
                text: "Please fill in all fields!",
                confirmButtonColor: "#ffc107",
                confirmButtonText: "OK"
            });
            return;
        }

        if (password !== password2) {
            Swal.fire({
                icon: "error",
                title: "❌ Error!",
                text: "Passwords do not match!",
                confirmButtonColor: "#d33",
                confirmButtonText: "Try Again"
            });
            return;
        }

        Swal.fire({
            title: "⏳ Please wait...",
            text: "Registering your account...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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
        .then(response => response.json().then(data => ({ status: response.status, body: data }))) // Return response status
        .then(({ status, body }) => {
            Swal.close(); // Close loading modal

            if (status === 201) {
                Swal.fire({
                    icon: "success",
                    title: "✅ Success!",
                    text: body.detail || "Account created successfully!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => {
                    window.location.href = "login.html";
                });
            } else {
                let errorMsg = "An error occurred!";

                if (body.detail) {
                    errorMsg = body.detail;
                } else if (body.non_field_errors) {
                    errorMsg = body.non_field_errors.join(" ");
                } else if (body.username) {
                    errorMsg = body.username.join(" ");
                } else if (body.email) {
                    errorMsg = body.email.join(" ");
                } else if (body.password) {
                    errorMsg = body.password.join(" ");
                } else if (body.password2) {
                    errorMsg = body.password2.join(" ");
                }

                Swal.fire({
                    icon: "error",
                    title: "❌ Error!",
                    html: `<strong>${errorMsg}</strong>`,
                    confirmButtonColor: "#d33",
                    confirmButtonText: "Close"
                });
            }
        })
        .catch(error => {
            Swal.close(); // Close loading modal

            Swal.fire({
                icon: "error",
                title: "❌ Error!",
                text: "An error occurred during registration. Please try again!",
                confirmButtonColor: "#d33",
                confirmButtonText: "Close"
            });

            console.error("Error:", error);
        });
    });
});


document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", function() {
        let passwordField = this.previousElementSibling; // Oldingi inputni olish
        if (passwordField.type === "password") {
            passwordField.type = "text";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        } else {
            passwordField.type = "password";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        }
    });
});
