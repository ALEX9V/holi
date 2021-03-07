import { doGet, doPost } from "/js/http.js"
import  renderPost from "/js/post.js"
import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"
import { isAuthenticated } from "/js/auth.js"
import { navigate } from "/js/router.js"
const PAGE_SIZE = 7
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')
const div = document.createElement('div')
const url = new URL(location.toString())
template.innerHTML = `
<div class="container">
<h1>Лента</h1>

<div id="tag"><button id="more">Ещё</button><div class="feed" role="feed" aria-busy="false"><li class="post-itemss" >

<style>
.amounter h2{ color: rgb(154 160 162);}
.tags{
    display: inline-grid;
}
.tagi{
    display: inline-table;
    margin-left: 30px;
    margin-bottom: 30px;
    padding: 5px;
    border-radius:20px;
    box-shadow: rgb(66 66 138 / 25%) 0px 6px 18px 2px, rgb(163 169 174 / 30%) 0px 1px 2px 0px;
}
.tagi:hover
{background:#d0d6db;}
.amounter{
    color:#8198e9;
    margin-left:30px;
}
.load-more-button{
    position: fixed;
    bottom: 0;
    
}
#tags{display: none;}
.img_src_user{
    width:550px;
}
.btn_m{
    width: 200px;
    height: 100px;
    background: #ffffff;
    position: fixed;
    z-index: 2;
    float: inherit;
    margin-left: 470px;
    margin-top: 40px;
    display:none;
}
.btn_dropdowns_item{
    border: solid white;
    border-width: 0 0 0 3px;
    width: 100%;
    color: grey;
    background: white;
}
.btn_dropdowns_item:hover{
    border: solid #8198e9;
    border-width: 0 0 0 3px;
    border-radius: 0;
}
.post-itemss{
   height: 30px;
   display: inline-grid;
   background: white;
   margin-left: 33px;
   padding: 3px;
   border-radius: 50px;

}
#filter{
    display: inline-flex;
    margin-left:40px;
}
.btn_drop{margin-left: 200px;
    background: white;
    color: #a6afb8;
    border-radius: 20px;}
    .cldropev{margin-left: 200px;
        background: white;
        color: #a6afb8;
        border-radius: 20px;}
.btn_dropdown{
    margin-left: 10px;
    background: white;
    color: #a6afb8;
    border-radius: 20px;
}
.btn_lk{
    color:#8198e9;
    background:none;
    border-radius: 20px;
    box-shadow: rgb(66 66 138 / 25%) 0px 6px 18px 2px, rgb(163 169 174 / 30%) 0px 1px 2px 0px;
}
.gp-user-li{
   width: 40px;
   height: 10px;
   border-radius:50%;
   padding: 10px;
}
.tag_div{
   margin-top: 10px;
   font-size: 14px;
}
#tags{
    overflow:auto;
  width: 90%;
   height: 400px;
   background: white;
   box-shadow: 0 1px 20px 0px #bac3ca;
   border-radius: 30px;

}
</style>
<a class="tag_div" href="/tags/IT\телеком">IT/телеком</a>
<br>
</li><li class="post-itemss" >
<a class="tag_div" href="/tags/Продажи">Продажи</a>
<br>
</li><li class="post-itemss" >
<a class="tag_div" href="/tags/Админ.персонал">Админ.персонал</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/Маркетинг">Маркетинг</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/Наука">Наука/образование</a>
<br>
</li>

</div></div>
<div id="tags"></div>
<div id="filter"><h1 style="color:#8198e9"><button class="btn_fl_st btn_lk"> Фильтр ✦ </button><button class="btn_fl btn_lk"> Избранное ◉ </button></h1><button class="btn_drop ">⌗  ▿ </button><button class="btn_dropdown">Фильтр  ▿ </button><div class="btn_m"><li><button class="btn_dropdowns_item">По цене</button></li><li><button class="btn_dropdowns_item">Новее</button></li></div></div>
</br>
<style>
.btn_fl{ margin-left: 20px;}
#more{
    height: 35px;
    background: #8198e9;
    border-radius: 50px;
    font-size: 12px;
}
#tag{
    display: inline-flex;
    margin-left: 20px;
    margin-top: 30px;
    margin-bottom: 30px;
}
.user-profile{
    width:150px;
    background-color:white;
    height:60px;
    display: inline-block;
    margin-left:5px;
    margin-top:30px;
}
.post-item{
    width:80%;
    background-color:white;
    min-height:200px;
    padding:10px;
    border-radius:15px;
    position:relative;

}
.post-controls{
    margin-top:30px;
    position: absolute;
    bottom: 5px;
}
.post-content{
   padding: 0 20px;
}
.likes-count{
    color:white;
}
.dv_p12323243{
    width: 3px;
    background-color: #8198e9;
    height: 30px;
    margin-left: 40px;
}
.readmore{
    background-color:white;
    color: #8198e9;
}
</style>
<ul id="timeline-list"> </ul>


</div>
`

