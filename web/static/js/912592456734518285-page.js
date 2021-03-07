import { doGet, doPost } from "/js/http.js"
import { isAuthenticated } from "/js/auth.js"
import { navigate } from "/js/router.js"
import renderList from "/js/list.js"
const PAGE_SIZE = 3
const template = document.createElement("template")
template.innerHTML = `
    <div class="container">
        <h1>Пользователи</h1>
        <form id="search-form" class="search-form">
            <input type="search" name="q" placeholder="◎ Search...">
        </form>
        <div id="search-results-outlet" class="search-results-wrapper users-wrapper"></div>
    </div>
`
export default async function renderSearchPage() {
    const url = new URL(location.toString())
    const searchQuery = url.searchParams.has("q") ? decodeURIComponent(url.searchParams.get("q")).trim() : ""
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu.css">`
    chat.innerHTML=` 
    <img id='im-gg-ll' src="/js/svg/usersearch.svg"/>
    <div class="bd-gg-ll">
    <h2>◆ Здесь можно найти пользователей</h2>
    </br>
    <span> Для того чтобы найти пользователя воспульзуйтесь строкой поиска.</span>
    </div>
    
    `
    const users = await fetchUsers(searchQuery)
    const list = renderList({
        getID: u => u.username,
        items: users,
        loadMoreFunc: after => fetchUsers(searchQuery, after),
        pageSize: PAGE_SIZE,
        renderItem: renderUserProfile,
    })

    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const searchForm = /** @type {HTMLFormElement} */ (page.getElementById("search-form"))
    const searchInput = searchForm.querySelector("input")
    const searchResultsOutlet = page.getElementById("search-results-outlet")

    /**
     * @param {Event} ev
     */
    const onSearchFormSubmit = ev => {
        ev.preventDefault()
        const searchQuery = searchInput.value.trim()
        navigate("/search?q=" + encodeURIComponent(searchQuery))
    }

    searchForm.addEventListener("submit", onSearchFormSubmit)
    searchInput.value = searchQuery
    setTimeout(() => {
        searchInput.focus()
    })
    searchResultsOutlet.appendChild(list.el)

    return page
}

/**
 * @param {string} search
 * @param {string=} after
 * @returns {Promise<import("/js/types.js").UserProfile[]>}
 */
function fetchUsers(search, after = "") {
    return doGet(`/api/users?search=${search}&after=${after}&first=${PAGE_SIZE}`)
}


 function renderUserProfile(user, full = false) {
    const authenticated = isAuthenticated()
    const srch = document.createElement("div")
    srch.className = "user-profile_srh_6876876868678"
    const article = document.createElement("article")
    article.className = "user-profile"
    article.innerHTML = `<style>
    .follow-button span{color:white;}
    </style>
    
   
        ${full ? `
            
            <h1 class="user-username" title="Double click to update username">${user.username}</h1>
        ` : `
        <div class="avatar_srh" >
            <img class="avatar_srh_57586586586587" src="${user.URL}"/>
          </div>
            <a href="/users/${user.username}" class="user-username">${user.username}</a>
            <div class="user-stats">
            <a href="/users/${user.username}/followers">
                <span class="followers-count">${user.FollowersCount}</span>
                <span class="label">followers</span>
            </a>
            <a href="/users/${user.username}/followees">
                <span class="followees-count">${user.FolloweesCount}</span>
                <span class="label">followees</span>
            </a>
        </div>
        `}
        ${user.Followeed ? `<span class="badge">Follows you</span>` : ""}
        ${authenticated && !user.me ? `
            <div class="user-controls">
                <button class="follow-button" aria-pressed="${user.Following}">
                   
                    <span>${user.Following ? "Following" : "Follow"}</span>
                </button>
            </div>
        ` : full && user.me ? `
            <div class="user-controls">
                <button class="logout-button">  
                    <span>Logout</span>
                </button>
                <input class="js-avatar-input" type="file" name="avatar" accept="image/png,image/jpeg" required hidden>
            </div>
        ` : ""}

    `

    const usernameText = article.querySelector(".user-username")
    const avatarPic = article.querySelector(".avatar")
    const followersCountSpan = /** @type {HTMLSpanElement} */ (article.querySelector(".followers-count"))
    const avatarInput = /** @type {HTMLInputElement=} */ (article.querySelector(".js-avatar-input"))
    const logoutButton = /** @type {HTMLButtonElement=} */ (article.querySelector(".logout-button"))
    const followButton = /** @type {HTMLButtonElement=} */ (article.querySelector(".follow-button"))

    if (full && user.me) {
        const onUsernameDoubleClick = () => {
            prompt("New username:", user.username)
        }

        const onAvatarDoubleClick = () => {
            avatarInput.click()
        }

        const onLogoutButtonClick = () => {
            logoutButton.disabled = true
            localStorage.clear()
            location.assign("/")
        }

        usernameText.addEventListener("dblclick", onUsernameDoubleClick)
        avatarPic.addEventListener("dblclick", onAvatarDoubleClick)
        logoutButton.addEventListener("click", onLogoutButtonClick)
    }

    if (followButton !== null) {
        const followText = followButton.querySelector("span")
        const onFollowButtonClick = async () => {
            followButton.disabled = true

            try {
                const out = await toggleFollow(user.username)
                followersCountSpan.textContent = String(out.followersCount)
                followButton.setAttribute("aria-pressed", String(out.following))
                
                followText.textContent = out.following ? "Following" : "Follow"
            } catch (err) {
                console.log(err)
                alert(err.message)
            } finally {
                followButton.disabled = false
            }
        }

        followButton.addEventListener("click", onFollowButtonClick)
    }
    srch.append(article)
    return srch
}
/**
 * @param {string} username
 * @returns {Promise<import("../types.js").ToggleFollowOutput>}
 */
function toggleFollow(username) {
    return doPost(`/api/users/${username}/toggle_follow`)
}