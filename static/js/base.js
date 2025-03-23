$(document).ready(function () {
    let modal = $("#successModal");
    let closeBtn = $(".close-btn");

    // Modal oynani yopish
    closeBtn.click(function () {
        modal.hide();
    });

    $(window).click(function (event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });

    // Copy tugmasi bosilganda linkni nusxalash
    $("#copyBtn").click(function () {
        let shortLink = $("#shortLink").attr("href");
        navigator.clipboard.writeText(shortLink).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Copied!',
                text: 'Short link copied to clipboard.',
                timer: 2000,
                showConfirmButton: false
            });
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to copy the link!'
            });
        });
    });

    // Shortener API chaqirish
    function shortenUrl() {
        let originalUrl = $(".url-input").val().trim();
        if (!originalUrl) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Please enter a valid URL.'
            });
            return;
        }

        $.ajax({
            url: "http://127.0.0.1:8000/api/2/shorter/",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({origin_url: originalUrl }),
            success: function (response) {
                let shortUrl = response.short_url;
                $("#shortLink").attr("href", shortUrl).text(shortUrl);
                modal.show();
            },
            error: function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to shorten the URL.'
                });
            }
        });
    }

    // "Shorten Now" button click event
    $(".shorten-btn").click(shortenUrl);

    // Trigger shortening when Enter key is pressed
    $(".url-input").keypress(function (event) {
        if (event.which === 13) { 
            shortenUrl();
        }
    });



    




    // Function to load last 5 shortened URLs
    function loadLastFiveUrls() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/last-five-urls/",
            method: "GET",
            success: function (data) {
                let tableBody = $("#url-table-body");
                tableBody.empty(); // Clear previous data

                shortenCount = data.results.length; // Update shortening count

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
                            <td>
                                <span class="status ${item.status ? 'active' : 'inactive'}">
                                    <i class="${item.status ? 'fas fa-check-circle' : 'fas fa-times-circle'}"></i>
                                    ${item.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td class="clicks">${item.clicks}</td> <!-- ✅ Clicks qo‘shildi -->
                            <td><img class="qr-img" src="/static/img/image 4.svg" alt=""></td>
                            <td class="body-text">${new Date(item.created_at).toLocaleDateString()}</td>
                        </tr>
                    `;
                    tableBody.append(row);
                });
            },
            error: function (xhr) {
                let errorMessage = "Failed to retrieve data!";
                if (xhr.responseJSON && xhr.responseJSON.detail) {
                    errorMessage = xhr.responseJSON.detail; // Use backend error message
                }
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: errorMessage,
                });
            }
        });
    }
    
    // Load last 5 URLs when page loads

    // Copy link on button or link click
    $(document).on("click", ".copy-btn, .short-link", function (event) {
        event.preventDefault(); // Prevent link from opening (only for copying)

        let link = $(this).data("link") || $(this).attr("href");

        navigator.clipboard.writeText(link).then(() => {
            Swal.fire({
                icon: "success",
                title: "Copied!",
                text: "Link copied: " + link,
            });
        }).catch(() => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to copy the link!",
            });
        });
    });

    // Load last 5 URLs when page loads
    loadLastFiveUrls();
});

// Function to get the appropriate icon based on domain name
function getIconClass(url) {
    const domains = {
        "twitter.com": "fab fa-twitter",
        "youtube.com": "fab fa-youtube",
        "facebook.com": "fab fa-facebook",
        "instagram.com": "fab fa-instagram",
        "linkedin.com": "fab fa-linkedin",
        "github.com": "fab fa-github"
    };
    return domains[Object.keys(domains).find(domain => url.includes(domain))] || "fas fa-globe";
}



