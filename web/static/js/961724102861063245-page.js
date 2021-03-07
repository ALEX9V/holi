import { doGet, doPost } from "/js/http.js"

import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"

const PAGE_SIZE = 10
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')  
const div = document.createElement('div')
template.innerHTML = `
<div class="container">
<button class="btn-per-cl"> Исполнители</button><button class="btn-pr-cl"> Проекты</button>
</br></br>
<div class="pt-dd">
 <span>▽Пост</span>
 <span>★Исполнитель</span>
 <span style="margin-left: 53px;">#Лайки</span>
 <span style="margin-left: 53px;">#Коментари</span>
 <span>#Время</span>
 </div>
<ul id="timeline-list"> </ul>
</div>

<div id="bg-mess-it" >
</div>

`

export default async function renderHomePage() {
    if (timeline === null || timeline.length === 0) {    
    timeline = await fetcPost(JSON.parse(localStorage.getItem("auth_user")).username  )
    }
    const gp = document.querySelector(".gp")
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu_p6978678769876789.css">`
    console.log(timeline)
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const listofuser = document.querySelector("#chat_window_room")
    const btnpr = page.querySelector(".btn-pr-cl")
    const btnper = page.querySelector(".btn-per-cl")
    const btmessit = page.querySelector("#bg-mess-it")
    listofuser.innerHTML=`
    <img id='im-gg-ll' src='/js/svg/choices.svg'/>
    <div class="bd-gg-ll">
    <h2> ◆ Здесь вы можите общаться с исполнителями.</h2>
    <span> Помимо выбранного исполнителя вы можите пригласить других пользователей для этого сообщите пороль и ссылку на комнату.</span>
    </div>
    `   
    const list = renderList({
        items: timeline,
        loadMoreFunc: timelines,
        pageSize: PAGE_SIZE,
        renderItem: renderTimelineItem,
    })
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('post-form-button'))
    const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
    
    const lis = page.querySelector(".post-item")
   
    //lis.insertAdjacentElement('afterEnd', div);
    /**
     * @param {Event} ev 
     */
   
