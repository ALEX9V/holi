const template = document.createElement('template')
template.innerHTML = `
<div class="container">
<h1>Non found page 404</h1>
=) ...
</div>
`
export default function renderNotFoundPage() {
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    gp.innerHTML=""
    chat.innerHTML=""
    const page = /** {DocumentFragment} */ (template.content.cloneNode(true))
    return page
}

