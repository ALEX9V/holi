import { doGet, doPost } from "/js/http.js"

import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"

const PAGE_SIZE = 10

let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')

  
const div = document.createElement('div')
template.innerHTML = `
<div class="container">
<h1>Комнаты ▾</h1>
<link rel="stylesheet" type="text/css" href="/css/gp.css">
<ul id="timeline-list"> </ul>
<button id="load-more-button">load more</button>
</div>
`

export default async function renderHomePage() {
    if (timeline === null || timeline.length === 0) {    
   const timeline = await timelines()
    
    
    const gp = document.querySelector(".gp")
    gp.innerHTML=""
    console.log(timeline)
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const listofuser = document.querySelector("#chat_window_room")
    listofuser.innerHTML=`
    <img id='im-gg-ll' src='/js/svg/living-room.svg'/>
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
    const loadMore =/** @type {HTMLButtonElement} */ page.getElementById('load-more-button')
    //lis.insertAdjacentElement('afterEnd', div);
    /**
     * @param {Event} ev 
     */
   
   
  
    const onPageDisconnect = () => {
        unsubscribeFromTimeline()
        list.teardown()
    }
    timelineList.appendChild(list.el)
    const onloadMoreButtonClick = async () =>{
        
        const lastTimelineItem = timeline[timeline.length - 1]
        const newTimelineItems = await timelines( lastTimelineItem.ID)
        alert(lastTimelineItem.ID)
        timeline.push(...newTimelineItems)
        for (const timelineItem of newTimelineItems){
            console.log(timelineItem)
            timelineList.appendChild(renderPost(timelineItem))
        }
    
    }
    
    loadMore.addEventListener('click', onloadMoreButtonClick)
        page.addEventListener("disconnect", onPageDisconnect)
    return page
    
}
}
 function renderPost(post) {
    
    console.log(post)
    console.log(post.CreatedAT)
     const ago = new Date(post.CreatedAT).toLocaleString()
     console.log(ago)
     const container = document.createElement('div')
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-item'
     
     li.innerHTML = `
 
     <div class="all">
     <div class="pt_mn_2434546454545454">
     
     <article class="post">
     <div class="post-header">
    
     </br>
     <img class="img-pp-tt" src="${post.URL}" />
      <span>${post.Theme}</span>
      <a href="/group/${post.PID}">"show me"
      </a>      
     <a href="/group/${post.PID}">
     <time datetime="${post.CreatedAT}">${ago} data</time>
     </a>
     <span>${post.Pass}</span>
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
 
                 post.LikesCount = out.LikesCount
                 post.Liked = out.Liked
 
                 likeButton.title = out.Liked ? "Unlike" : "Like"
                 likeButton.setAttribute("aria-pressed", String(out.Liked))
                 likeButton.setAttribute("aria-label", out.LikesCount + " likes")
                 
                 likesCountEl.textContent = String(out.LikesCount)
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
function timelines (before=0) {
       
    return doGet(`/api/group?before=${before}&last=${PAGE_SIZE}`)
 
 
 }
 /**
 * @param {import("js/types.js").TimelineItem} timelineItem
 */
function renderTimelineItem(timelineItem) {
    
    return renderPost(timelineItem, timelineItem.ID)
}
  /**
  * @param {function(import('/js/types.js').TimelineItem): any} cb 
  */
 function timelineSub (cb) {
       
    return subscribe(`/api/timeline`)
 
 
 }


   