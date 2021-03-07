import { doGet, doPost, subscribe } from "/js/http.js"
import  renderPost from "/js/post.js"
import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"
import { smartTrim } from "/js/utils.js"

const PAGE_SIZE = 1
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')
template.innerHTML = `
<div class="container">
<h1>Messages</h1>
<style>
.post-item{
    min-height:100px;
    width:300px;
    background-color:white;
    border-radius:10px;
    margin-bottom:30px;
    padding:10px;
}
.post_mn46747_t56876876799{ 
    margin-left:300px;
    background-color:#8298e9;
}
</style>
<ol id="timeline-list"></ol>
<div>
<form id="post-form" class="post-form">
<textarea></textarea>
<button class="post-form-button" >


</button>
</form>
</div>
</div>
`

export default async function renderHomePage(params) {
    console.log(params.PostID,"params")
      var uid2 = params.PostID
    var id = uid2
    
    timeline = await timelines(id)
    
    
    console.log(timeline)
    
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const list = renderList({
        items: timeline,
        loadMoreFunc: timelines,
        pageSize: PAGE_SIZE,
        renderItem: renderMess,
    })
    const postFormTextArea = postForm.querySelector("textarea")
    const postFormButton = postForm.querySelector("button")
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('post-form-button'))
    const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
    /**
     * @param {Event} ev 
     */
 /**
     * @param {import("/js/types.js").TimelineItem} comment
     */
    const onCommentArrive = comment => {
        console.log(comment)
        const badge =document.querySelector('.mess')
        alert(badge.innerHTML)
        badge.innerHTML-=1
        if (comment.Sender === uid2){
        list.enqueue(comment)
        incrementCommentsCount()
    }

    }

    const unsubscribeFromComments = timelineSub(uid2, onCommentArrive)
   console.log(unsubscribeFromComments)
  
  
    const onPageDisconnect = () => {
        unsubscribeFromComments()
        list.teardown()
    }
    const onPostFormSubmit = async ev => {
        ev.preventDefault()
        const message = smartTrim(postFormTextArea.value)
        if (message === "") {
            postFormTextArea.setCustomValidity("Empty")
            postFormTextArea.reportValidity()
            return
        }

        postFormTextArea.disabled = true
        

        try {
            const timelineItem = await publishPost({  uid2, message })

            list.enqueue(timelineItem)
            list.flush()

            postForm.reset()
            
        } catch (err) {
            console.error(err)
            alert(err.message)
            setTimeout(() => {
                postFormTextArea.focus()
            })
        } finally {
            postFormTextArea.disabled = false
           
        }
    }


        timelineList.appendChild(list.el)
    
        postForm.addEventListener("submit", onPostFormSubmit)
        page.addEventListener("disconnect", onPageDisconnect)
    return page
}
function renderMess(post){
    console.log(post)

    
     const li = document.createElement('li')
     
     li.className = 'post-item'
     console.log(post.Mine,"mine")
    if(post.Mine==true){
        li.className += ' post_mn46747_t56876876799'

    }
     li.innerHTML = `
     <article class="post">
    
     <a href="/users/${post.UsersnameR}">${post.UsersnameR}</a>
    <span>${post.CreatedAt}</span></br><span>${post.Messages}</span>       
     </article>
     `
     return li
}


/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines ( ID) {
    console.log(ID)
       
    return doGet(`/api/message/${ID}/mess`)
 
 
 }
 
 /**
 * @param {import("js/types.js").TimelineItem} timelineItem
 */
function renderTimelineItem(timelineItem) {
    return renderMess(timelineItem, timelineItem.ID)
}
  /**
  *  @param {string} ID
 * @param {function(import("/js/types.js").TimelineItem):any} cb
  */
 function timelineSub (ID, cb) {
       
    console.log(ID)
       
    return subscribe(`/api/message/${ID}/mess`, cb)
 
 
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



   