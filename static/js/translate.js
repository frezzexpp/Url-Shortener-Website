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
