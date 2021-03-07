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
    const container = document.createElement('div')
    const li = document.createElement('li')
    const div = document.createElement("div")
    div.className = 'dv_p12323243'
    li.className = 'post-item'
    
    li.innerHTML = `
    <style>
    .img_src_user{
        width:100%;
    }
    </style>
    <div class="all">
    <div class="pt_mn_2434546454545454">
    
    <article class="post">
    <div class="post-header">
   
    </br>
     <img class="avatar" src="${post.lk_j21_dv_i217}"/>
     
     <a href="/users/${post.lk_j21_dv_i215}">${post.lk_j21_dv_i215}
     </a>
    <a href="/post/${post.lk_j21_dv_i223}">
    <time datetime="${post.lk_j21_dv_i228}">${ago} data</time>
    </a>
    </div>
    ` 
    if  (post.lk_j21_dv_i227.length>50){
       var ost = post.lk_j21_dv_i227.substring(0, 50)
       var lost = post.lk_j21_dv_i227.substring(50)
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
    <div class="post-content">${escapeHTML(post.lk_j21_dv_i227)}</div>
    `
    }
   
    li.innerHTML += `
    </br>
    <div class="post-controls" style="    display: contents;">
    <button class="like-button" id="like-button"><span class="likes-count">${post.lk_j21_dv_i229} </span></button>
    <a class="comment-count" href="/post/${post.lk_j21_dv_i223}"> ${post.lk_j21_dv_i214} </a>
    `
    if  (post.lk_j21_dv_i212==true){
        li.innerHTML += ` <button class="pt-cm-tt" ><span class="likes-count">Удалить </span></button>`
        li.innerHTML += ` <button class="pt-cm-tt" ><span class="likes-count">Обновить </span></button>`
    }
    `
    </div>
    </article>
   </div>
    `
   
   container.appendChild(li)
   container.append(div)
    const likeButton = /** @type {HTMLButtonElement=} */ (li.querySelector(".like-button"))
    
    const readMore =  li.querySelector(".readmore")
    
    if (likeButton !== null) {
        const likesCountEl = likeButton.querySelector(".likes-count")

        const onLikeButtonClick = async () => {
            likeButton.disabled = true
            try {
                const out = await togglePostLike(post.lk_j21_dv_i223)

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