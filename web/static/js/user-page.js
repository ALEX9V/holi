import {doGet, doPost} from '/js/http.js'
import renderPost from '/js/link.js'

const template = document.createElement('template')
var script = document.createElement("script");  // create a script DOM node
    script.src = "https://www.gstatic.com/charts/loader.js"
    document.head.appendChild(script);
template.innerHTML = `
<style>
.post-item{
    width: 70vh;
}
.usr_pg{
    margin-left: 40px;
    width: 400px;
}
.user-profile{
    width:600px;
}
.btn_lk, .btn_drop{
    border-bottom: 2px solid #1d1e23;
    background: #21222a;
    color: #8198e9;
    height: 40px;

}
.btn_lk:hover{
    border-color: #8198e9;
    border-radius: 0;
}
.btn_drop:hover{
    border-color: #8198e9;
    border-radius: 0;
}
.bg-mess{
    display:none;
}
.container{
    width: auto;
}
</style>
<div class="container" >
<div id="user-div" >
</div>
<h1 style="color:#8198e9"><button class="btn_fl_st btn_lk bt-pb"> Портфолио ★ </button><button class="btn_fl_st btn_lk bt-pt"> Публикации ❖ </button><button class="btn_drop btn_lk"> Обо мне ◉ </button><button class="btn_fl_st btn_lk graph"> Активность ❖ </button></h1>
</br>
<div id="pt-active" >
</div>
<div id="pt-div-about" >
</div>
</br>
<div id="post-div-about_us" >
<div id="chart_div"></div>
</div>
<button id="load-more-button">Загрузить еще</button>
</br></br>
<h1 class="bt-h1">Публикации</h1>

<div id="post-div" >
</div>
</div>

<div id="bg-mess-it" >
</div>
`
export default async function renderUserPage(params) {
    const gp = document.querySelector(".gp")
    
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu_p6978676779876789.css">`
    const chat = document.querySelector("#chat_window_room")
    //const btmess = document.querySelector(".bg-mess")
   
    chat.innerHTML=`<img id='im-gg-ll' src='/js/svg/living-room.svg'/>
    <div class="bd-gg-ll">
    <h2> ◆ Здесь вы можите общаться с исполнителями.</h2>
    <span> Помимо выбранного исполнителя вы можите пригласить других пользователей для этого сообщите пороль и ссылку на комнату.</span>
    </div>`

    const [user, posts] = await Promise.all([
        fetchUser( params.username),
        fetcPost( params.username),

    ])
    for (const post of posts){
        post.user = user
    }
  
const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
const userDiv = page.getElementById("user-div")
const btmessit = page.querySelector("#bg-mess-it")
const btpt = page.querySelector(".bt-pt")
const btpb = page.querySelector(".bt-pb")
const graph= page.querySelector(".graph")
const postDiv = page.getElementById('post-div')
const drop = page.querySelector(".btn_drop")
const h1bt = page.querySelector(".bt-h1")
const div3 = page.querySelector("#post-div-about_us")
const loadMore =/** @type {HTMLButtonElement} */ page.getElementById('load-more-button')
console.log("user", user)




userDiv.appendChild(renderUserProfile(user))
for (const postz of posts){
    console.log(postz)
    postDiv.appendChild(renderPost(postz))
}
const stbt = userDiv.querySelector(".bn-st-rl")


const onPageDropz = async() => {

    stbt.innerHTML="свободен"
   stbt.classList.remove("bn-st-rl")
   stbt.classList.add("bn-st-rx")
    await statusEv(true)
    stbt.removeEventListener('click',onPageDropz);
    stbt.addEventListener("click", onPageDropsCls)
}
   // const stbк = userDiv.querySelector(".bn-st-rx")
   const onPageDropsCls = async() => {
        stbt.innerHTML="занят"
       stbt.classList.remove("bn-st-rx")
       stbt.classList.add("bn-st-rl")
        await statusEv(false)
        stbt.removeEventListener('click',onPageDropsCls);
        stbt.addEventListener("click", onPageDropz)
    }
    stbt.addEventListener("click",onPageDropz)
const onloadMoreButtonClick = async () =>{
    const lastTimelineItem = posts[posts.length - 1]
    const newTimelineItems = await fetcPost(params.username, lastTimelineItem.ID)
    console.log(lastTimelineItem.ID)
    posts.push(...newTimelineItems)
    for (const timelineItem of newTimelineItems){
        console.log(timelineItem)
        postDiv.appendChild(renderPost(timelineItem))
    }

}
const onloadMorePartClick = async () =>{
    h1bt.innerHTML="Портфолио"
    postDiv.innerHTML=""
    const prof = await timelinesPr(user.id)
    for (const postz of prof){
    postDiv.appendChild(renderPost(postz))
    }

}
const onloadMorePabClick = async () =>{
    h1bt.innerHTML="Публикации"
    postDiv.innerHTML=""
    const prof = await fetcPost(params.username)
    for (const postz of prof){
    postDiv.appendChild(renderPost(postz))
    }

}
const onloadGraphClick = async () =>{
    
   div3.innerHTML=`<div id="chart_div" style="width: 600px; height: 400px"></div>`

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBasic);
    
    function drawBasic() {
    
          var data = new google.visualization.DataTable();
          data.addColumn('number', 'X');
          data.addColumn('number', 'Активность');
          data.addRows([
            [0, 1],   [1, 0],  [2, 0],  [3, 0],  [4, 0],  [5, 0],
            [6, 0],  [7, 0],  [8, 0],  [9, 0],  [10, 0], [11, 0],
            [12, 0], [13, 0], [14, 0], [15, 0], [16, 0], [17, 0],
            [18, 0], [19, 0], [20, 0], [21, 0], [22, 0], [23, 0],
            [24, 0], [25, 0], [26, 0], [27, 0], [28, 0], [29, 0],
            [30, 0],[31, 0]
          ]);
     
    
          var options = {
            hAxis: {
              title: 'Дни'
            },
            vAxis: {
              title: 'Активность'
            }
          };
    
          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    
          chart.draw(data, options);
        
        }
        
  

}
graph.addEventListener('click', onloadGraphClick)
btpb.addEventListener('click', onloadMorePartClick)
btpt.addEventListener('click', onloadMorePabClick)
loadMore.addEventListener('click', onloadMoreButtonClick)
const likebutton = /** @type {HTMLButttonElement} */ (page.getElementById('like-button'))
const dell = document.querySelector(".pt-cm-tt")
const onPageDrops = () => {
    
    drop.classList.remove("btn_drop")
    drop.classList.add("cldropev")
   
    drop.removeEventListener('click',onPageDrops);
    div3.innerHTML+=`<style>#post-div-about_us{width: 600px;display: block; padding:30px; } </style>  <span >${user.About}</span> `
    drop.addEventListener("click", onPageDropsCl)
    dell.addEventListener("click", onPageDellCl)
     }  
     const onPageBTn = () => {
    
       alert()
       gp.innerHTML +=`
<style>
.bg-mess{
    display:block !important;
    width: 100%;
    height: 100%;
    background: #010017a1;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
}
.fm-mess{    width: 300px;
    height: 500px;
    background: white;
    margin-left: 40%;
    margin-top: 200px;
    border-radius: 30px;
    padding: 30px;
}
#textareas{    max-width: 90%;
    width: 90%;
    max-height: 200px;
    height: 200px;}
</style>

`
const blbg = document.createElement("div")
blbg.className="bg-mess"
const blbgg = document.createElement("div")
blbgg.className="fm-mess"
blbgg.innerHTML=`<h1>✦ Чат</h1>
</br></br>
<button id="pt-form-button">◁</button></br></br><span style="font-size: 18px;color: black;"><img style="width: 25px;border-radius: 50%;" src="${user.URL}"/>написать сообщение для ${user.username}</span></br></br><textarea name='content' id="textareas" placeholder="Описание должно быть не менее 100 символов (обязательное поле)"></textarea>
</br> 
</br>
<button id="post-form-button">Publish</button>`
blbg.append(blbgg)
btmessit.append(blbg)
const btnd = document.querySelector("#pt-form-button")
btnd.addEventListener('click', function(){
    btmessit.innerHTML=""

})
const btn = document.querySelector("#post-form-button")
btn.addEventListener('click', async function(){
    const uid2 = user.id
    console.log(user.id, "hhjkhkhjkl")
    const message = document.querySelector("#textareas").value
    const value = "message"
    const timelineItem = await publishPost({uid2, message, value })
})

         } 
     const onPageDropsCl = () => {
    
        div3.innerHTML=""
          drop.className="btn_drop"
         
          drop.addEventListener("click", onPageDrops)
             }
             const onPageDellCl = () => {
    
              alert()
                     }           
