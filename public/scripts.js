const paginaAtual = location.pathname
const menuItems = document.querySelectorAll("header .menu a")

for (item of menuItems) {
    if (paginaAtual.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}