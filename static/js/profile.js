document.addEventListener("DOMContentLoaded", function () {
    let token = localStorage.getItem("token"); // Tokenni olish

    if (!token) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "You are not logged in!",
            confirmButtonText: "OK"
        }).then(() => {
            window.location.href = "login.html"; // Login sahifasiga yo'naltirish
        });
        return;
    }

    // Profil ma'lumotlarini olish
    fetch("http://127.0.0.1:8000/api/profile/", {
        method: "GET",
        headers: {
            "Authorization": "Token " + token,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        return response.json();
    })
    .then(data => {
        // Profil ma'lumotlarini HTML elementlariga joylash
        document.getElementById("username").textContent = data.username;
        document.getElementById("email").textContent = data.email;
        document.getElementById("first-name").textContent = data.first_name;
        document.getElementById("last-name").textContent = data.last_name;
    })
    .catch(error => {
        console.error("Error fetching profile:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load profile. Please try again later.",
            confirmButtonText: "OK"
        });
    });
});
