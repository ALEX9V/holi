import {escapeHTML} from "/js/utils.js"
import {doPost} from "/js/http.js"
import {replaceNode, el} from "/js/utils.js"
/**
 * @param {import("/js/types.js").Post} post
 * @param {string=} timelineItemID
 */

export default function renderPost(post) {
    
   console.log(post)
   console.log(post.CreatedAt)
    const ago = new Date(post.CreatedAt).toLocaleString()
    console.log(ago)
    const li = document.createElement('li')
    const div = document.createElement("div")
    div.className = 'itmm'
    li.className = 'post-item'
    
    li.innerHTML = `
    <div class="all">
    <div class="pt_mn_2434546454545454">
    
    <article class="post">
    <div class="post-header">
    
     <img class="avatar" src="${post.URL}"/>
     </br>
     <a href="/users/${post.Username}">${post.Username}
     </a>
    <a href="/post/${post.ID}">
    <time datetime="${post.CreatedAt}">${ago} data</time>
    </a>
    </div>
    ` 
    if  (post.Content.length>100){
       var ost = post.Content.substring(0, 150)
       var lost = post.Content.substring(150)
        li.innerHTML += `  
        <div class="post-content">${escapeHTML(ost)}</div>
        <span class="post-content reader">${escapeHTML(lost)}</span>
        <button class="readmore" id="readmore"> read more...</button>
        <style>
        .reader{
            display:none;
            
        }
        </style>
        </br></br>
        `
    }
    else{
        li.innerHTML +=  `  
    <div class="post-content">${escapeHTML(post.Content)}</div>
    `
    }
    
    li.innerHTML += `
    </br>
    <div class="post-controls">
    <button class="like-button" id="like-button"><span class="likes-count">${post.LikesCount} </span></button>
    <a class="comment-count" href="/post/${post.ID}"> ${post.ComCount} </a>
    </div>
    </article>
    <div class="dv_p12323243"></div></div>
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
function togglePostLike(PostID) {
    return doPost(`/api/post/${PostID}/toggle_like`)
}