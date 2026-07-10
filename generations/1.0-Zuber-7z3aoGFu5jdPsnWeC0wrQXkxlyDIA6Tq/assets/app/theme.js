function changeTheme(themeFile) {
    // 1. Podmiana pliku CSS na ekranie
    const themeLink = document.getElementById("theme-link");
    themeLink.setAttribute("href", themeFile);
    
    // 2. Zapisanie wyboru w pamięci (localStorage)
    localStorage.setItem("theme", themeFile);
}