export default async function renderHomePage() {
    if (timeline === null || timeline.length === 0) {    
    timeline = await timelines()
    }
    const gp = document.querySelector(".gp")
    gp.innerHTML=""
    
    console.log(timeline)
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    
    const list = renderList({
        items: timeline,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem,
        reverse: false,
    })
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
   
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('more'))
    const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
    const searchQuery = url.searchParams.has("q") ? decodeURIComponent(url.searchParams.get("q")).trim() : ""
    const searchResultsOutlet =  /** @type {HTMLOListElement} */ (page.getElementById('tag'))
    const searchallTags =  /** @type {HTMLOListElement} */ (page.getElementById('tags'))
    const likes_dp = page.querySelector(".btn_fl")
    const likes_dp_st = page.querySelector(".btn_fl_st")
    const dropdown = page.querySelector(".btn_dropdown")
    const drop = page.querySelector(".btn_drop")
    const dropcls = document.createElement("div")
    dropcls.className="cldropev"
   
    const listofuser = document.querySelector("#chat_window_room")

    const lis = page.querySelector(".post-item")

  
    const listU = await listOfTags()
    const list1 = renderList({
    items: listU,
    renderItem: renderTags,
   
    pageSize: 0,
    reverse: true,
})
    const div3= document.createElement('div')
   const div34=document.querySelector(" .dv_p12323243")
    searchallTags.append(list1.el)
    listofuser.innerHTML="<img class='poster_img' src='https://i.pinimg.com/564x/e3/7a/ce/e37ace1a82768c19cfd15007c903b3f4.jpg' alt='winter'/><style>.poster_img{width:200px;padding:10px;}</style>"
    window.onpopstate = function (event) {listofuser.innerHTML=""}
    listofuser.append(div3)
    listofuser.append(dropcls)
    const dropcl = document.querySelector(".cldropev")
   
    //lis.insertAdjacentElement('afterEnd', div);
    /**
     * @param {Event} ev 
     */
   

    const onPageDrop = () => {
        const dropdownitem = document.querySelector(".btn_dropdowns_item")
        dropdown.innerHTML+="<style>.btn_m{display:block; }</style>"
        dropdownitem.addEventListener("click", onPageDropItem)
    }
    const onPageDrops = () => {
 
   drop.classList.remove("btn_drop")
   drop.classList.add("cldropev")
   drop.removeEventListener('click',onPageDrops);
   div3.innerHTML+="<style>.post-item{min-height: 100px; box-shadow:none;} #timeline-list{ margin-bottom: 60px;} .post-content, .tagi, .reader, .readmore, .post-item br {display:none;}  .amounter{display: inline-block;} .bl_pt{float:right;} .dv_p12323243{ display:none;}</style>"
   drop.addEventListener("click", onPageDropsCl)
    }  
    const onPageDropsCl = () => {
    
        div3.innerHTML+="<style>.post-item{min-height: 200px; box-shadow:none;} #timeline-list{ margin-bottom: 60px;} .post-content,  .reader, .readmore, .post-item br {display:block;} .tagi{display: inline-table;} .dv_p12323243{ display:block;} .amounter{display: block;} .bl_pt{float:left;}</style>"
         drop.className="btn_drop"
         drop.addEventListener("click", onPageDrops)
            }
    const onPageDropItem = () => {
       
        dropdown.innerHTML+="<style>.btn_m{display:none;}</style>"
    }
    const onPageDisconnect = () => {
        unsubscribeFromTimeline()
        list.teardown()
    }
    const onPagetag = () => {
       
        searchallTags.innerHTML+="<style>#tags{display: block; margin-bottom: 30px;}</style>"
    }
       /**
     * @param {Event} ev 
     */
    const onPageLike = async ev => {
       timelineList.innerHTML=""
       const isb = await isb_likes()
       const list2 = renderList({
        items: isb,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem,
        reverse: false,
    })
       timelineList.appendChild(list2.el)
        
    }
    const onPageLikeSt = async ev => {
        timelineList.innerHTML=""
        const isb = await timelines()
        const list2 = renderList({
         items: isb,
         loadMoreFunc: timelines,
         pageSize: 7,
         renderItem: renderTimelineItem,
         reverse: false,
     })
        timelineList.appendChild(list2.el)
         
     }
    timelineList.appendChild(list.el)
    drop.addEventListener("click", onPageDrops)
    likes_dp.addEventListener("click", onPageLike)
    dropdown.addEventListener("click", onPageDrop)
    likes_dp_st.addEventListener("click", onPageLikeSt)
    page.addEventListener("disconnect", onPageDisconnect)
    postButton.addEventListener("click", onPagetag)
    return page
}