drop.addEventListener("click", onPageDrops)
const btnmess =userDiv.querySelector("#dv-mess-ln")
btnmess.addEventListener("click", onPageBTn)
return page
}
/**
 * 
 * @param {import('/js/types.js).UserProfile} user 
 */

function renderUserProfile(user) {
    console.log(user)
    let arr= user.Skils.split(',');
    const ago = new Date(user.Ago).toLocaleString()
    const divs = document.createElement('div')
    divs.className = 'user-profile'
    divs.innerHTML = `
    <style>.user-profile{ margin-top: 60px;}
.pp-dd{
    float:right;
}
    .tags{
        display: inline-grid;
    }
    .tagi{
        display: inline-table;
        margin-left: 30px;
        margin-bottom: 30px;
        padding: 5px;
        border-radius:20px;
        box-shadow: rgb(17 17 36 / 25%) 0px 6px 18px 2px, rgb(92 99 104 / 30%) 0px 1px 2px 0px;
    }
    .tagi:hover
    {background:#d0d6db;}
    .amounter{
        color:#8198e9;
        margin-left:30px;
    }
    .post-item{
        background-color: #21222a;
    margin-bottom: 40px;
    border-radius: 10px;
    padding: 20px;
    height: 400px;
    width: 250px;
    overflow: auto;
    float: left;
    margin-left: 30px;
    margin-top: 40px;
    }
    .avatar{
        border-radius: 0px;
width: 250px;
    }
    h1{
        color: #8298e9;
    }
    .img_i7665656545{
        border-radius:50%;
        height:100px;
        width: 100px;
    }
    .likes-count{
        color:white;
    }
    textarea{
        background-color: rgb(255, 255, 255);
border: none;
color: #424242;
padding: 0 1rem;
height: 2rem;
border-radius: .25rem;
font-size: 1rem;
    }
   
    .rating {
        width: 100px;
        height: 40px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: flex-end;
      }
      
      .rating:not(:checked)>input {
        display: none;
      }
      
      .rating:not(:checked)>label {
        width: 40px;
        cursor: pointer;
        font-size: 18px;
        color: lightgrey;
        text-align: center;
        line-height: 1;
      }
      
      .rating:not(:checked)>label:before {
        content: '★';
      }
      
      .rating>input:checked~label {
        color: #9919ad;
      }
      
      
      
 
</style>
    <div style="display: flex; border-right: 2px solid #8198e9;">
    <img class="img_i7665656545" src="${user.URL}"/></br>
    <button id="load-more-button" style="position: absolute;
    margin-top: 115px;background-color:var(--color-bg-root);"><div class="rating">

    <input type="radio" id="star1" name="rating" value="1">
    <label for="star-1" title="Оценка «1»"></label>
  
    <input type="radio" id="star2" name="rating" value="2">
    <label for="star-2" title="Оценка «2»"></label>
  
    <input type="radio" id="star3" name="rating" value="3">
    <label for="star-3" title="Оценка «3»"></label>
  
    <input type="radio" id="star4" name="rating" value="4">
    <label for="star-4" title="Оценка «4»"></label>
  
    <input type="radio" id="star5" name="rating" value="5" required>
    <label for="star-5" title="Оценка «5»"></label>
  
  </div></br><span>${user.Raty}</span></button> 
    <div class="usr_pg">
     <h1>${user.Fname} ${user.LastNane}</h1> </br><button id="dv-mess-ln">Написать сообщение</button>
    </br></br>
     <span >Инженер</span>
    <span> Подписчки <a href= "/users/followers">${user.FollowersCount}</a></span>
    <span> Подписки <a href= "/users/followees">${user.FolloweesCount}</a></span>
</br></br>
<span >Страна:  <a class="pp-dd" href= "/users/followers">${user.City}</a></span>  </br></br>
${user.Status ? `<span >Статус:</span>  <span class="pp-dd bn-st-rl"> свободен</span> </br></br>` : '<span >Статус:</span>  <span class="pp-dd bn-st-rl"> занят</span> </br></br>'}

<span >Время регистрации:  <a class="pp-dd" href= "/users/followers">${ago}</a></span>  
</br> </br> ${user.Followeed ? `<span>Follow</span>` : ''}
     </div>
    
    </div> <div class="tags">
    `
     for (var i = 0; i < arr.length; i++ ){
        
        divs.innerHTML +=  ` <a  class="tagi" href="/tags/${arr[i]}">${arr[i]}
        </a> `
        }
        divs.innerHTML+=`   
        </div>
    </br>
     
<div>
</div>
    `
   if (user.Raty==0){
   }
   else if (user.Raty>0 && user.Raty<=1){
    divs.querySelector("#star5").checked = true
   }
   else if (user.Raty>1 && user.Raty<=2){
    divs.querySelector("#star4").checked = true
   }
   else if (user.Raty>2 && user.Raty<=3){
    divs.querySelector("#star3").checked = true
   }
   else if (user.Raty>3 && user.Raty<=4){
    divs.querySelector("#star2").checked = true
   }
   else if (user.Raty>4 && user.Raty<=5){
    divs.querySelector("#star1").checked = true
   }
    return divs

}


/**
 * @param {string} username
 * @returns {Promise<import('/js/types.js').UserProfile>}
 */
function fetchUser( username) {
    return doGet("/api/users/" + username )
}
/**
 * @param {string} username
 * @param {string} before
 * @returns {Promise<import('/js/types.js').Post[]>}
 */
function fetcPost( username, before ) {
    return doGet(`/api/users/${username}/posts?before=${before}&last=4` )
}
async function publishPost(input) {
    console.log(input,"input")
    const timelineItem = await doPost("/api/message", input)
    var myAudio = new Audio;
    myAudio.src ="https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3"
    myAudio.volume = 0.5
    myAudio.play()
    return timelineItem
}

function statusEv(value ) {
    return doPost(`/api/users/status?value=${value}` )
}
function timelinesPr (uid, before = 0, project) {
    project= true
    return doGet(`/api/projects?project=${project}&uid=${uid}`)
 
 
 }
