import { doGet, doPost } from "/js/http.js"
import  renderPost from "/js/post.js"
import  renderList from "/js/list.js"
import {getAuthUser} from "/js/auth.js"
import { isAuthenticated } from "/js/auth.js"
import { navigate } from "/js/router.js"
import { transliterate } from "/js/utils.js"
const PAGE_SIZE = 7
var but = 0
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')
const div = document.createElement('div')
const url = new URL(location.toString())

template.innerHTML = `
<div class="container">

<form id="search-form" class="search-form">
<svg id="svg_hd_5758" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.01 512"><defs><style>.cls-1{fill:#8298e9;}</style></defs><title>loupe</title><path class="cls-1" d="M505.75,475.59,360.15,330a201.72,201.72,0,0,0,45.18-127.32C405.33,90.93,314.41,0,202.67,0S0,90.93,0,202.67,90.92,405.34,202.67,405.34A201.62,201.62,0,0,0,330,360.15l145.6,145.6a21.33,21.33,0,0,0,30.17-30.16ZM202.67,362.67c-88.24,0-160-71.77-160-160s71.76-160,160-160,160,71.76,160,160S290.9,362.67,202.67,362.67Z" transform="translate(0 0)"/></svg> <input type="search" id="searcher" name="q" placeholder="Search..." autocomplete="off" >
</form>
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
<a class="tag_div" href="/tags/${transliterate('Наука')}">Наука/образование</a>
<br>
</li>
</div></div>
<div id="tags"></div>
<div id="filter"><h1 style="color:#8198e9"><button class="btn_fl_st btn_lk"> Фильтр ✦ </button><button class="btn_fl btn_lk"> Избранное ◉ </button><a href="/users/none/publicate"><button style="margin-left:15px;" class="btn_lk"> ✚ Создать </button></a></h1><button class="btn_drop" style="margin-left: 145px;">⌗  ▿ </button><button class="btn_dropdown">Фильтр  ▿ </button><div class="btn_m"><li><button class="btn_dropdowns_item" value="1" >Новее</button></li><li><button class="btn_dropdowns_item" value="2">По цене</button></li></div></div>
</br>
<img src="" id="imgtppp"/>
</br>
<ul id="timeline-list"> </ul>
</div>
<style>
.avatar {
    border-radius: 25px;
    width: 180px;
}
</style>
`

