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




    // Welcome User Text Animation:
    let tooltip = $("#welcome-tooltip");
    tooltip.css({ opacity: "1", transform: "translateY(0)" });

    setTimeout(() => {
        tooltip.css({ opacity: "0", transform: "translateY(0)" });
        setTimeout(() => tooltip.remove(), 500);
    }, 3000);




    // HISTORY COUNT:
    function updateHistoryCount() {
        let tableBody = document.getElementById("url-table-body");
        let rowCount = tableBody.getElementsByTagName("tr").length;
        document.getElementById("history-count").innerText = `History (${rowCount})`;
    }
    
    document.addEventListener("DOMContentLoaded", updateHistoryCount);
    const observer = new MutationObserver(updateHistoryCount);
    observer.observe(document.getElementById("url-table-body"), { childList: true });



    


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
                showMessage("error", "Please enter a URL!");
                return;
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
            pageLength: 10,
            lengthChange: false,
            ordering: true,
            searching: false,
            paging: false,
            info: false, 
            order: [[5, 'desc']],
            ajax: {
                url: 'http://127.0.0.1:8000/api/shorten/list/',
                type: 'GET',
                headers: {
                    "Authorization": "Token " + getAuthToken()
                },
                data: function (d) {
                    let filters = JSON.parse(localStorage.getItem('globalFilters') || '{}');
                    d.limit = d.length;
                    d.offset = d.start;
                    d.original_link = filters['original-link-filter'] || "";
                    d.status = filters['status-filter'] || "";
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
                    data: null,
                    title: 'QR Code',
                    render: function (data) {
                        return `<img class='qr-img' src="/static/img/image 4.svg" width="50" height="50" alt="QR Code">`;
                    }
                },

                {
                    data: 'status',
                    title: 'Status',
                    render: function (data) {
                        console.log("Status value:", data); // Status qiymatini tekshirish
                        console.log("Status value:", data, typeof data);  // DEBUG uchun

                
                        let statusText, iconClass;
                
                        let normalizedData = String(data).toLowerCase(); // Har doim string formatga o'tkazamiz
                        
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



    // FILTER:
    $(document).ready(function () {
        // Modal boshqaruvi
        let modal = $("#filter-modal");
        let btn = $("#open-filter-modal");
        let closeBtn = $(".close");
    
        btn.click(function () {
            modal.show();
            let savedFilters = JSON.parse(localStorage.getItem('globalFilters')) || {};
            $("#original-link-filter").val(savedFilters.originalLink || "");
            $("#status-filter").val(savedFilters.status || "");
            $("#date-filter").val(savedFilters.date || "");
        });
    
        closeBtn.click(function () {
            modal.hide();
        });
    
        $(window).click(function (event) {
            if ($(event.target).is(modal)) {
                modal.hide();
            }
        });
    
        // Filterni qo‘llash
        $("#apply-filter").click(function () {
            let filters = {
                originalLink: $("#original-link-filter").val().trim(),
                status: $("#status-filter").val(),
                date: $("#date-filter").val()
            };
            localStorage.setItem('globalFilters', JSON.stringify(filters));
            applyFilters();
            modal.hide();
        });
    
        function applyFilters() {
            if (typeof userTable !== 'undefined' && $.fn.DataTable.isDataTable('#urlTable')) {
                let savedFilters = JSON.parse(localStorage.getItem('globalFilters')) || {};
                
                userTable.columns(2).search(savedFilters.originalLink || "");
                userTable.columns(4).search(savedFilters.status || "");
                userTable.draw();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Filter Applied!',
                    text: 'Data has been updated!',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                console.error("userTable is not loaded yet!");
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'User table is not loaded yet!'
                }).then(() => {
                    location.reload();
                });
            }
        }
    
        $("#clear-filter-btn").click(function () {
            localStorage.removeItem('globalFilters');
            $("#original-link-filter, #status-filter, #date-filter").val("");
            
            if (typeof userTable !== 'undefined' && $.fn.DataTable.isDataTable('#urlTable')) {
                userTable.columns().search("").draw();
                Swal.fire({
                    icon: 'info',
                    title: 'Filter Cleared!',
                    text: 'All filters have been removed!',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            modal.hide();
        });
    });
    



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
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
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