
import {doGet, doPost, subscribe} from '/js/http.js'
import renderPost from '/js/pid.js'
import renderCom from '/js/coms.js'
import renderList from '/js/list.js'

const template = document.createElement('template')
template.innerHTML = `

<div class="wrapper">

<div id="post"></div>
</div>
<div>
<button class="pt-cm-tt bb-kk-i1" ><span class="likes-count">Удалить </span></button>
<button class="pt-cm-tt bb-kk-i2" ><span class="likes-count"><a class="aa-pp-bb">Обновить </a></span></button>
</div>
<div class="container">
</br></br>
<h1>Timeline</h1>
<span>Комментарии</span>
<div id="com"></div>
<ol id="timeline-list"></ol>
 <div id="comments-outlet" class="comments-wrapper"></div>
<form id="post-form" class="post-former">
    <textarea name='content' placeholder="Write something"></textarea>
    <button id="post-form-button">Publish</button>
</form>


</div>
`
export default async function renderPostUserpage(params) {
    const listofuser = document.querySelector("#chat_window_room")
    listofuser.innerHTML="<img class='poster_img' src='https://i.pinimg.com/564x/3c/6c/63/3c6c63d3d6583d12936f0f7af9d9808b.jpg' alt='winter'/><style>.poster_img{width:200px;padding:10px;}</style>"
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    gp.innerHTML=""
    chat.innerHTML=`<img id='im-gg-ll' src='/js/svg/living-room.svg'/>
    <div class="bd-gg-ll">
    <h2> ◆ Здесь вы можите общаться с исполнителями.</h2>
    <span> Помимо выбранного исполнителя вы можите пригласить других пользователей для этого сообщите пороль и ссылку на комнату.</span>
    </div>`
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu_p6978676549871389.css">`
    const timeline = await fetchComment()
    const PostID = BigInt(params.PostID)
 
    const [post, comments] = await Promise.all([
        fetchPost( PostID),
        fetchComment( PostID),

    ])

    
    const list = renderList({
        items: comments,
        renderItem: renderCom,
        loadMoreFunc: before => fetchComment(PostID, before),
        pageSize: 4,
        reverse: true,
    })

    
    let commentsCountEl = /** @type {HTMLElement=} */ (null)
    const page = /** {DocumentFragment} */ (template.content.cloneNode(true))
    const posts = page.getElementById('post')
    const coms = page.getElementById('timeline-list')
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('post-form-button'))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const CFTA =  postForm.querySelector('textarea')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const authUserRaw = JSON.parse( localStorage.getItem("auth_user"))
    const dell = page.querySelector(".bb-kk-i1")
    const alink = page.querySelector(".aa-pp-bb")
    alink.href=`/update/${params.PostID}`
 if (post[0].lk_j21_dv_i299 == true){
        
        postForm.remove()

      }
      if (post[0].lk_j21_dv_i212 == true){
        
        postForm.remove()

      }
  
    const incrementCommentsCount = () => {
       
        if (commentsCountEl === null) {
            commentsCountEl = posts.querySelector(".comment-count")
            console.log(commentsCountEl+"commentsCountEl")
        }
        post[0].lk_j21_dv_i214++
        commentsCountEl.textContent = String(post[0].lk_j21_dv_i214)
    }
    
    const  opppbbtt = async ev => {
await ppttdd(PostID)
    }
  
    /**
     * @param {Event} ev 
     */
    const onpostubmit = async ev => {
    ev.preventDefault()
    const title = CFTA.value
    if (title === "") {
        CFTA.setCustomValidity("Empty")
        CFTA.reportValidity()
        return
    }

try {
     const comment = await createComment(title, PostID, authUserRaw.username )
     postForm.remove()
     
    list.flush()
    postForm.reset()   
} catch (error) {
   console.log( error)
  
   return page
}finally{
    CFTA.disabled = false
        }
    }
     /**
     * @param {import("/js/types.js").Comment} comment
     */
    const onCommentArrive = comment => {
        list.enqueue(comment)
        incrementCommentsCount()
    }

   
    const onPageDisconnect = () => {
        unsubscribeFromComments()
        list.teardown()
    }
   
const postz = post[0]
     posts.appendChild(renderPost(postz))
     
   const tags= posts.querySelector(".tags")
   for (var i = 1; i < post.length; i++ ){
    var result = post[i].Tags.split(' ').join('')  
   tags.innerHTML +=  ` <a  class="tagi" href="/tags/${result}">${result}
   </a> `
   }
     
     dell.addEventListener('click', opppbbtt)
     

     postForm.addEventListener('submit', onpostubmit)
     const likebutton = /** @type {HTMLButttonElement} */ (page.getElementById('like-button'))
         likebutton.onclick = function() {
      
       
     }
     
     coms.appendChild(list.el)
    
     const unsubscribeFromNotifications = subscribeToNotifications(onCommentArrive)
     page.addEventListener("disconnect", onPageDisconnect)
     var dropdownitem = page.querySelectorAll(".bt-ct-cm"),index, button
     
     for (index = 0; index < dropdownitem.length; index++) {
         button = dropdownitem[index];
         button.addEventListener("click", async function (event) {
         var but =this.value
          alert(but)
          await ptcpcm(but)
          var sp = page.querySelector(".post")
          sp.innerHTML=`<span style="color: #8198e9;
          margin-left: 120px;">✔︎</span>
          <span> Был выбран как исполнитель </span>`
          event.preventDefault();
         });
     }
    return page
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
    
    addEventListener("commentarrive", onNotificationArrive)
    return () => {
        removeEventListener("commentarrive", onNotificationArrive)
        
    }
}
/**
 * @param {import("/js/types.js").CreatePostInput} input
 * @returns {Promise<import("/js/types.js").TimelineItem>} 
 */
async function publishCom( input, PostID) {
    input.value = input.title
    console.log( input)
    const timelineItem = await doPost(`/api/post/${PostID}`,input)
    //timelineItem.post.user = getAuthUser()
    console.log(timelineItem + "publishPost")
    return timelineItem
}
/**
 * @param {string} PostID
 * @returns {Promise<import('js/types.js').Post>}
 */
function fetchPost(PostID) {
    return doGet('/api/post/'+ PostID)
}
function ppttdd(PostID) {
    return doPost('/api/postd/'+ PostID)
}
/**
 * @param {string} PostID
 * @param {string} title
 * @returns {Promise<import("../types.js").Comment>}
 */
async function createComment(title, PostID, username) {
    const comment = await doPost(`/api/post/${PostID}`, { title, username})
    return comment
}
/**
 * @param {bigint} PostID
 * @param {bigint=} before
 * @returns {Promise<import('js/types.js').Comment[]>}
 */
function fetchComment(PostID) {
    return doGet(`/api/post/${PostID}/comment`)
}

function ptcpcm(PostID) {
    return doPost(`/api/orders/${PostID}`)
}
/**
 *
 * @param {string} postID
 * @param {function(import("/js/types.js").Comment):any} cb
 */




