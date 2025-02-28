$(document).ready(function () {
    let shortenCount = 0; // URL shortening count

    // Function to send POST request for URL shortening
    function shortenUrl() {
        if (shortenCount >= 5) {
            Swal.fire({
                icon: "warning",
                title: "Limit Reached!",
                text: "You have reached your limit. Please sign up to get more access!",
            });
            return;
        }

        let originalUrl = $(".url-input").val().trim(); // Get input field value

        if (!originalUrl) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Please enter a URL!",
            });
            return;
        }

        $.ajax({
            url: "http://127.0.0.1:8000/api/shorter/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ original_link: originalUrl }),
            success: function (response) {
                shortenCount++; // Increment URL shortening count
                $(".url-input").val(""); // Clear input field
                
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.detail || "URL shortened successfully!", // Use backend response message
                });

                loadLastFiveUrls(); // Refresh table
            },
            error: function (xhr) {
                let errorMessage = "An error occurred while shortening the URL!";
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

    // "Shorten Now" button click event
    $(document).on("click", ".shorten-btn", function () {
        shortenUrl();
    });

    // Trigger shortening when Enter key is pressed
    $(".url-input").keypress(function (event) {
        if (event.which === 13) { // If Enter key is pressed
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
    return Object.keys(domains).find(domain => url.includes(domain)) || "fas fa-globe";
}
