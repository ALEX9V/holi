
import {doGet, doPost, doPostAvatar, doPostAvatarmult} from '/js/http.js'
import { ago, smartTrim } from "/js/utils.js"
import renderCom from '/js/coms.js'
import renderList from '/js/list.js'
const gp = document.querySelector(".gp")
gp.innerHTML=""
const template = document.createElement('template')
template.innerHTML = `

<div class="wrappers">
<div id="post"></div>
</div>
<div class="container">

<h1>Ссылки ▾</h1>
<div id="vidgp"><form id="gp-form" class="gp-form">
<textarea id="txtau" name='content' placeholder="Пример  ( https://example.com )"></textarea>
</br>
<button id="gp-form-button">Отправить</button>
</form></div> 
<br>
<p></p>
<div id="com"></div>
</br>

<h1>Лента ▾</h1>
<form id="post-form" class="post-form" name="fileinfo">
<input type="file"  name="upfile" required="" id="upfile" required multiple>
    <textarea id="txtaus" name='content' placeholder="Пишите..."></textarea>
    <button id="post-form-button" style="display:block;">Отправить</button>
</form>
<br>
<div id="comments-outlet" class="comments-wrapper"></div>
<ol id="timeline-list"></ol>
 
</div>
`     
   
export default async function renderPostUserpage(params) {
    const listofuser = document.querySelector("#chat_window_room")
    listofuser.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/Rlgi.css">`
    const PostID = BigInt(params.PostID)  
try{
    await checkregu(PostID)
    const [post, comments] = await Promise.all([
        fetchPost( PostID),
        fetchComment( PostID),

    ])
       const list = renderList({
        items: comments,
        renderItem: renderCom,
        loadMoreFunc: before => fetchComment(PostID, before),
        pageSize: 4,
        reverse: false,
    })
    const listU = await listOfUser(PostID)
        const list1 = renderList({
        items: listU,
        renderItem: renderUser,
        loadMoreFunc: before => fetchComment(PostID, before),
        pageSize: 4,
        reverse: true,
    })
    const listv = await listOfVid(PostID)
    const list2 = renderList({
    items: listv,
    renderItem: renderVid,
    loadMoreFunc: before => listOfVid(PostID, before),
    pageSize: 6,
    reverse: true,
})
const listm = await listOfMess(PostID)
    const list7 = renderList({
    items: listm,
    renderItem: renderMess,
    loadMoreFunc: before => listOfMess(PostID, before),
    pageSize: 15,
    reverse: true,
})
    const div3= document.createElement('div')
    window.onpopstate = function (event) {listofuser.innerHTML=""}
    listofuser.append(div3)
    div3.append(list1.el)  
    const div5 = document.createElement("h1")
    const page = /** {DocumentFragment} */ (template.content.cloneNode(true))
    const posts = page.getElementById('post')
    const coms = page.getElementById('timeline-list')
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('post-form-button'))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const gpForm =/** @type {HTMLFormElement} */ (page.getElementById('gp-form'))
    const CFTA =  postForm.querySelector('textarea')
    const GFTA =  gpForm.querySelector('textarea')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const authUserRaw = JSON.parse( localStorage.getItem("auth_user"))
    const vidjet = page.querySelector("#vidgp")
    const wrgp = document.querySelector(".gp")
    const divgp = document.createElement('div')
    divgp.className="wr-gp"
  
   // const postForm =/** @type {HTMLFormElement} */ (document.getElementById('post-form'))
    
    const formg = document.createElement('form')
    formg.className="post-formg"
    const textag = document.createElement('textarea')
    textag.className="post-form-txg"
    textag.placeholder="Написать сообщение ..."
   
    const submitg = document.createElement('button')
    submitg.className="post-form-buttong"
    submitg.innerHTML="➣"
    formg.appendChild(textag)
    formg.appendChild(submitg)
    wrgp.append(divgp)
    wrgp.append(formg)
    divgp.innerHTML=""
 
    div5.innerHTML="✦ Чат"
    divgp.append(div5)
    vidjet.append(list2.el)
    divgp.append(list7.el)
    const onCommentArrives = comment => {
       
       if (comment.GID == PostID){
        const li = document.createElement("li")
        if (comment.Type == "vidjet"){
        list2.enqueue(comment)
        }
    else if (comment.Type =="story"){
       
        list.enqueue(comment)
        }
        else if (comment.Type =="message"){
            list7.enqueue(comment)
            }
        }
        else{}
         
     }
     
    //const g =  subgp(PostID, onCommentArrives)
   
    const unsubscribeFromNotifications = subscribeToNotifications(onCommentArrives)
    

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
    
    addEventListener("gparrive", onNotificationArrive)
    return () => {
        removeEventListener("gparrive", onNotificationArrive)
        
    }
}
    
    /**
     * @param {Event} ev 
     */
     const ongpstubmit = async ev => {
        ev.preventDefault()
        const value = GFTA.value
        if (value === "") {
            GFTA.setCustomValidity("Empty")
            GFTA.reportValidity()
            return
        }
        
    try {
         const comment = await createVidjet( PostID,value)
      
         
        list.flush()
        postForm.reset()   
    } catch (error) {
       console.log( error)
      
       return page
    }finally{
        GFTA.disabled = false
            }
        }
    const onpostubmit = async ev => {
    ev.preventDefault()
    const title = CFTA.value
    if (title === "") {
        CFTA.setCustomValidity("Empty")
        CFTA.reportValidity()
        return
    }
    
try {
  //  console.log(postForm,"commentcomment")
 //   await publishImage( postForm)
 
var formz=new FormData(postForm)
formz.append( 'title', "title")
formz.append( 'username', authUserRaw.username)
console.log(formz)
const comment = await createComment(title, PostID, authUserRaw.username, formz)

//console.log(comment,"commentcomment")
  
    list.flush()
    formz.reset()   
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


   
    const onPageDisconnect = () => {
        unsubscribeFromComments()
        list.teardown()
    }
const postz = post[0]
     posts.appendChild(renderPost(postz))
     
     
 
     formg.addEventListener("submit", onPostFormSubmitMess)
    
     postForm.addEventListener('submit', onpostubmit)
     gpForm.addEventListener('submit', ongpstubmit)
     //postFormx.addEventListener("submit", onPostFormSubmit) 
     coms.appendChild(list.el)
     page.addEventListener("disconnect", onPageDisconnect)
    return page
}catch (err) {
    console.log(err)
    if (err) {
    if (confirm('User not found. Do you want to create an account?')){
      
        runRegistrationProgram( PostID)
    }
    return
}
    setTimeout(input.focus())
}
}