async function onBtnStar(ev){
        const a= this.closest("fieldset")
        const b= a.querySelector(".rd-pt-hd").innerHTML
       await fetcPost(b, this.title)
        }
    const onBtnproj = async() => {
       const timeline = await timelinesPr()
        const list = renderList({
            items: timeline,
            loadMoreFunc: timelines,
            pageSize: PAGE_SIZE,
            renderItem: renderTimelineItem,
        })
        timelineList.innerHTML=""
        timelineList.appendChild(list.el)
    }
    const onBtnper = async() => {
        const timeline = await timelines()
         const list = renderList({
             items: timeline,
             loadMoreFunc: timelines,
             pageSize: PAGE_SIZE,
             renderItem: renderTimelineItem,
         })
         timelineList.innerHTML=""
         timelineList.appendChild(list.el)
     }
    const onPageDisconnect = () => {
        unsubscribeFromTimeline()
        list.teardown()
    }
    timelineList.appendChild(list.el)
   const star = timelineList.querySelectorAll('.stars');

    for(let i = 0; i < star.length; i++) {
      //alert(star[i].title)
    star[i].addEventListener('click', onBtnStar)
    }
  
    timelineList.addEventListener('click', function(){
        const b = timelineList.querySelector(".rd-pt-hd").innerHTML
        const blbg = document.createElement("div")
        blbg.className="bg-mess"
        const blbgg = document.createElement("div")
        blbgg.className="fm-mess"
        blbgg.innerHTML=`
        <button id="pt-form-button" style=" color: #991aad; background:none;float: right;">✕</button><h1>Оставить отзыв</h1>
        </br>
        <div class="rating-area">
        <input type="radio" id="star-5" name="rating" value="5">
        <label for="star-5" class="stars" title="5"></label>	
        <input type="radio"  id="star-4" name="rating" value="4">
        <label for="star-4" class="stars" title="4"></label>    
        <input type="radio" id="star-3" name="rating" value="3">
        <label for="star-3" class="stars" title="3"></label>  
        <input type="radio" id="star-2" name="rating" value="2">
        <label for="star-2" class="stars" title="2"></label>    
        <input type="radio" id="star-1" name="rating" value="1">
        <label for="star-1" class="stars" title="1"></label>
    </div>
        <style>
        #bg-mess-it{
            z-index: 10;
            background: #3e3f48a1;
            position: fixed;
            width: 100%;
            height: 100vh;
            left: 0;
            top: 0;
          }
         .fm-mess{    width: 250px;
            height: 300px;
            background: white;
            border-radius: 30px;
            padding: 20px;
            margin-left: 40%;
            margin-top: 15%;
        }
        textarea{
            width: 213px;
            max-width: 213px;
            max-height: 100px;
            height: 100px;
            border-radius: 0;
            color: gray;
        }
        .rating-area {
            overflow: hidden;
            width: 135px;
            margin: 0 auto;
        }
        .rating-area:not(:checked) > input {
            display: none;
        }
        .rating-area:not(:checked) > label {
            float: right;
    width: 27px;
    padding: 0;
    cursor: pointer;
    font-size: 20px;
    line-height: 32px;
    color: lightgrey;
    text-shadow: 1px 1px #bbb;
        }
        .rating-area:not(:checked) > label:before {
            content: '★';
        }
        .rating-area > input:checked ~ label {
            color: #9919ad;
            text-shadow: 1px 1px #c60;
        }
        .rating-area:not(:checked) > label:hover,
        .rating-area:not(:checked) > label:hover ~ label {
            color: #9919ad;
        }
        .rating-area > input:checked + label:hover,
        .rating-area > input:checked + label:hover ~ label,
        .rating-area > input:checked ~ label:hover,
        .rating-area > input:checked ~ label:hover ~ label,
        .rating-area > label:hover ~ input:checked ~ label {
            color: #9919ad;
            text-shadow: 1px 1px goldenrod;
        }
        .rate-area > label:active {
            position: relative;
        }
        
        </style>
        </br>
        <textarea name='content' id="textareas" placeholder="Описание должно быть не менее 100 символов (обязательное поле)"></textarea>
        </br> 
        <label for="post-form-button" class="stars" title="Закрыть"></label>
        <button id="post-form-button" style="color: #991aad; background:none; ">Отправить</button>
        `
        blbg.append(blbgg)
        btmessit.append(blbg)
        const btn = blbgg.querySelector("#post-form-button")
        const stars= blbg.querySelectorAll(".stars")
        const bte = blbgg.querySelector("#pt-form-button")
        bte.addEventListener('click', async function(){
            btmessit.innerHTML=""
        })
        for(var i=0;i<5; i++){
        stars[i].addEventListener('click', function(){
         const d =this.title
          const t = blbg.querySelector("textarea").value
        btn.addEventListener('click', async function(){
           
            await fetcPost(b, d, t)
            
        })
    })
} 
    })
   
    btnper.addEventListener("click", onBtnper)
    btnpr.addEventListener("click", onBtnproj)
    page.addEventListener("disconnect", onPageDisconnect)
  
    return page
}
 function renderPost(post) {
    
    console.log(post)
    console.log(post.lk_j21_dv_i228)
     const ago = new Date(post.lk_j21_dv_i228).toLocaleString()
     console.log(ago)
     const container = document.createElement('div')
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-item'
     li.innerHTML = `
     <style>
     .img_src_user{
         width:550px;
     }
     </style>
     <div class="all">
     <div class="pt_mn_2434546454545454"> 
     <article class="post">
     <div class="post-header">
     <img src="${post.lk_j21_dv_i217}" style="width: 120px;"/>
     <div class="pt-hd-pp" style="height:30px; width:30px; background:#ad9fff; border-radius:30px;    box-shadow: rgb(66 66 138 / 25%) 0px 6px 18px 2px, rgb(163 169 174 / 30%) 0px 1px 2px 0px;     margin-left: 11px;
     display: inline-flex;"></div>
      <a href="/post/${post.lk_j21_dv_i223}"> ${post.lk_j21_dv_i223}
      </a>      
     <a href="/users/${post.lk_j21_dv_i229}">  ${post.lk_j21_dv_i229}
     </a>
     <a href="/post/${post.lk_j21_dv_i223}" style="margin-left: 55px;"> ${post.lk_j21_dv_i214}
     </a>
     <a href="/post/${post.lk_j21_dv_i223}"> ${ago}
     </a> 
     <div class="rd-pt-hd">${post.lk_j21_dv_i226}</div>  

     <button id="post-form-button">Publish   <div class="rd-pt-hd" style="display:none;">${post.lk_j21_dv_i226}</div>  </button>

     </div>  
     </div>
     
     </article>
    </div>
     `
    
    container.appendChild(li)

     const likeButton = /** @type {HTMLButtonElement=} */ (li.querySelector(".like-button"))
     
     const readMore =  li.querySelector(".readmore")
     
     if (likeButton !== null) {
         const likesCountEl = likeButton.querySelector(".likes-count")
 
         const onLikeButtonClick = async () => {
             likeButton.disabled = true
             try {
                 const out = await togglePostLike(post.ID)
 
                 post.lk_j21_dv_i229 = out.mm_65_dv_i245
                 post.lk_j21_dv_i213 = out.mm_65_dv_i244
 
                 likeButton.title = out.mm_65_dv_i244 ? "Unlike" : "Like"
                 likeButton.setAttribute("aria-pressed", String(out.mm_65_dv_i244))
                 likeButton.setAttribute("aria-label", out.mm_65_dv_i245 + " likes")
                 
                 likesCountEl.textContent = String(out.mm_65_dv_i245)
             } catch (err) {
                 console.error(err)
                 alert(err.message)
             } finally {
                 likeButton.disabled = false
             }
         }
         const onReadMore = async () => {
             const reader =  li.querySelector(".reader")
             reader.style.display = "block"
             readMore.style.display = "none"
             
         }
         if (readMore!=null){
         readMore.addEventListener("click", onReadMore)
         }
         likeButton.addEventListener("click", onLikeButtonClick)
     }
 return container
 }
 function togglePostLike(PostID) {
     return doPost(`/api/post/${PostID}/toggle_like`)
 }

/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines (before = 0) {
       
    return doGet(`/api/perfomance`)
 
 
 }
 function timelinesPr (before = 0,project ) {
    project= false
    return doGet(`/api/projects?project=${project}`)
 
 
 }
 /**
 * @param {import("js/types.js").TimelineItem} timelineItem
 */
function renderTimelineItem(timelineItem) {
    
    return renderPost(timelineItem, timelineItem.ID)
}
function fetcPost( username, before ) {
    return doGet(`/api/users/${username}/posts?before=${before}&last=4` )
}
 function fetcPostt(  user, value, val ) {
    return doPost(`/api/users/rating?user=${user}&value=${value}&val=${val}` )
}

   
function mime( ) {
    return doGet(`/api/mimes/` )
}