export default async function renderHomePage(params) {
    

    timeline = await timelines(transliterate(transliterate(params.Tag), true))
    if (timeline === null || timeline.length === 0) {    
        timeline = await timelines(params.Tag)
    }
    const url = new URL(location.toString())
    const searchQuery = url.searchParams.has("q") ? decodeURIComponent(url.searchParams.get("q")).trim() : "" 
   
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/Rlhm.css">`
    chat.innerHTML=""
    const vvd = await togimpp(params.Tag)
  
    console.log(timeline)
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const searchForm = /** @type {HTMLFormElement} */ (page.getElementById("search-form"))
    const imgtg = /** @type {HTMLFormElement} */ (page.getElementById("imgtppp"))
    console.log(".timgag", vvd,"timgag" )
    imgtg.src=vvd.lk_j21_dv_i217
    const searchInput = searchForm.querySelector("input")
    const list = renderList({
        items: timeline,
        loadMoreFunc: timelines,
        pageSize: 7,
        renderItem: renderTimelineItem,
        reverse: false,
    })
     /**
     * @param {Event} ev
     */
    const onSearchFormSubmit = ev => {
        ev.preventDefault()
        const searchQuery = searchInput.value.trim()
        navigate("/searcher?q=" + encodeURIComponent(searchQuery))
    }
    searchForm.addEventListener("submit", onSearchFormSubmit)
    searchInput.value = searchQuery
    setTimeout(() => {
        searchInput.focus()
    })
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
   
    const postButton = /** @type {HTMLButttonElement} */ (page.getElementById('more'))
    const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
   
   
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
    listofuser.innerHTML=`
    <h2> Уровень Опыта</h2>
    <label class="up-checkbox-label"><input type="checkbox" name="checkbox" value="new">  <span> Новичок </span></label></br>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="med">  <span> Среднее </span></label></br>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="exp">  <span> Эксперт </span></label></br>
    <h2> Цена</h2>
    <div class="filter-budget-custom-option up-checkbox"><label class="up-checkbox-label d-inline-flex"style="display: inline-flex;">
    <input type="checkbox"name="checkbox"> <span class="up-checkbox-replacement-helper"><div class="check up-icon xs">
    </div></span> <div class="d-flex"style=" display: flex;"><div class="up-input-group m-sm-right">
     <input name="customMin" type="number" placeholder="Min" id ="rl-input-sm1" class="rl-input rl-input-sm1" style="width:50px; height: 25px;    color: gray;
     background: white;"></div> <div class="up-input-group">
      <input name="customMax" type="number" placeholder="Max" id ="rl-input-sm2" class="rl-input rl-input-sm2" style="width:50px; height: 25px;     color: gray;
      background: white;"></div></div></label></div>
    <h2> Срок</h2>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox" value="temp">  <span> временная занятость </span></label></br>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox" value="long">  <span> на длительный срок </span></label></br>
    
    <h2> тип работы</h2>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="hour">  <span> поасовая </span></label></br>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="fix">  <span> фиксированная цена </span></label></br>
    <h2> Часы в неделю</h2>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="less">  <span> Менее 30 часов в неделю  </span></label></br>
    <label class="up-checkbox-label"><input type="checkbox"name="checkbox"value="more">  <span> Более 30 часов в неделю </span></label></br>
    
   </br>
    ` 
    var checkboxElems = document.querySelectorAll("input[type='checkbox']")
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
                const isb = await timelines(but,searchQuery)
                timelineList.innerHTML=""
                const list4= renderList({
                 items: isb,
                 loadMoreFunc: timelines,
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
alert()
   drop.classList.remove("btn_drop")
   drop.classList.add("cldropev")
   drop.removeEventListener('click',onPageDrops);
   div3.innerHTML+="<style>.post-item{min-height: 100px; box-shadow:none;} #timeline-list{ margin-bottom: 60px;}  .post-content, .tagi, .reader, .readmore, .post-item br {display:none;} .reader{display:none;}.amounter{display: inline-block;} .bl_pt{float:right;     margin-left: 300px;} .dv_p12323243{ display:none;}</style>"
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
        const isb = await timelines(but,searchQuery)
        const list2 = renderList({
         items: isb,
         loadMoreFunc: timelines,
         pageSize: 7,
         renderItem: renderTimelineItem,
         reverse: false,
     })
        timelineList.appendChild(list2.el)
         
     }
     const displayCheck = async ev => { 
        for (var i = 0; i < checkboxElems.length; i++) {
           if( checkboxElems[i].checked){
            checkboxElems[i].value="true"
           
           }
           else{
            checkboxElems[i].value="false"
           }
          }
          const lv_n = checkboxElems[0].value 
          const lv_m = checkboxElems[1].value 
          const lv_e = checkboxElems[2].value 
          const tm_o = checkboxElems[4].value 
          const tm_a = checkboxElems[5].value 
          const tp_h = checkboxElems[6].value 
          const tp_a = checkboxElems[7].value 
          const hr_m = checkboxElems[8].value 
          const hr_b = checkboxElems[9].value 
          const pr_b = document.getElementById("rl-input-sm1").value
          const pr_p = document.getElementById("rl-input-sm2").value
          const tmer = await timelines(but, searchQuery, lv_n,lv_m, lv_e,tm_o,tm_a,tp_h,tp_a,hr_m,hr_b,pr_b,pr_p) 
          timelineList.innerHTML=""
          const list = renderList({
             items: tmer,
             loadMoreFunc: timelines,
             pageSize: 7,
             renderItem: renderTimelineItem,
             reverse: false,
         })
        
          timelineList.appendChild(list.el)
 
     }
    timelineList.appendChild(list.el)

    drop.addEventListener("click", onPageDrops)
    likes_dp.addEventListener("click", onPageLike)
    dropdown.addEventListener("click", onPageDrop)
    likes_dp_st.addEventListener("click", onPageLikeSt)
    page.addEventListener("disconnect", onPageDisconnect)
    postButton.addEventListener("click", onPagetag)
    for (var i = 0; i < checkboxElems.length; i++) {
        checkboxElems[i].addEventListener("change", displayCheck);
      }
      
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
        background:  var(--color-it-root);
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
 *  *  @param {string=} search
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines (Tag,before = 0) {
       
    return doGet(`/api/tags/${Tag}`)
 
 
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

function listOfTags(before = 0) {
    return doGet(`/api/tags`)
}
function isb_likes (before = 0) {
       
    return doGet(`/api/postz`)
 
 
 }
 function togimpp (value = "") {
       
    return doGet(`/api/imgtg?value=${value}`)
 
 
 }