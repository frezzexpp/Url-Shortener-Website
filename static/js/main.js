$(document).ready(function () {



    // Profile Drop-down Menu:
    $(".profile-btn").click(function (event) {
        event.stopPropagation();
        $(".profile-container").toggleClass("active");
    });

    $(document).click(function (event) {
        if (!$(event.target).closest(".profile-container, .profile-btn").length) {
            $(".profile-container").removeClass("active");
        }
    });


    
    
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------
        // Foydalanuvchining oxirgi login vaqtini olish
    let lastLogin = localStorage.getItem("lastLogin");
    let now = new Date().getTime();
    // const oneDay = 24 * 60 * 60 * 1000; // 1 kun (millisekund)
    const oneMinute = 60 * 1000; // 1 daqiqa (60,000 millisekund)


    // Agar foydalanuvchi 24 soatdan beri login qilmagan bo‘lsa, Swal orqali chiqaramiz
    if (!lastLogin || (now - lastLogin) > oneMinute) {
        Swal.fire({
            toast: true,
            position: "top-end", // Yuqori o‘ng burchakda chiqadi
            icon: "info",
            title: "Welcome back! 🎉",
            text: "Siz uzoq vaqt davomida tizimga kirmadingiz.",
            showConfirmButton: false,
            timer: 4000, // 4 soniyadan keyin yo‘qoladi
            timerProgressBar: true,
            background: "#0B1120", // Orqa fon rangi (sayt dizayniga mos)
            color: "#ffffff", // Matn rangi
            customClass: {
                popup: "custom-toast",
                title: "custom-title",
                timerProgressBar: "custom-progress-bar"
            }
        });
    }

    // Hozirgi login vaqtini saqlash
    localStorage.setItem("lastLogin", now);

    // Swal uchun qo‘shimcha CSS
    const style = document.createElement("style");
    style.innerHTML = `
        .swal2-popup.custom-toast {
            border-radius: 10px;
            box-shadow: 0px 4px 15px rgba(0, 255, 255, 0.4);
        }
        .swal2-title.custom-title {
            font-size: 20px;
            font-weight: bold;
            color: #00FFFF; /* Neon ko‘k */
        }
        .swal2-timer-progress-bar.custom-progress-bar {
            background: #00FFFF; /* Neon ko‘k progress bar */
        }
    `;
    document.head.appendChild(style);


    // Welcome User Text Animation:
    let tooltip = $("#welcome-tooltip");
    tooltip.css({ opacity: "1", transform: "translateY(0)" });

    setTimeout(() => {
        tooltip.css({ opacity: "0", transform: "translateY(0)" });
        setTimeout(() => tooltip.remove(), 500);
    }, 3000);
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------



    // HISTORY COUNT:
    function updateHistoryCount() {
        let tableBody = document.getElementById("url-table-body");
        let rowCount = tableBody.getElementsByTagName("tr").length;
        document.getElementById("history-count").innerText = `History (${rowCount})`;
    }
    
    document.addEventListener("DOMContentLoaded", updateHistoryCount);
    const observer = new MutationObserver(updateHistoryCount);
    observer.observe(document.getElementById("url-table-body"), { childList: true });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------



    // profile username:
    let token = localStorage.getItem("token"); // Tokenni olish

    if (token) {
        fetch("http://127.0.0.1:8000/api/profile/", {
            method: "GET",
            headers: {
                "Authorization": "Token " + token,
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            $("#username").text(data.username); // Username ni chiqarish
        })
        .catch(error => console.error("Error fetching profile:", error));
    }
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------
    


    // Logout Button functionality:
    document.getElementById("logout-btn").addEventListener("click", function () {
        let token = localStorage.getItem("token");

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
            title: "Are you sure?",
            text: "Do you really want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "⏳ Logging out...",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
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
                        localStorage.removeItem("token");
                        window.location.href = "login.html";
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
            }
        });
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------


    // function redirectShortURL(shortLink) {
    //     fetch(`http://127.0.0.1:8000/api/${shortLink}/`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 return response.json().then(data => {
    //                     throw { status: response.status, message: data.detail };
    //                 });
    //             }
    //             return response;
    //         })
    //         .then(response => {
    //             window.location.href = response.url;
    //         })
    //         .catch(error => {
    //             if (error.status === 403) { // Inactive URL
    //                 Swal.fire({
    //                     icon: "warning",
    //                     title: "URL Inactive",
    //                     text: error.message || "This URL is inactive or disabled.",
    //                     confirmButtonText: "OK"
    //                 });
    //             } else if (error.status === 404) { // URL topilmadi
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Not Found",
    //                     text: error.message || "This shortened URL does not exist.",
    //                     confirmButtonText: "OK"
    //                 });
    //             } else {
    //                 Swal.fire({
    //                     icon: "error",
    //                     title: "Error",
    //                     text: "Something went wrong!",
    //                     confirmButtonText: "OK"
    //                 });
    //             }
    //         });
    // }
    



    // Check for Auth Token:
    function getAuthToken() {
        return localStorage.getItem("token") || "";
    }

    if (!getAuthToken()) {
        Swal.fire({
            icon: "warning",
            title: "Attention!",
            text: "You are not logged in! You will be redirected to the login page in 3 seconds.",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        setTimeout(() => {
            window.location.href = "login.html";
        }, 3000);
    }
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------



    //Messages: 
    function showMessage(type, message) {
        Swal.fire({
            icon: type === "success" ? "success" : "error",
            title: type === "success" ? "Success!" : "Error!",
            text: message,
            showConfirmButton: true,
            confirmButtonText: "OK"
        });
    }
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------


    
    // URL Shorter:
    $(document).ready(function () {

        // Modal ochish va yopish uchun funksiya
        function showModal(shortLink) {
            console.log("Modal ochilmoqda:", shortLink);
        
            const successModal = $("#successModal");
            $("#shortLink").attr("href", shortLink).text(shortLink);
            
            successModal.css("display", "block"); // Modalni ochish
        }
        $(".close-btn").click(function () {
            $("#successModal").hide();
        });
    
        $(window).click(function (event) {
            if (event.target.id === "successModal") {
                $("#successModal").hide();
            }
        });
    
        // URL Shorten Funksiyasi
        function shortenUrl() {
            let originalUrl = $(".url-input").val().trim();
            if (!originalUrl) {
                showMessage("error", "Введите URL!");
                return;
            }
        
            // Agar URL `http://` yoki `https://` bilan boshlanmasa, `http://` qo‘shish
            if (!/^https?:\/\//i.test(originalUrl)) {
                originalUrl = "http://" + originalUrl;
            }

            if (!/\.[a-z]{2,}$/i.test(originalUrl)) {
                originalUrl += ".com";
            }


            $.ajax({
                url: "http://127.0.0.1:8000/api/shorter/",
                method: "POST",
                contentType: "application/json",
                headers: { "Authorization": "Token " + getAuthToken() },
                data: JSON.stringify({ original_link: originalUrl }),
                success: function (response) {
                    $(".url-input").val(""); // Inputni tozalash
                    showMessage("success", "✅ URL successfully shortened!");
                    loadUserUrls();
                    
                    if (response.short_link) {
                        showModal(response.short_link); // Modal ochish
                    }
                },
                error: function (xhr) {
                    let errorMessage = xhr.responseJSON && xhr.responseJSON.message 
                                       ? xhr.responseJSON.message 
                                       : "An error occurred! Please try again.";
                    showMessage("error", errorMessage);
                }
            });
        }
    
        $(".shorten-btn").on("click", shortenUrl);
        $(".url-input").keypress(function (event) {
            if (event.which === 13) shortenUrl();
        });
    
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------


    

    // DataTable for user URLs:
    let userTable; // Global o'zgaruvchi
    $(document).ready(function () {
        console.log("Auth Token:", getAuthToken()); 
    
        userTable = $('#urlTable').DataTable({
            scrollX: false,
            processing: true,
            serverSide: true,
            autoWidth: false,
            responsive: false,
            pageLength: 20,
            lengthChange: false,
            ordering: false,
            searching: false,
            paging: true,
            info: false, 
            order: [[5, 'desc']],
            ajax: {
                url: 'http://127.0.0.1:8000/api/shorten/list/',
                type: 'GET',
                headers: {
                    "Authorization": "Token " + getAuthToken()
                },
    
                data: function (d) {  
                    let savedFilters = JSON.parse(localStorage.getItem('globalFilters')) || {};
    
                    d.search_short = savedFilters.search_short ?? $('#searchInput_short').val();
                    d.search_origin = savedFilters.search_origin ?? $('#searchInput_origin').val();
                    d.status = savedFilters.status ?? $('#statusFilter').val();
                    
                    if (d.status === "true" || d.status === "Active") {
                        d.status = true;
                    } else if (d.status === "false" || d.status === "Inactive") {
                        d.status = false;
                    }
                    
                    d.start_date = savedFilters.start_date ?? $('#start-date-filter').val();
                    d.end_date = savedFilters.end_date ?? $('#end-date-filter').val();
                    
                    d.start = d.start ?? 0;
                    d.length = d.length ?? 10;
                    
                    d.page = Math.floor(d.start / d.length) + 1;
                    d.page_size = d.length;
                    
                    console.log("Sent Data:", d);
                },
                
                dataSrc: function (json) {
                    console.log("API Response:", json);
                    json.recordsTotal = json.count;
                    json.recordsFiltered = json.count;
                    return json.results || json.items || [];
                }
            },
    
            columns: [
                { data: 'id', title: 'ID', visible: false },
    
                {
                    data: 'short_link',
                    title: 'Short Link',
                    render: function (data) {
                        return `<div class="copy-container">
                                    <span class="short-link" data-link="${data}">${data}</span>
                                    <button class="copy-btn" data-link="${data}">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>`;
                    }
                },
    
                {
                    data: 'original_link',
                    title: 'Original Link',
                    render: function (data) {
                        return `<a href="${data}" target="_blank" class="org-link">${data}</a>`;
                    }
                },
    
                {
                    data: 'clicks',
                    title: 'Clicks',
                    render: function (data) {
                        return `<span class="click-count">${data}</span>`; // Clicks soni
                    }
                },
    
                {
                    data: null,
                    title: 'Qr Code',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // Create a unique ID for the QR code container and modal
                        let qrId = `qr-${rowData.id}`;
                        let modalId = `qr-modal-${rowData.id}`;
                        
                        // Add QR code image and modal structure
                        $(td).html(`
                            <img src="/static/img/image 4.svg" id="${qrId}" class="qr-container" style="cursor:pointer; width: 60px; height: 55px;" alt="QR Code Placeholder">
                            
                            <!-- Hidden Modal for Enlarged QR -->
                            <div id="${modalId}" class="qr-modal" style="display:none; position:fixed; top:50%; left:50%;
                                transform:translate(-50%, -50%); background:#fff; padding:10px; border-radius:8px; 
                                box-shadow:0px 0px 10px rgba(0,0,0,0.2);">
                                <div id="large-${qrId}"></div>
                            </div>
                        `);
                
                        // Add Click Event for Enlarging QR Code
                        $(td).find(`#${qrId}`).click(function (e) {
                            let modal = $(`#${modalId}`);
                            
                            // QR kodni toza yaratish
                            let largeQRContainer = document.getElementById(`large-${qrId}`);
                            largeQRContainer.innerHTML = "";
                            new QRCode(largeQRContainer, {
                                text: rowData.short_link,  // **short_link ni ishlatish**
                                width: 200,
                                height: 200
                            });
                        
                            $(".qr-modal-overlay").fadeIn();  // Yopish foni chiqadi
                            modal.fadeIn();
                            e.stopPropagation();
                        });
                        
                        // Modalni yopish
                        $(".qr-modal-overlay, .qr-modal").click(function (e) {
                            if (!$(e.target).closest('.qr-modal img').length) {
                                $(".qr-modal-overlay").fadeOut();
                                $(".qr-modal").fadeOut();
                            }
                        });
                        
                
                        // Close Modal on Clicking Outside the QR Code
                        $(document).on("click", function (e) {
                            if (!$(e.target).closest(`.qr-modal, #${qrId}`).length) {
                                $(`#${modalId}`).fadeOut();
                            }
                        });
                    }
                },
                
    
                {
                    data: 'status',
                    title: 'Status',
                    render: function (data) {
                        console.log("Status value:", data, typeof data); 
    
                        let statusText, iconClass;
                        let normalizedData = String(data).toLowerCase();
                        
                        if (normalizedData === "1" || normalizedData === "true") {
                            statusText = "Active";
                            iconClass = "fas fa-link";
                        } else if (normalizedData === "0" || normalizedData === "false") {
                            statusText = "Inactive";
                            iconClass = "fas fa-unlink";
                        } else {
                            statusText = "Unknown";
                            iconClass = "fas fa-question-circle";
                        }
    
                        return `<span class="status ${statusText.toLowerCase()}">${statusText} <i class="${iconClass}"></i></span>`;
                    }
                },
    
                {
                    data: 'created_at',
                    title: 'Date',
                    render: function (data) {
                        return `<span class="text-white">${new Date(data).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>`;
                    }
                },
    
                {
                    data: null,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return `<button class="action-btn delete-user" data-id="${row.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                                <button class="action-btn edit-status" data-id="${row.id}" data-status="${row.status}">
                                    <i class="fas fa-edit"></i>
                                </button>`;
                    }
                }
            ]
        });
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------




    // Filter:
    $(document).ready(function () {
        let modal = $("#filter-modal");
        let btn = $("#open-filter-modal");
        let closeBtn = $(".close");
    
        btn.click(function () {
            modal.show();
            let savedFilters = JSON.parse(localStorage.getItem('globalFilters')) || {};
            $("#short-link-filter").val(savedFilters.search_short || "");
            $("#original-link-filter").val(savedFilters.search_origin || "");
            $("#status-filter").val(savedFilters.status || "");
            $("#start-date-filter").val(savedFilters.start_date || "");
            $("#end-date-filter").val(savedFilters.end_date || "");
        });
    
        closeBtn.click(function () {
            modal.hide();
        });
    
        $(window).click(function (event) {
            if ($(event.target).is(modal)) {
                modal.hide();
            }
        });
    
        $("#apply-filter").click(function () {
            let searchShort = $("#short-link-filter").val().trim();
            let searchOrigin = $("#original-link-filter").val().trim();
            let status = $("#status-filter").val();
            let startDate = $("#start-date-filter").val();
            let endDate = $("#end-date-filter").val();
        
            // Sanalarni tekshiramiz
            if (startDate && endDate && startDate > endDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date Range!',
                    text: 'Start date cannot be greater than end date.',
                    confirmButtonText: 'OK'
                });
                return;
            }
        
            let filters = {
                search_short: searchShort,
                search_origin: searchOrigin,
                status: status,
                start_date: startDate,
                end_date: endDate
            };
        
            localStorage.setItem('globalFilters', JSON.stringify(filters));
            userTable.ajax.reload();
        
            Swal.fire({
                icon: 'success',
                title: 'Filters Applied!',
                text: 'Your filters have been successfully applied.',
                confirmButtonText: 'OK'
            });
        
            modal.hide();
        });
        
        $("#clear-filter-btn").click(function () {
            localStorage.removeItem('globalFilters');
            $("#short-link-filter, #original-link-filter, #status-filter, #start-date-filter, #end-date-filter").val("");
        
            userTable.ajax.reload();
        
            Swal.fire({
                icon: 'success',
                title: 'Filters Cleared!',
                text: 'All filters have been removed.',
                confirmButtonText: 'OK'
            });
        
            modal.hide();
        });
        
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------
    



    // Delete Action:
    $(document).on("click", ".delete-user", function () {
        let urlId = $(this).data("id");
        if (!urlId) {
            showMessage("error", "ID not found!");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This URL will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-title',
                htmlContainer: 'swal-text',
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn'
            },
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://127.0.0.1:8000/api/shorten/delete/${urlId}/`,
                    method: "DELETE",
                    headers: { "Authorization": "Token " + getAuthToken() },
                    success: function () {
                        showMessage("success", "URL successfully deleted.");
                        loadUserUrls();
                    },
                    error: function () {
                        showMessage("error", "An error occurred while deleting!");
                    }
                });
            }
        });
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------



    // Update Status Action:
    $(document).on("click", ".edit-status", function () {
        let urlId = $(this).data("id");
        let currentStatus = $(this).data("status");

        Swal.fire({
            title: "Update Status",
            showCancelButton: true,
            confirmButtonText: currentStatus === 0 ? "🟢 Activate" : "🔴 Deactivate",
            denyButtonText: currentStatus === 1 ? "🔴 Deactivate" : "🟢 Activate",
            showDenyButton: true,
            customClass: {
                popup: "custom-modal-bg",
                confirmButton: "custom-btn",
                denyButton: "custom-btn"
            }
        }).then((result) => {
            if (!result.isConfirmed && !result.isDenied) return;

            let newStatus = result.isConfirmed ? 0 : 1;

            $.ajax({
                url: `http://127.0.0.1:8000/api/status/update/${urlId}/`,
                method: "PUT",
                contentType: "application/json",
                headers: { "Authorization": "Token " + getAuthToken() },
                data: JSON.stringify({ status: newStatus }),
                success: function () {
                    showMessage("success", "Status successfully updated!");
                    userTable.ajax.reload();
                },
                error: function () {
                    showMessage("error", "An error occurred while updating!");
                }
            });
        });
    });
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------
    
    

    // COPY Button:
    $(document).on("click", ".copy-btn, .short-link", function (event) {
        event.preventDefault();
        let link = $(this).data("link") || $(this).text(); // Use text method for short link

        navigator.clipboard.writeText(link).then(() => {
            showMessage("success", "Link copied: " + link);
        }).catch(() => {
            showMessage("error", "An error occurred while copying!");
        });
    });


    function loadUserUrls() {
        userTable.ajax.reload(); // Reload DataTable
    }

    loadUserUrls(); // Call to load User URLs initially
// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------



// Original link logo:
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
});