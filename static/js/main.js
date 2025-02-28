//--- Profile Drop Town qismi:
$(document).ready(function () {
    // Profil tugmasini bosganda drop-down menyuni ko‘rsatish yoki yashirish
    $(".profile-btn").click(function (event) {
        event.stopPropagation();
        $(".profile-container").toggleClass("active");
    });

    // Tashqi joyga bosilganda drop-down menyuni yopish
    $(document).click(function (event) {
        if (!$(event.target).closest(".profile-container, .btn-profile").length) {
            $(".profile-container").removeClass("active");
        }
    });
});
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------



//--- Welcome User Text animation:
$(document).ready(function () {
    let tooltip = $("#welcome-tooltip");

    // Tooltipni ko‘rsatish
    tooltip.css({ opacity: "1", transform: "translateY(0)" });

    // 3 soniyadan keyin asta-asta yo‘q qilish
    setTimeout(() => {
        tooltip.css({ opacity: "0", transform: "translateY(0)" });

        // Animatsiya tugaganidan keyin elementni butunlay o‘chirish
        setTimeout(() => {
            tooltip.remove();
        }, 500); // CSS'dagi transition bilan mos ravishda 0.5s kutish
    }, 3000);
});
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------



// LOGOUT:
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout-btn").addEventListener("click", function () {
        let token = localStorage.getItem("token"); // To'g'ri nomdagi tokenni olish

        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "You are not logged in!",
                confirmButtonText: "OK"
            });
            return;
        }

        Swal.fire({
            title: "⏳ Logging out...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch("http://127.0.0.1:8000/api/logout/", {
            method: "POST",
            headers: {
                "Authorization": "Token " + token
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: "success",
                title: "Logged Out",
                text: data.detail || "You have been logged out successfully!",
                confirmButtonText: "OK"
            }).then(() => {
                localStorage.removeItem("token"); // Tokenni o‘chirish
                window.location.href = "login.html"; // Login sahifasiga yo‘naltirish
            });
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.detail || "Something went wrong! Try again later.",
                confirmButtonText: "OK"
            });
        });
    });
});
// ---------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------









