import { doGet, doPost } from "/js/http.js"
import  renderPost from "/js/post.js"
import  rendernrews from "/js/news.js"
import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"
import { isAuthenticated } from "/js/auth.js"
import { navigate } from "/js/router.js"
import { transliterate } from "/js/utils.js"
const PAGE_SIZE = 7
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')
const div = document.createElement('div')

const url = new URL(location.toString())
template.innerHTML = `
<div class="container">
</br>

</br>
<h1>✧ Лента </h1>
<div id="tag"><button id="more">Ещё</button><div class="feed" role="feed" aria-busy="false"><li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('телеком')}">IT/телеком</a>
<br>
</li><li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Продажи')}">Продажи</a>
<br>
</li><li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Админперсонал')}">Админ.персонал</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Маркетинг')}">Маркетинг</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Маркетинг')}">Маркетинг</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Наука')}">Наука/образование</a>
<br>
</li>
<li class="post-itemss" >
<a class="tag_div" href="/tags/${transliterate('Наука')}">Наука/образование</a>
<br>
</li>
</div></div>
<div id="tags"></div>
<div id="filter"><h1 style="color:#8198e9"><button class="btn_fl_st btn_lk"> Фильтр ✦ </button><button class="btn_fl btn_lk"> Избранное ◉ </button></h1><button class="btn_drop ">⌗  ▿ </button><button class="btn_dropdown">Фильтр  ▿ </button><div class="btn_m"><li><button class="btn_dropdowns_item" value="2">По цене</button></li><li><button class="btn_dropdowns_item" value="1">Новее</button></li></div></div>
</br>

<ul id="timeline-list"> </ul>
<a href="" style="float:right; margin-right:80px; color:silver;">смотреть больше</a>
<h1>
▾ Самые популярные
</h1>
<h2>
Топ 10
</h2></br></br>
<ul id="timeline-list-recmomend" style="display: flow-root;"> </ul>
</br>
<h1 >
◉ Статьи
</h1>
<ul id="timeline-list-recmomend_2" style="display: flow-root;"> </ul>
<h1 >
▾ Рекомендуемые
</h1>
<ul id="timeline-list-recmomend_3" > </ul>
</div>
`

export default async function renderHomePage() {
    const gp = document.querySelector(".gp")
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/Rlhm.css">`
    if (timeline === null || timeline.length === 0) {    
    timeline = await timelines()
    }
const bl=true
const news=true
   const timeliner = await timelines(0, bl)
   const timeliner2 = await timelines(0, bl, news)
   const timeliner3 = await timelines(0, bl, false, true)
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
    const lister = renderList({
        items: timeliner,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem,
        reverse: false,
    })
    const lister2 = renderList({
        items: timeliner2,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem2,
        reverse: false,
    })
    const lister3 = renderList({
        items: timeliner3,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem,
        reverse: false,
    })
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const timelineLister = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list-recmomend'))
    const timelineLister2 = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list-recmomend_2'))
    const timelineLister3 = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list-recmomend_3'))
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
    timelineLister.appendChild(lister.el)
    timelineLister2.appendChild(lister2.el)
    timelineLister3.appendChild(lister3.el)
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
    listofuser.innerHTML=`
<img id="rl-ch-im-lf" src="/js/svg/project-management.svg"/>
</br>
<div class="di_v34">
    <h2 style="color: rgb(129 152 233);">◆ Уровень Опыта</h2>
    <p>Уровень опыта учитываеться при поиске исполнителя. Вы можите изменить уровень опыта в настройках опыта</p>
  </div> 
   </br>
    `
    window.onpopstate = function (event) {listofuser.innerHTML=""}
    listofuser.append(div3)
    listofuser.append(dropcls)
    const dropcl = document.querySelector(".cldropev")
   
    //lis.insertAdjacentElement('afterEnd', div);
    /**
     * @param {Event} ev 
     */
   

    const onPageDrop = () => {
        var dropdownitem = document.querySelectorAll(".btn_dropdowns_item"),index, button
        dropdown.innerHTML+="<style>.btn_m{display:block; }</style>"
        for (index = 0; index < dropdownitem.length; index++) {
            button = dropdownitem[index];
            button.addEventListener("click", async function (event) {
                dropdown.innerHTML+="<style>.btn_m{display:none; }</style>"
                var but =this.value
              
                const isb = await timeliness(but,searchQuery)
                timelineList.innerHTML=""
                const list4= renderList({
                 items: isb,
                 loadMoreFunc: timeliness,
                 pageSize: 7,
                 renderItem: renderTimelineItem,
                 reverse: false,
             })
                timelineList.appendChild(list4.el)
                event.preventDefault();
            });
        }
        
    }
    const onPageDrops = () => {
 
   drop.classList.remove("btn_drop")
   drop.classList.add("cldropev")
   drop.removeEventListener('click',onPageDrops);
   div3.innerHTML+="<style>.reader{display:none;} .post-item{min-height: 100px; box-shadow:none;} #timeline-list{ margin-bottom: 60px;} .post-content, .tagi, .reader, .readmore, .post-item br {display:none;}  .amounter{display: inline-block;} .bl_pt{float:right;} .dv_p12323243{ display:none;}</style>"
   drop.addEventListener("click", onPageDropsCl)
    }  
    const onPageDropsCl = () => {
    
        div3.innerHTML+="<style> p{margin-top: 38px;} .bl_pt{  float: left;  margin-bottom: 16px; } .post-item{min-height: 200px; box-shadow:none; width:588px;} #timeline-list{ margin-bottom: 60px;} .post-content, .readmore, .post-item br {display:block;} .reader{display:none;} .tagi{display: inline-table;} .dv_p12323243{ display:block;} .amounter{display: block;} .bl_pt{float:left;}.post-item{ box-shadow: rgb(66 66 138 / 25%) 0px 6px 18px 2px, rgb(163 169 174 / 30%) 0px 1px 2px 0px; }</style>"
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
    
  
   
    console.log(post, "tagpost")
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
        background: none;
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
 
     <a class="tag_div" href="/tags/${transliterate(post.lk_j21_dv_i224)}" >${post.lk_j21_dv_i224}</a>
     </br>
    
    </div>
     `
    
    
 return li
 }
/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines (before = 0, bl=false, news=false, rec=false) {
       
    return doGet(`/api/posts?before=${before}&last=${PAGE_SIZE}&bl=${bl}&news=${news}&rec=${rec}`)
 
 
 }
 function timeliness (but, search, lv_n,lv_m, lv_e,tm_o,tm_a,tp_h,tp_a,hr_m,hr_b,pr_b,pr_p, before = 0) {
       
    return doGet(`/api/posts?search=${search}&before=${before}&but=${but}&last=${PAGE_SIZE}&pr_b=${pr_b}&lv_n=${lv_n}&lv_m=${lv_m}&lv_e=${lv_e}&tm_o=${tm_o}&tm_a=${tm_a}&tp_a=${tp_a}&hr_b=${hr_b}`)
 
 
 }
 /**
 * @param {import("js/types.js").TimelineItem} timelineItem
 */
function renderTimelineItem(timelineItem) {
    
    return renderPost(timelineItem, timelineItem.ID)
}
function renderTimelineItem2(timelineItem) {
    
    return rendernrews(timelineItem, timelineItem.ID)
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
   