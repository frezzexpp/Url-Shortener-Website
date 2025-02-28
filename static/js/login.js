document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", function () {
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value.trim();

        if (!username || !password) {
            Swal.fire({
                icon: "warning",
                title: "⚠️ Warning!",
                text: "Please enter your username and password!",
                confirmButtonColor: "#ffc107",
                confirmButtonText: "OK"
            });
            return;
        }

        Swal.fire({
            title: "⏳ Please wait...",
            text: "Logging in...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            Swal.close();

            if (status === 200 && (body.auth_token || body.token)) { 
                localStorage.setItem("token", body.auth_token || body.token);

                Swal.fire({
                    icon: "success",
                    title: "✅ Success!",
                    text: body.message || body.detail || "Login successful!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                }).then(() => window.location.href = "main.html");
            } else {
                throw body;
            }
        })
        .catch(error => {
            Swal.close();
            let errorMessage = error.message || error.detail || 
                (error.non_field_errors ? error.non_field_errors.join(" ") : "An unknown error occurred.");

            Swal.fire({
                icon: "error",
                title: "❌ Error!",
                html: `<strong>${errorMessage}</strong>`,
                confirmButtonColor: "#d33",
                confirmButtonText: "Close"
            });

            console.error("Error:", error);
        });
    });
});