$(document).ready(function () {
    function getAuthToken() {
        return localStorage.getItem("token") || "";
    }


function showMessage(type, message) {
    Swal.fire({
        icon: type === "success" ? "success" : "error",
        title: type === "success" ? "Muvaffaqiyat!" : "Xatolik!",
        text: message,
        showConfirmButton: true, // "OK" tugmasi qo‘shiladi
        confirmButtonText: "OK", // Tugma matni
        timer: null // Avtomatik yopilishni o‘chirib qo‘yamiz
    });
}



    function shortenUrl() {
        let originalUrl = $(".url-input").val().trim();
        if (!originalUrl) {
            showMessage("error", "Iltimos, URL kiriting!");
            return;
        }

        $.ajax({
            url: "http://127.0.0.1:8000/api/shorter/",
            method: "POST",
            contentType: "application/json",
            headers: { "Authorization": "Token " + getAuthToken() },
            data: JSON.stringify({ original_link: originalUrl }),
            success: function () {
                $(".url-input").val("");
                showMessage("success", "✅ URL muvaffaqiyatli qisqartirildi!");
                loadUserUrls();
            },
            error: function (xhr) {
                console.error(xhr);
                let errorMessage = "Xatolik yuz berdi! Tekshirib qayta urinib ko‘ring.";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                showMessage("error", errorMessage);
            }
        });
    }

    $(".shorten-btn").on("click", shortenUrl);
    $(".url-input").keypress(function (event) {
        if (event.which === 13) shortenUrl();
    });



    function loadUserUrls() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/shorten/list/",  // Foydalanuvchi URL'larini olish uchun endpoint
            method: "GET",
            headers: { "Authorization": "Token " + getAuthToken() },
            dataType: "json",
            success: function (data) {
                if (!Array.isArray(data.results)) {
                    console.error("Xatolik: API'dan kelgan data massiv emas!", data);
                    return;
                }

                let tableBody = $("#url-table-body");
                tableBody.empty();

                data.results.forEach(function (item) {
                    let qrCodeSrc = item.qr_code ? item.qr_code : "/static/img/image4.svg";
                    let row = `<tr>
                        <td class="body-text">${item.id}</td>
                        <td>
                            <a class="short-link" href="${item.short_link}" target="_blank" data-link="${item.short_link}">${item.short_link}</a>
                            <button class="copy-btn" data-link="${item.short_link}" aria-label="Copy link">
                                <i class="fas fa-copy"></i>
                            </button>
                        </td>
                        <td class="org-link"><a href="${item.original_link}" target="_blank">${item.original_link}</a></td>
                        <td><img class="qr-img" src="/static/img/image 4.svg" alt=""></td>
                        <td class="body-text">${item.clicks}</td>
                        <td><span class="status ${item.status ? 'active' : 'inactive'}">
                            ${item.status ? '<i class="fas fa-check-circle"></i> Active' : '<i class="fas fa-times-circle"></i> Inactive'}
                        </span></td>
                        <td class="body-text">${new Date(item.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="action-btn delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                            <button class="action-btn update-btn" data-id="${item.id}" data-url="${item.original_link}"><i class="fas fa-edit"></i></button>
                        </td>
                    </tr>`;
                    tableBody.append(row);
                });
            },
            error: function () {
                showMessage("error", "Ma'lumotlarni olishda xatolik yuz berdi!");
            }
        });
    }



   // ✅ DELETE tugmachasi uchun modal tasdiqlash oynasi
   $(document).on("click", ".delete-btn", function () {
    let urlId = $(this).data("id");
    if (!urlId) {
        showMessage("error", "ID topilmadi!");
        return;
    }

    Swal.fire({
        title: "Ishonchingiz komilmi?",
        text: "Bu URL butunlay o‘chiriladi!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ha, o‘chirilsin!",
        cancelButtonText: "Bekor qilish"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://127.0.0.1:8000/api/shorten/${urlId}/`,
                method: "DELETE",
                headers: { "Authorization": "Token " + getAuthToken() },
                success: function () {
                    showMessage("success", "✅ URL muvaffaqiyatli o‘chirildi.");
                    loadUserUrls();
                },
                error: function () {
                    showMessage("error", "O‘chirishda xatolik yuz berdi!");
                }
            });
        }
    });
});



// ✅ UPDATE tugmachasi uchun modal oynasi
$(document).on("click", ".update-btn", function () {
    let urlId = $(this).data("id");
    let currentUrl = $(this).data("url");

    Swal.fire({
        title: "URL'ni yangilash",
        input: "text",
        inputLabel: "Yangi URL'ni kiriting",
        inputValue: currentUrl,
        showCancelButton: true,
        confirmButtonText: "Saqlash",
        cancelButtonText: "Bekor qilish",
        inputValidator: (value) => {
            if (!value.trim()) {
                return "URL bo‘sh bo‘lishi mumkin emas!";
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let newUrl = result.value.trim();

            $.ajax({
                url: `http://127.0.0.1:8000/api/shorten/${urlId}/`,
                method: "PUT",
                contentType: "application/json",
                headers: { "Authorization": "Token " + getAuthToken() },
                data: JSON.stringify({ original_link: newUrl }),
                success: function () {
                    showMessage("success", "✅ URL muvaffaqiyatli yangilandi!");
                    loadUserUrls();
                },
                error: function () {
                    showMessage("error", "Yangilashda xatolik yuz berdi!");
                }
            });
        }
    });
});

$(document).on("click", ".copy-btn, .short-link", function (event) {
    event.preventDefault();
    let link = $(this).data("link") || $(this).attr("href");

    navigator.clipboard.writeText(link).then(() => {
        showMessage("success", "Link nusxalandi: " + link);
    }).catch(() => {
        showMessage("error", "Nusxalashda xatolik yuz berdi!");
    });
});

loadUserUrls();
});

function getIconClass(url) {
    const domains = {
        "twitter.com": "fab fa-twitter",
        "youtube.com": "fab fa-youtube",
        "facebook.com": "fab fa-facebook",
        "instagram.com": "fab fa-instagram",
        "linkedin.com": "fab fa-linkedin",
        "github.com": "fab fa-github"
    };
    return Object.keys(domains).find(domain => url.includes(domain)) || "fas fa-globe";
}
