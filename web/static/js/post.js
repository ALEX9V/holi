import {escapeHTML} from "/js/utils.js"
import {doPost} from "/js/http.js"
import {replaceNode, el} from "/js/utils.js"
import { transliterate } from "/js/utils.js"
/**
 * @param {import("/js/types.js").Post} post
 * @param {string=} timelineItemID
 */

export default function renderPost(post) {
    
   
   console.log(post)
   let arr= post.lk_j21_dv_i293.String.split(',');
    const ago = new Date(post.lk_j21_dv_i228).toLocaleString()
    
    const container = document.createElement('div')
    container.className="post_pt_ind"
    const hv_div_u = document.createElement('div')
    hv_div_u.className="hv_div_u"
    const li = document.createElement('li')
    const div = document.createElement("div")
    div.className = 'dv_p12323243'
    li.className = 'post-item'
    
    li.innerHTML = `
    <style>
    .img_src_user{
        width:100%;
    }
    .Capa_1{
       float:right;
    }
    </style>
   
    <div class="all">
    
    <div class="pt_mn_2434546454545454">
    
    <article class="post">
  
    <a href="/post/${post.lk_j21_dv_i223}">
   <img class="body_img" src="${post.lk_j21_dv_i290}"/>
   <div class="post-header">
   
   
   <img class="avatar" src="${post.lk_j21_dv_i217}"/>
   
   <a href="/users/${post.lk_j21_dv_i215}">${post.lk_j21_dv_i215}
   </a>
 
 
  
  </div>
 <div class="amounter"><h2>${post.lk_j21_dv_i292}</h2></div>
   </br>
    ` 
   
   
    li.innerHTML +=  `</div >`
    li.innerHTML += `
    
    
    </br></br>
    <div class="post-controls">
    <button class="like-button" id="like-button"><span class="likes-count">${post.lk_j21_dv_i229} </span></button>
    <a class="comment-count" href="/post/${post.lk_j21_dv_i223}"> ${post.lk_j21_dv_i214} </a>
    </div>
    `
   
    
    li.innerHTML +=  `
    </article>
   </div>
   </a>
    `
    hv_div_u.append(li)
   container.appendChild(hv_div_u)
   container.append(div)
    const likeButton = /** @type {HTMLButtonElement=} */ (li.querySelector(".like-button"))
    
    const readMore =  li.querySelector(".readmore")
    
    if (likeButton !== null) {
        const likesCountEl = likeButton.querySelector(".likes-count")

        const onLikeButtonClick = async () => {
            likeButton.disabled = true
            try {
                const out = await togglePostLike(post.lk_j21_dv_i223)

                post.lk_j21_dv_i229 = out.mm_65_dv_i244
                post.lk_j21_dv_i213 = out.mm_65_dv_i245

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