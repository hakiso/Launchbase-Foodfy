const currentPage = location.pathname
const cards = document.querySelectorAll('.card')

for(let card of cards){
    card.addEventListener('click', function(){
        const receitaId = card.getAttribute('id')
        window.location.href = `/receita/${receitaId}`
    })

}

const showHides = document.getElementsByClassName('topic');
for (let showHide of showHides) {
    const buttonSpan = showHide.querySelector('a');

    buttonSpan.addEventListener('click', () => {
        if (buttonSpan.innerHTML == "ESCONDER") {
            showHide.querySelector('.topic-content').classList.add('hidden');
            buttonSpan.innerHTML = "MOSTRAR"
        } else {
            showHide.querySelector('.topic-content').classList.remove('hidden');
            buttonSpan.innerHTML = "ESCONDER"
        }
    });
}


function searchpage(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const FirstandLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

    if(FirstandLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
        if(oldPage && currentPage - oldPage > 2) {
            pages.push("...")
        }

        if(oldPage && currentPage - oldPage == 2) {
            pages.push(oldPage + 1)
        }

        pages.push(currentPage)

        oldPage = currentPage
    }
    }
    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter   
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = searchpage(page, total)

    let elements = ""

    for (let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span">${page}</span>`
        } else {
            if ( filter ) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`

            }
        }
    }

pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if (pagination) {
    createPagination(pagination)
}

