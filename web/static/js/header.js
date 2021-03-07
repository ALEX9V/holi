
import { getAuthUser } from '/js/auth.js'
import { doGet, subscribe, doPost } from '/js/http.js'
import { navigate } from "/js/router.js"
const rePostRoute = /^\/posts\/(?<postID>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/
const authUser = getAuthUser()

const authenticated = authUser !== null
if (authenticated){
var myAudio=new Audio
const a = document.querySelector(".top_line")
    console.log(a)
a.innerHTML=`      <span class="logo_cl32392323">Rl</span>
<svg id="svg_hd_5757" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.01 512"><defs><style>.cls-1{fill:#8298e9;}</style></defs><title>loupe</title><path class="cls-1" d="M505.75,475.59,360.15,330a201.72,201.72,0,0,0,45.18-127.32C405.33,90.93,314.41,0,202.67,0S0,90.93,0,202.67,90.92,405.34,202.67,405.34A201.62,201.62,0,0,0,330,360.15l145.6,145.6a21.33,21.33,0,0,0,30.17-30.16ZM202.67,362.67c-88.24,0-160-71.77-160-160s71.76-160,160-160,160,71.76,160,160S290.9,362.67,202.67,362.67Z" transform="translate(0 0)"/></svg>
<form id="searcher-form" class="searcher-form">
   
    <input type="text"  name="q" class="sh_inp798798_pj" placeholder="Поиск            " autocomplete="off" >
</form>

<div class="dv_68768_hj_u78">
<a href="/chat">
<svg id="mess_dh_687678" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 390"><defs><style>.cls-1{fill:#8298e9;}</style></defs><title>email</title><path class="cls-1" d="M467,61H45A45.08,45.08,0,0,0,0,106V406a45.07,45.07,0,0,0,45,45H467a45.07,45.07,0,0,0,45-45V106A45.07,45.07,0,0,0,467,61Zm-6.21,30L257,294.83,51.36,91ZM30,399.79V112.07L174.48,255.31ZM51.21,421,195.78,276.43l50.66,50.22a15,15,0,0,0,21.17,0L317,277.21,460.79,421ZM482,399.79,338.21,256,482,112.21Z" transform="translate(0 -61)"/></svg>
<div class="notyfi"> </div>
</a>
<a href="/notifications">
<svg id="mess_dh_687678" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 405.13 512"><defs><style>.cls-1{fill:#8298e9;}</style></defs><title>bell</title><path class="cls-1" d="M450.2,407.45c-1.5-1-12.83-8.91-24.17-32.91-20.83-44.09-25.2-106.18-25.2-150.51,0-.2,0-.39,0-.58A145.28,145.28,0,0,0,315.3,91.69V57A57.05,57.05,0,0,0,258.36,0h-4.72A57.05,57.05,0,0,0,196.7,57V91.69A145.29,145.29,0,0,0,111.17,224c0,44.33-4.37,106.42-25.2,150.51-11.34,24-22.67,31.94-24.17,32.91a14.59,14.59,0,0,0-8,16.59c1.47,6.94,8,11.72,15,11.72h110a77.23,77.23,0,0,0,154.44,0h110c7.08,0,13.57-4.78,15-11.72A14.59,14.59,0,0,0,450.2,407.45ZM226.7,57a27,27,0,0,1,26.94-27h4.72A27,27,0,0,1,285.3,57V82a145.53,145.53,0,0,0-58.6,0V57ZM256,482a47.34,47.34,0,0,1-47.22-46.19h94.44A47.34,47.34,0,0,1,256,482Zm60.4-76.24H103a158.53,158.53,0,0,0,7.86-13.8C131,352.27,141.17,295.79,141.17,224c0-63.42,51.51-115,114.83-115s114.82,51.59,114.82,115.06c0,.18,0,.36,0,.55.05,71.47,10.25,127.75,30.29,167.28a155.92,155.92,0,0,0,7.87,13.8Z" transform="translate(-53.44 0)"/></svg>
<div class="notyfis"> </div>
</a>
</div>`
const b = document.getElementById("r456_sib809809")

b.innerHTML=`        <style>.cls-1{fill:#8298e9;} #sidebar {
    min-width: 250px;
    max-width: 250px;
    min-height: 100vh;
    color: #fff;
    transition: all 0.3s;
    position: relative;
}</style>
<span class="calendar">
<div id="month-calendar">
<ul class="month">
<li class="prev"><i class="fas fa-angle-double-left"></i></li>
<li class="next"><i class="fas fa-angle-double-right"></i></li>
<li class="month-name"></li>
<li class="year-name"></li>
</ul>
<ul class="weekdays">
<li>Пн</li>
<li>Вт</li>
<li>Ср</li>
<li>Чт</li>
<li>Пт</li>
<li>Сб</li>
<li>Вс</li>
</ul>
<ul class="days">
</ul>
</div>
<div id="chat_window_room">

</div>
</span>`
const header = document.querySelector('header')
const avatar = document.querySelector('.dv_68768_hj_u78')
if(authenticated){
var img = new Image();

var str = localStorage.getItem('avatar_image')
img.src = str.replace(/"([^"]+(?="))"/g, '$1')
img.className="avatar_im_g798789798"

avatar.appendChild(img);
}

void async function updateHeaderView() {
    let hasUnreadNotifications = false
    if (authenticated) {
        hasUnreadNotifications = await fetchHasUnreadNotifications()
    }
    
header.innerHTML = `
<nav class="head_sidebar_433535">
<div class="head_sidebar_433535_1 sh_hd798789798_ds">
<li><button type="button" class="btn_sidebar btn btn-light">
<img src="/js/svg/home.svg" style="float: left;"/>  
<a  class="sl_h_2212127897837223" style="margin-left:5px" href="/"> 

  Домой </a>
</button>
</li>

<li><button type="button" class="btn_sidebar btn btn-light">
<a  class="sl_h_2212127897837223" href="/search" title="Search">
<img src="/js/svg/search.svg" />
Поиск
</a>
</button>
</li>

<li><button type="button" class="btn_sidebar btn btn-light">
<a  class="sl_h_2212127897837223" href="/perfomance" title="Search">

<img src="/js/svg/perfomance.svg" />
Мои работы
</a>
</button>
</li>
<li><button type="button" class="btn_sidebar btn btn-light">

<a class="sl_h_2212127897837223" href="/chat" >
<img src="/js/svg/email.svg" /> Сообщения </a><span class="mess"></span>
</button></li>
${authenticated ? `
<li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/${authUser.username}">
<img src="/js/svg/user.svg" />
Профиль</a>
</button></li><li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/${authUser.username}/update">
<img src="/js/svg/setting.svg" />
Настройки</a>
</button></li><li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/notifications" id ="notifications-link">
<img src="/js/svg/notification.svg" />
 Уведомление <span class="badge"></span></a>
</button></li><li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/none/publicate"><svg class="svg_left_side_6768" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.8 14.86"><defs><style>.cls-1{fill:#a4acb9;}</style></defs><title>public</title><path class="cls-1" d="M2.61,14.84a1,1,0,0,1-1-1V1a1,1,0,0,1,1-1h9.78a1,1,0,0,1,1,1V13.83a1,1,0,0,1-1,1Zm8.77-2V2H3.62V12.82Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M4.75,5.89a.61.61,0,0,1-.61-.61.6.6,0,0,1,.18-.43L5.54,3.62a.62.62,0,0,1,.71-.11L7.11,4,8.64,2.67a.6.6,0,0,1,.75,0l1.23.92a.61.61,0,1,1-.74,1h0l-.83-.62L7.59,5.14a.65.65,0,0,1-.67.08L6.09,4.8l-.91.91A.6.6,0,0,1,4.75,5.89Z" transform="translate(-1.6 0.01)"/><circle class="cls-1" cx="3.15" cy="7.43" r="0.61"/><circle class="cls-1" cx="3.15" cy="9.57" r="0.61"/><circle class="cls-1" cx="3.15" cy="11.71" r="0.61"/><path class="cls-1" d="M10.25,8H6.89a.61.61,0,0,1-.61-.61.61.61,0,0,1,.61-.61h3.36a.61.61,0,0,1,.61.61A.61.61,0,0,1,10.25,8Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M10.25,10.17H6.89a.62.62,0,0,1,0-1.23h3.36a.62.62,0,0,1,0,1.23Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M10.25,12.31H6.89a.62.62,0,0,1,0-1.23h3.36a.62.62,0,0,1,0,1.23Z" transform="translate(-1.6 0.01)"/></svg> Публикации</a>
</button></li>
`: `<li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/none">
<img src="/js/svg/user.svg" />
Профиль</a>
</button></li><li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/none/update">
<img src="/js/svg/setting.svg" />
Настройки</a>
</button></li><li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/notifications" id ="notifications-link">
<img src="/js/svg/notification.svg" />
 Уведомление <span class="badge"></span></a>
</button></li>
<li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/users/none/publicate"><svg class="svg_left_side_6768" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.8 14.86"><defs><style>.cls-1{fill:#a4acb9;}</style></defs><title>public</title><path class="cls-1" d="M2.61,14.84a1,1,0,0,1-1-1V1a1,1,0,0,1,1-1h9.78a1,1,0,0,1,1,1V13.83a1,1,0,0,1-1,1Zm8.77-2V2H3.62V12.82Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M4.75,5.89a.61.61,0,0,1-.61-.61.6.6,0,0,1,.18-.43L5.54,3.62a.62.62,0,0,1,.71-.11L7.11,4,8.64,2.67a.6.6,0,0,1,.75,0l1.23.92a.61.61,0,1,1-.74,1h0l-.83-.62L7.59,5.14a.65.65,0,0,1-.67.08L6.09,4.8l-.91.91A.6.6,0,0,1,4.75,5.89Z" transform="translate(-1.6 0.01)"/><circle class="cls-1" cx="3.15" cy="7.43" r="0.61"/><circle class="cls-1" cx="3.15" cy="9.57" r="0.61"/><circle class="cls-1" cx="3.15" cy="11.71" r="0.61"/><path class="cls-1" d="M10.25,8H6.89a.61.61,0,0,1-.61-.61.61.61,0,0,1,.61-.61h3.36a.61.61,0,0,1,.61.61A.61.61,0,0,1,10.25,8Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M10.25,10.17H6.89a.62.62,0,0,1,0-1.23h3.36a.62.62,0,0,1,0,1.23Z" transform="translate(-1.6 0.01)"/><path class="cls-1" d="M10.25,12.31H6.89a.62.62,0,0,1,0-1.23h3.36a.62.62,0,0,1,0,1.23Z" transform="translate(-1.6 0.01)"/></svg> Публикации</a>
</button></li>`}
<li><button type="button" class="btn_sidebar btn btn-light">
<a class="sl_h_2212127897837223" href="/groups"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.2 14"><defs><style>.cls-1{fill:#8198e9;}</style></defs><title>kk</title><path class="cls-1" d="M11.86,3.25,8,1a.28.28,0,0,0-.28,0L3.93,3.25a.28.28,0,0,0-.13.23v2a.28.28,0,0,0,.13.23l.94.54-.94.55A.28.28,0,0,0,3.8,7V9a.28.28,0,0,0,.13.23l.94.55-.94.54a.28.28,0,0,0-.13.23v2a.28.28,0,0,0,.13.23L7.76,15a.23.23,0,0,0,.14,0A.25.25,0,0,0,8,15l3.82-2.21a.27.27,0,0,0,.14-.23v-2a.27.27,0,0,0-.14-.23l-.94-.54.94-.55A.27.27,0,0,0,12,9V7a.27.27,0,0,0-.14-.23l-.94-.55.94-.54A.27.27,0,0,0,12,5.46v-2A.27.27,0,0,0,11.86,3.25Zm-4-1.66,3.28,1.89L7.9,5.38,4.62,3.48ZM4.34,4,7.63,5.85V7.19L4.34,5.3Zm0,3.53L7.63,9.38v1.34L4.34,8.83Zm0,3.53,3.29,1.89v1.34L4.34,12.36Zm3.83,3.23V12.91L11.45,11v1.34Zm3-3.71L7.9,12.44l-3.28-1.9.8-.46,2.34,1.35a.23.23,0,0,0,.14,0,.25.25,0,0,0,.14,0l2.34-1.35Zm-3,.18V9.38l3.28-1.89V8.83Zm3-3.71L7.9,8.91,4.62,7l.8-.46L7.76,7.9a.23.23,0,0,0,.14,0A.25.25,0,0,0,8,7.9l2.34-1.35Zm-3,.18V5.85L11.45,4V5.3Z" transform="translate(-3.8 -1)"/></svg>
 Комнаты</a>
</button></li>
</br></br>
<li>
<button id="logout-button">Выйти</button>
</li></br>
</div>
</br></br>
<div class="head_sidebar_433535_2 sh_hd798789798_ds">
<li>
<span>About</span>
</li>
</br>
<li>
<span>News</span>
</li>
</br>
<li>
<span>Nginx</span>
</li>
</div>
</br>
</nav>

`

    const badge =(header.querySelector('.badge'))
    const mess =(header.querySelector('.mess'))
    
    const logoutButton =(header.querySelector('#logout-button'))
    logoutButton.addEventListener('click', onLogoutButtonClick)
    const noty = /** @type {HTMLAnchorElement} */ (header.querySelector("#notifications-link"))
    noty.classList.add("has-unread-notifications")
    const searchForm = /** @type {HTMLFormElement} */ (document.getElementById("searcher-form"))
    const searchInput = searchForm.querySelector("input")
    const mess_notify=document.querySelector(".notyfi")
    const notify = document.querySelector(".notyfis")
    const onSearchFormSubmit = ev => {
        ev.preventDefault()
       
        const searchQuery = searchInput.value.trim()
        navigate("/searcher?q=" + encodeURIComponent(searchQuery))

    }
    searchForm.addEventListener("submit", onSearchFormSubmit)
    const timelinez = await fetchNotifications()
   /* var time = setInterval(function() {
        var date = new Date();
        document.querySelector(".r456_sib809809_1").innerHTML = (date.getDate() + "." + date.getMonth() + "." + date.getFullYear());
        document.querySelector(".r456_sib809809_2").innerHTML = ('</br>'+date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
      }, 1000);*/
      let nowDate = new Date(),
    nowDateNumber = nowDate.getDate(),
    nowMonth = nowDate.getMonth(),
    nowYear = nowDate.getFullYear(),
    container = document.getElementById('month-calendar'),
    monthContainer = container.getElementsByClassName('month-name')[0],
    yearContainer = container.getElementsByClassName('year-name')[0],
    daysContainer = container.getElementsByClassName('days')[0],
    prev = container.getElementsByClassName('prev')[0],
    next = container.getElementsByClassName('next')[0],
    monthName = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
let curDate = nowDate.setMonth(nowDate.getMonth() - 1);
console.log(nowDate.getFullYear());
function setMonthCalendar(year,month) {
    let monthDays = new Date(year, month + 1, 0).getDate(),
        monthPrefix = new Date(year, month, 0).getDay(),
        monthDaysText = '';

    monthContainer.textContent = monthName[month];
    yearContainer.textContent = year;
    daysContainer.innerHTML = '';

    if (monthPrefix > 0){
        for (let i = 1  ; i <= monthPrefix; i++){
            monthDaysText += '<li></li>';
        }
    }

    for (let i = 1; i <= monthDays; i++){
        monthDaysText += '<li>' + i + '</li>';
    }

    daysContainer.innerHTML = monthDaysText;

    if (month == nowMonth && year == nowYear){
       const days = daysContainer.getElementsByTagName('li');
        days[monthPrefix + nowDateNumber - 1].classList.add('date-now');
    }
}

setMonthCalendar(nowYear,nowMonth);

prev.onclick = function () {
    let curDate = new Date(yearContainer.textContent,monthName.indexOf(monthContainer.textContent));

    curDate.setMonth(curDate.getMonth() - 1);

    let curYear = curDate.getFullYear(),
        curMonth = curDate.getMonth();

    setMonthCalendar(curYear,curMonth);
}

next.onclick = function () {
    let curDate = new Date(yearContainer.textContent,monthName.indexOf(monthContainer.textContent));

    curDate.setMonth(curDate.getMonth() + 1);

    let curYear = curDate.getFullYear(),
        curMonth = curDate.getMonth();

    setMonthCalendar(curYear,curMonth);
}
  
    console.log(timelinez,"timelineztimelinez")
    var j=1
    var z=1
    for (var i=0; i<timelinez.length; i++){
        if (timelinez[i].Type == "message"){
       mess.innerHTML = j
       mess_notify.innerHTML+="<style>.notyfi{background:red;}</style>"
       j++
       
}else {
    badge.innerHTML = z
    notify.innerHTML+="<style>.notyfis{background:red; }</style>"
    z++
}
  }
   
/**
 * 
 * @param {import("/js/types.js").Notification} notification 
 */

const onGA = async comment => {
   

   if( comment.ModCl == "group"){
      
    dispatchEvent(new CustomEvent("gparrive", {detail: comment}))
   }
   else if (comment.ModCl == "noty"){
    noty.classList.add("has-unread-notifications")
    dispatchEvent(new CustomEvent("notificationarrive", {detail: notification}))
    myAudio.src ="https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3"
   myAudio.play()
   if (notification.Type =="message"){
       mess.innerHTML++
       mess_notify.innerHTML+="<style>.notyfi{background:red;}</style>"
   }
  
   else{
    notify.innerHTML+="<style>.notyfis{background:red; }</style>"
    badge.innerHTML++
    
   }
    
    const match = rePostRoute.exec(location.pathname)
    if (match !== null) {
        const postID = decodeURIComponent(match.groups["PostID"])
        if (postID === notification.postID) {
          
            return
        }
    }

    const permission = await Notification.requestPermission()
    if (permission !== "granted") {
        return
    }

    const sysNotification = new Notification("New notification", {
        tag: notification.ID,
        body: getNB(notification),
    })

    /**
     * @param {Event} ev
     */
    const onSysNotificationClick = async ev => {
        ev.preventDefault()
        
        sysNotification.close()
        navigate(getNotificationHref(notification))
        await markNotificationAsRead(notification.ID)
        notification.read = true

        
        
    }

    sysNotification.onclick = onSysNotificationClick
   }
   else if (comment.ModCl == "postcom"){
       badge.innerHTML++
       notify.innerHTML+="<style>.notyfis{background:red; }</style>"
    dispatchEvent(new CustomEvent("commentarrive", {detail: comment}))
   }
   else if (comment.ModCl == "mess"){
    if(comment.Messages !="typing"){
    mess.innerHTML++
    }
    notify.innerHTML+="<style>.notyfi{background:red; }</style>"
 dispatchEvent(new CustomEvent("messageev", {detail: comment}))
}
else if (comment.ModCl == "message"){
    if(comment.Messages !="typing"){
    mess.innerHTML++
    }
    notify.innerHTML+="<style>.notyfi{background:red; }</style>"
 dispatchEvent(new CustomEvent("messageev", {detail: comment}))
}
}
STG(onGA)
//STN(onNA)

}()
function getNB (notification){
    const actorsText = joinActors(notification.Actors)
    console.log(actorsText)
    switch (notification.Type) {
        case "follow": return actorsText + " followed you"
        case "comment": return actorsText + " commented on a post"
        case "post_mention": return actorsText + " mentioned you on a post"
        case "comment_mention": return actorsText + " mentioned you on a comment"
        default: return actorsText + " did something"
    }
}
/**
 * @param {string[]} actors
 * 
 */
}


export function joinActors(actors){
     
    console.log()
    actors.length
    
    
    switch (actors.length) {
        case 0: return "Somebody"
        case 1: return actors[0]
        case 2: return `${actors[0]} and ${actors[1]}`
        default: return `${actors[0]} and ${actors.length - 1} others`
    }
}


/**
 * @param {MouseEvent} ev
 */

function onLogoutButtonClick(ev){
    const button = /** @type {HTMLButtonElement} */ (ev.currentTarget)
    button.disabled = true
    localStorage.clear()
    location.reload()
    document.location.replace("/")

}
/**
 * @param {string} notificationID
 */
export async function markNotificationAsRead(notificationID) {
    console.log(notificationID)
    await doPost(`/api/notifications/${encodeURIComponent(notificationID)}/mark_as_read`)
}
/**
 * @param {function(import("/js/types.js").Notification):any} cb
 */
function STN(cb) {
    return subscribe("/api/notifications", cb)
    
}
function STG(cb) {
    const uid = JSON.parse( localStorage.getItem("auth_user"))
    return subscribe(`/api/group/${uid.id}/gps`,  cb)
    
}
/*function Mess() {
    return subscribe("/api/message")
    
}*/
/**
 * @returns {Promise<boolean>}
 */
function fetchHasUnreadNotifications() {
    return doGet("/api/has_unread_notifications")
}
/**
 * @param {import("/js/types.js").Notification} notification
 */
function getNotificationHref(notification) {
    switch (notification.Type) {
        case "follow": return `/users/${encodeURIComponent(notification.Actors[0])}`
        case "comment":
        case "post_mention":
        case "comment_mention": return `/post/${encodeURIComponent(notification.PostID)}`
        default: return location.href
    }
}
/**
 * @param {string=} before
 * @returns {Promise<import("/js/types.js").Notification[]>}
 */
function fetchNotifications() {
    return doGet(`/api/notifications`)
}