const onPostFormSubmitMess = async ev => {
    const textag = document.querySelector('.post-form-txg')           
    ev.preventDefault()
    const message = smartTrim(textag.value)
    if (message === "") {
        textag.setCustomValidity("Empty")
        textag.reportValidity()
        return
    }

    textag.disabled = true
    try {
        const PostID = location.pathname.split('/')[2]
        const timelineItem = await publishMess( {message}, PostID )

       
        messForm.reset()
        
    } catch (err) {
        console.error(err)
        alert(err.message)
        setTimeout(() => {
            textag.focus()
        })
    } finally {
        textag.disabled = false
       
    }

}
async function runRegistrationProgram( PostID) {
   var Pass = prompt("password:", Pass)
    if (Pass === null) {
        return
    } 
       try { 
       await chPgp(Pass, PostID)
       location.reload()
    } catch (err) {
        console.error(err)
        alert("errname")
        alert(err.name)
        if (err.name === "Error") {
            runRegistrationProgram(password)
        }
    }
}
function renderPost(post) {
    
    console.log(post)
    console.log(post.CreatedAT)
     const ago = new Date(post.CreatedAT).toLocaleString()
     console.log(ago)
    
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-item'
     
     li.innerHTML = `
 
     <div class="all">
     <div class="pt_mn_2434546454545454">
     
     <article class="post">
     <div class="post-header" style="width: 62vh;">
    
     </br>
      <h1 style=" display: contents;">◎ ${post.Theme} </h1> <button style="background:white;"></button>
     </br>
      <span>${post.Opis}
      </span>
     <a href="/post/${post.PID}">
     <time datetime="${post.CreatedAT}">${ago} data</time>
     </a>
     </div>  
     </div>
     </article>
    </div>
     `
    
    
   
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
 return li
 }
 function renderUser(post) {
    
    console.log(post)
   
    
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-item'
     
     li.innerHTML = `
     <style>
     .img_src_user{
         width:550px;
     }
     .gp-user-li{
        width: 20px;
        height: 20px;
        border-radius:50%;
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.08) -2px 0px 18px 2px, rgba(163, 169, 174, 0.3) 0px 1px 2px 0px;
        background: linear-gradient( 
            112deg
             , rgba(95,0,159,1) 16%, rgb(1 107 208) 50%, rgb(107 255 0) 100%);
                background-size: 300% 300%;
                -webkit-animation: AnimationName 8s ease infinite;
                -moz-animation: AnimationName 8s ease infinite;
                -o-animation: AnimationName 8s ease infinite;
                animation: AnimationName 8s ease infinite;
    }
     

     </style>
     <div class="all">
     <div class="pt_mn_2434546454545454">
     
     <article class="poster">
     <div class="post-header">
     <img src="${post.URL}" class="gp-user-li">
     <a href="/users/${post.Username}" >${post.Username}</a>
     </br>
     </div>  
     </div>
     </article>
    </div>
     `
    
    
 return li
 }

 function renderVid(post) {
    
    console.log(post)
   
     
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
     <div class="all" id="line_block">
     <div class="pt_mn_2434546454545454">
     
     <article class="post">
     <div class="post-header">
      <h1><svg id="_x31__x2C_5" data-name="Capa 1" width="40px" height="40px" fill="#8298e9" viewBox="0 0 512 435"><title>folder</title><path d="M474.5,83.5H260L248.88,66.8C238.3,50.93,215.07,38.5,196,38.5H37.5A37.54,37.54,0,0,0,0,76V436a37.54,37.54,0,0,0,37.5,37.5h437A37.54,37.54,0,0,0,512,436V121A37.54,37.54,0,0,0,474.5,83.5ZM497,436a22.52,22.52,0,0,1-22.5,22.5H37.5A22.52,22.52,0,0,1,15,436V76A22.52,22.52,0,0,1,37.5,53.5H196c14.09,0,32.59,9.9,40.4,21.62l13.3,19.95.11.17,29.95,44.92A7.49,7.49,0,0,0,286,143.5H474.5A22.52,22.52,0,0,1,497,166Zm0-300a37.3,37.3,0,0,0-22.5-7.52H290l-20-30H474.5A22.52,22.52,0,0,1,497,121Z" transform="translate(0 -38.5)"/><path d="M474.5,413.5H37.5a7.5,7.5,0,0,0,0,15h437a7.5,7.5,0,0,0,0-15Z" transform="translate(0 -38.5)"/></svg></h1>    
     <a href="${post.Link}" target="_blank">
     ${post.Link}
     </a>
     </div>  
     </div>
     </article>
    </div>
     `
    
   
 return li
 }
 function renderMess(post){
    console.log(post)
    let arr = post.Messages.split(',&&^%$%&&*^&**,');
    
     const li = document.createElement('li')
    
     li.className = 'post-item'
     li.innerHTML = `
     <article class="post post_${post.UsersnameR} ">
    <img src="${post.URL}">
    <button id="mess-form-button"></button><a href="/users/${post.UsersnameR}" >${post.UsersnameR}</a>
     </br>
    
     </br>
    <span class="mess_${post.UsersnameR}">${arr[0].substr(1)}</span> 
     `
     
     li.innerHTML +=` <span></span> 
     </article>
     `
  
     
     return li
   


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
    return doGet('/api/group/'+ PostID)
}
  /**
 * @param {import("/js/types.js").CreatePostInput} input
 * @returns {Promise<import("/js/types.js").TimelineItem>}
 */
async function publishPost(input) {
    console.log(input,"input")
    const timelineItem = await doPost("/api/message", input)
    var myAudio = new Audio;
    myAudio.src ="https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3"
    myAudio.volume = 0.5
    myAudio.play()
    return timelineItem
}

async function publishMess(mess, PostID) {
    
    const timelineItem = await doPost(`/api/message/${PostID}/gp`, mess)
    return timelineItem
}
/**
 * @param {string} PostID
 * @param {string} title
 * @returns {Promise<import("../types.js").Comment>}
 */
async function createComment(title, PostID, username, input) {
   
    const comment = await doPostAvatarmult(`/api/group/${PostID}/new`,   input)
    return comment
}
async function createVidjet( PostID, value) {
    
    const comment = await doPost(`/api/group/${PostID}/vidjet`, { value})
    return comment
}
/**
 * @param {bigint} PostID
 * @param {bigint=} before
 * @returns {Promise<import('js/types.js').Comment[]>}
 */
function fetchComment(PostID) {
    return doGet(`/api/group/story/${PostID}`)
}
function likes(PostID) {
    return doPost(`/api/post/${PostID}/toggle_like`)
}
/**
 *
 * @param {string} postID
 * @param {function(import("/js/types.js").Comment):any} cb
 */

function checkregu(postID) {
    return doPost(`/api/group/${postID}`)
}

function chPgp(Pass, PostID) {
   
    return doPost(`/api/groups/${PostID}`, {Pass})
}
function listOfUser(PostID, before = 0) {
    return doGet(`/api/groups/${PostID}/user?before=${before}`)
}
function listOfVid(PostID, before = 0) {
    return doGet(`/api/group/${PostID}/vidjet?before=${before}`)
}
function listOfMess(PostID, before = 0 ) {
    return doGet(`/api/message/${PostID}/gp?before=${before}`)
}
function hashHandler(){
    this.oldHash = window.location.hash;
    this.Check;

    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.hash){
            alert("HASH CHANGED - new has" + window.location.hash);
            that.oldHash = window.location.hash;
        }
    };
    this.Check = setInterval(function(){ detect() }, 100);
}

var hashDetection = new hashHandler();
async function publishImage( input, inputs) {
 
   
    await doPostAvatar("/api/milti", input)
}