function renderUserProfile(user, full = false) {
    const authenticated = isAuthenticated()
    const article = document.createElement("article")
    article.className = "user-profile"
    article.innerHTML = `<style>
    .follow-button span{color:white;}
    </style>
       
        <div class="user-stats">
            <a href="/users/${user.username}/followers">
                <span class="followers-count">${user.FollowersCount}</span>
                <span class="label">followers</span>
            </a>
            <a href="/users/${user.username}/followees">
                <span class="followees-count">${user.FolloweesCount}</span>
                <span class="label">followees</span>
            </a>
        </div>
    `

    const usernameText = article.querySelector(".user-username")
    const avatarPic = article.querySelector(".avatar")
    const followersCountSpan = /** @type {HTMLSpanElement} */ (article.querySelector(".followers-count"))
    const avatarInput = /** @type {HTMLInputElement=} */ (article.querySelector(".js-avatar-input"))
    const logoutButton = /** @type {HTMLButtonElement=} */ (article.querySelector(".logout-button"))
    const followButton = /** @type {HTMLButtonElement=} */ (article.querySelector(".follow-button"))

    if (full && user.me) {
        const onUsernameDoubleClick = () => {
            prompt("New username:", user.username)
        }

        const onAvatarDoubleClick = () => {
            avatarInput.click()
        }

        const onLogoutButtonClick = () => {
            logoutButton.disabled = true
            localStorage.clear()
            location.assign("/")
        }

        usernameText.addEventListener("dblclick", onUsernameDoubleClick)
        avatarPic.addEventListener("dblclick", onAvatarDoubleClick)
        logoutButton.addEventListener("click", onLogoutButtonClick)
    }

    if (followButton !== null) {
        const followText = followButton.querySelector("span")
        const onFollowButtonClick = async () => {
            followButton.disabled = true

            try {
                const out = await toggleFollow(user.username)
                followersCountSpan.textContent = String(out.followersCount)
                followButton.setAttribute("aria-pressed", String(out.following))
                
                followText.textContent = out.following ? "Following" : "Follow"
            } catch (err) {
                console.log(err)
                alert(err.message)
            } finally {
                followButton.disabled = false
            }
        }

        followButton.addEventListener("click", onFollowButtonClick)
    }

    return article
}
function renderTags(post) {
    
  
   
    
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-items-tag'
     
     li.innerHTML = `
     <style>
     .img_src_user{
         width:550px;
     }
     #tags .feed {
        margin-top: 20px;
     }
     .post-items-tag{
        width: 150px;
        display: inline-block;
        background: white;
        margin-left: 30px;
        margin-top:0px;
        padding: 5px;
        height:30px;
        color:grey;
       
     
     }
     .gp-user-li{
        width: 40px;
        height: 10px;
        border-radius:50%;
        padding: 10px;
     }
     .tag_div{
        margin-top: 10px;
     }
     

     </style>
 
     <a class="tag_div" href="/tags/${post.TID}" >${post.TID}</a>
     </br>
    
    </div>
     `
    
    
 return li
 }
/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines (before = 0) {
       
    return doGet(`/api/posts?before=${before}&last=${PAGE_SIZE}`)
 
 
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
 function isb_likes (before = 0) {
       
    return doGet(`/api/postz`)
 
 
 }
function listOfTags(before = 0) {
    return doGet(`/api/tags`)
}
   