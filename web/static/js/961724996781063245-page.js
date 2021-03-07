import { joinActors, markNotificationAsRead } from "/js/header.js"
import { doGet, doPost } from "/js/http.js"
import { ago } from "/js/utils.js"
import renderList from "/js/list.js"

const PAGE_SIZE = 100
var myAudio = new Audio;
const template = document.createElement("template")

template.innerHTML = `
    <div class="container">
<style>
p{color:gray;}
.notyfis {
    background: none;
}</style>
        <h1>Уведомления ▾</h1>
        <div id="notifications-outlet" class="notifications-wrapper">
    </div>
`

export default async function renderNotificationsPage() {
    const notifications = await fetchNotifications()
    await Notifications()
    const list = renderList({
        items: notifications,
        loadMoreFunc: fetchNotifications,
        pageSize: PAGE_SIZE,
        renderItem: renderNotification,
    })
    const gp = document.querySelector(".gp")
    gp.innerHTML=""
    const chat = document.querySelector("#chat_window_room")
    chat.innerHTML=``
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const notificationsOutlet = page.getElementById("notifications-outlet")
    const badge = document.querySelector(".badge")
badge.innerHTML=""
    const onNotificationArrive = list.enqueue
    const unsubscribeFromNotifications = subscribeToNotifications(onNotificationArrive)

    const onPageDisconnect = () => {
        unsubscribeFromNotifications()
        list.teardown()
    }
    
    notificationsOutlet.appendChild(list.el)
    page.addEventListener("disconnect", onPageDisconnect)
  
    return page
}

/**
 * @param {string=} before
 * @returns {Promise<import("/js/types.js").Notification[]>}
 */
function fetchNotifications(before = "") {
    return doGet(`/api/notifications?last=${PAGE_SIZE}&before=${encodeURIComponent(before)}`)
}
function Notifications() {
    const value = "comment"
    return doPost(`/api/notification`,{value})
}
/**
 * @param {function(import("js/types.js").Notification):any} cb
 */
function subscribeToNotifications(cb) {
    
    /**
     * @param {CustomEvent} ev
     */
    const onNotificationArrive = ev => {
        cb(ev.detail)
        

    }
    
    addEventListener("notificationarrive", onNotificationArrive)
    return () => {
        removeEventListener("notificationarrive", onNotificationArrive)
        
    }
}

/**
 * @param {import("/js/types.js").Notification} notification
 */
function renderNotification(notification) {
    const article = document.createElement("article")
    article.className = "notification"
    if (notification.Read) {
        article.classList.add("read")
    }
    if (notification.Type!="message"){
    let content = joinActors(notification.Actors.map(s => `<a href="/users/${encodeURIComponent(s)}">${s}</a>`))
    switch (notification.Type) {
        case "follow":
            content += " followed you"
            break
            case "message":
                content += ` сообщения`
                break
        case "comment":
            content += ` оставил коментарий <a href="/post/${encodeURIComponent(notification.PostID)}">post</a>`
            break
        case "post_mention":
            content += ` mentioned you on a <a href="/post/${encodeURIComponent(notification.PostID)}">post</a>`
            break
        case "comment_mention":
            content += ` mentioned you on a <a href="/post/${encodeURIComponent(notification.PostID)}">comment</a>`
            break
        default:
            content += " did something"
            break
    }
    
    article.innerHTML = `
        <p>${content}</p>
        <time datetime="${notification.IssuedAt}">${ago(notification.IssuedAt)}</time>
    `
}
    if (!notification.Read) {
        
        const onNotificationClick = async () => {
            const badge =document.getElementsByClassName('badge')[0]
            await markNotificationAsRead(notification.ID)
            notification.Read = true
            article.classList.add("read")
            article.removeEventListener("click", onNotificationClick)


        }

        article.addEventListener("click", onNotificationClick)
    }
    return article
}
