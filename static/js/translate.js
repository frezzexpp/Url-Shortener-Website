document.addEventListener("DOMContentLoaded", function () {
    const langSelector = document.getElementById("language-selector");

    // Saqlangan tilni yuklash
    const savedLang = localStorage.getItem("language") || "en";
    langSelector.value = savedLang;
    loadLanguage(savedLang);

    langSelector.addEventListener("change", function () {
        const selectedLang = this.value;
        localStorage.setItem("language", selectedLang);
        loadLanguage(selectedLang);
    });

    function loadLanguage(lang) {
        fetch(`/static/locales/${lang}.json`)
            .then((response) => response.json())
            .then((data) => {
                document.querySelectorAll("[data-i18n]").forEach((element) => {
                    const key = element.getAttribute("data-i18n");
                    if (data[key]) {
                        element.innerText = data[key];
                    }
                });

                document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
                    const key = element.getAttribute("data-i18n-placeholder");
                    if (data[key]) {
                        element.setAttribute("placeholder", data[key]);
                    }
                });
            })
            .catch((error) => console.error("Translation file error:", error));
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const lang = localStorage.getItem("lang") || "uz"; // Default til
    fetch(`/static/lang/${lang}.json`) // JSON faylini yuklash
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll("[data-i18n]").forEach(el => {
                const key = el.getAttribute("data-i18n");
                if (data[key]) {
                    el.innerText = data[key];
                }
            });
        })
        .catch(error => console.error("Localization yuklashda xatolik:", error));
});
