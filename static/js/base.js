$(document).ready(function () {
    let shortenCount = 0; // URL qisqartirish sanog'i

    // URL qisqartirish uchun POST so‘rov
    function shortenUrl() {
        if (shortenCount >= 5) {
            Swal.fire({
                icon: "warning",
                title: "Limit tugadi!",
                text: "Sizning limitingiz tugadi. Yana imkoniyatga ega bo‘lish uchun ro‘yxatdan o‘ting!",
            });
            return;
        }

        let originalUrl = $(".url-input").val().trim(); // Input maydonidagi link

        if (!originalUrl) {
            Swal.fire({
                icon: "error",
                title: "Xatolik!",
                text: "Iltimos, URL kiriting!",
            });
            return;
        }
// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------



        $.ajax({
            url: "http://127.0.0.1:8000/api/shorter/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ original_link: originalUrl }),
            success: function (response) {
                shortenCount++; // Qisqartirilgan URL sonini oshiramiz
                $(".url-input").val(""); // Inputni tozalash
                Swal.fire({
                    icon: "success",
                    title: "Muvaffaqiyat!",
                    text: "URL muvaffaqiyatli qisqartirildi!",
                });
                loadLastFiveUrls(); // Jadvalni yangilash
            },
            error: function (xhr) {
                let errorMessage = "URL qisqartirishda xatolik yuz berdi!";
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMessage = xhr.responseJSON.error;
                }
                Swal.fire({
                    icon: "error",
                    title: "Xatolik!",
                    text: errorMessage,
                });
            }
        });
    }

    // "Shorten Now" tugmasiga bosilganda
    $(document).on("click", ".shorten-btn", function () {
        shortenUrl();
    });

    // Enter tugmasi bosilganda ham qisqartirish
    $(".url-input").keypress(function (event) {
        if (event.which === 13) { // Enter tugmasi bosilganda
            shortenUrl();
        }
    });
// --------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------

    
    // Jadvalni yuklash
    function loadLastFiveUrls() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/shorten/urls/",
            method: "GET",
            success: function (data) {
                let tableBody = $("#url-table-body");
                tableBody.empty(); // Oldingi ma'lumotlarni tozalash

                shortenCount = data.results.length; // Foydalanuvchi necha marta qisqartirganini yangilaymiz

                data.results.forEach(function (item) {
                    let row = `
                        <tr>
                            <td>
                                <a class="short-link" href="${item.short_link}" target="_blank" data-id="${item.id}">${item.short_link}</a> 
                                <button class="copy-btn" data-link="${item.short_link}"><i class="fas fa-copy"></i></button>
                            </td>
                            <td class="org-link">
                                <i class="${getIconClass(item.original_link)} icon"></i>
                                <a href="${item.original_link}" target="_blank">${item.original_link}</a>
                            </td>
                            <td><img class="qr-img" src="/static/img/image 4.svg" alt=""></td>
                            <td class="body-text click-count" data-id="${item.id}">${item.clicks}</td>
                            <td>
                                <span class="status ${item.status ? 'active' : 'inactive'}">
                                    <i class="${item.status ? 'fas fa-check-circle' : 'fas fa-times-circle'}"></i>
                                    ${item.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="body-text">${new Date(item.created_at).toLocaleDateString()}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
            },
            error: function () {
                Swal.fire({
                    icon: "error",
                    title: "Xatolik!",
                    text: "Ma'lumotlarni olishda xatolik yuz berdi!",
                });
            }
        });
    }

    // Nusxalash tugmasi yoki linkni bosganda nusxalash
    $(document).on("click", ".copy-btn, .short-link", function (event) {
        event.preventDefault(); // Link ochilishini to‘xtatish (faqat nusxalash uchun)

        let link = $(this).data("link") || $(this).attr("href");

        navigator.clipboard.writeText(link).then(() => {
            Swal.fire({
                icon: "success",
                title: "Nusxalandi!",
                text: "Link nusxalandi: " + link,
            });
        }).catch(() => {
            Swal.fire({
                icon: "error",
                title: "Xatolik!",
                text: "Nusxalashda xatolik yuz berdi!",
            });
        });
    });

    // Sahifa yuklanganda avtomatik chaqiriladi
    loadLastFiveUrls();
});

// Domen nomiga mos ikonka tanlash funksiyasi
function getIconClass(url) {
    if (url.includes("twitter.com")) return "fab fa-twitter";
    if (url.includes("youtube.com")) return "fab fa-youtube";
    if (url.includes("facebook.com")) return "fab fa-facebook";
    if (url.includes("instagram.com")) return "fab fa-instagram";
    if (url.includes("linkedin.com")) return "fab fa-linkedin";
    if (url.includes("github.com")) return "fab fa-github";
    return "fas fa-globe"; // Default ikonka
}
