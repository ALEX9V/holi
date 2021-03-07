import { doGet, doPost, subscribe} from "/js/http.js"
import  renderPost from "/js/post.js"
import renderList  from "/js/list.js"
import {getAuthUser} from "/js/auth.js"
import { ago, smartTrim } from "/js/utils.js"

const PAGE_SIZE = 15
/**
             * @param {Event} ev 
             */
         /**
             * @param {import("/js/types.js").TimelineItem} comment
             */
            const onCommentArrive = comment => {
                const elMess= document.querySelector(".dgi"+comment.Username)
            
                if (comment.Messages != "typing"){
                elMess.style.cssText=` background: red;
                    width: 10px;
                    height: 10px;
                    display: inline-flex;
                    border-radius: 50%;
                    float: right;`
                }
                console.log(comment,"comment")
                const myUrl =   window.location.search
                const url= myUrl.substr(1);         
                const f = document.querySelector(".g_feed678687687")
                const b = document.querySelector(".post_mf373289")
                const d = b.querySelector(".post>a ")
                
                function urlify(text) {
                    var urlRegex = /(https?:\/\/[^\s]+)/g;
                    return text.replace(urlRegex, function(url) {
                        
                        if (url.match(/\.(jpeg|jpg|gif|png)$/) != null){
                            return  ' <style>.img_link_3543434{width:100%;}</style> <img class="img_link_3543434" src="' + url + '"/>'
                        }else if(url.match(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/)){
                            var ID = ''
                            url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                            if(url[2] !== undefined) {
                              ID = url[2].split(/[^0-9a-z_\-]/i);
                              ID = ID[0];
                              return  `<style>iframe{width:100%;}</style> <iframe width="250" src="https://www.youtube.com/embed/${ID}"></iframe>`
                            }
                            else {
                              ID = url;
                              return  `<style>iframe{width:100%;}</style> <iframe width="250"  src="https://www.youtube.com/embed/${ID}"></iframe>`
                            }
                          
                             
                           
          }
                        
                        else{
                      return '</br><a href="' + url + '">' + url + '</a></br>';
                        }
                    })
                  }
                  
                  var text = comment.Messages;
                  
                  var Messages = urlify(text);
                  console.log(comment.Username, "Messages")
                  
             
                if(url==comment.Username){
                    if (comment.Messages == "audio")  {
                        const lix= document.createElement("li")
                        lix.className="m-item879798798_v1 "
                        var sound      = document.createElement('audio');
                        sound.id       = 'audio-player';
                        sound.controls = 'controls';
                        sound.src      = comment.Value;
                        sound.type     = 'audio/webm';
                         lix.innerHTML = `
                         
                         <article class="post ">
                        
                         <a href="/users/${comment.Username}">${comment.Username}</a>
                        <span>${comment.CreatedAt}</span>      
                         </article>
                         `
                         lix.append(sound)
                         f.prepend(lix)
                         return f
                    }
                if (comment.Messages == "typing")  {
                    const div = document.querySelector(".ms_t34343689080")
                    div.innerHTML=comment.Username+" typing message"
                    const c = document.querySelector(".pt76397654_687687")
                    f.innerHTML+=`<style>
 .ms_t34343689080{display:block; color:#a7afb5;margin-left: -30px;}
.ms_t34343689080:after {
    content: '.';
    animation: loading 1s ease alternate infinite;
}

@keyframes loading {
    60%  { text-shadow: 0.35em 0 0 currentColor; }
    100% { text-shadow: 0.35em 0 0 currentColor, 0.75em 0 0 currentColor; }
}
</style>`
setTimeout(function () {
    div.innerHTML="" 
    f.innerHTML+=`<style>.ms_t34343689080{display:none;}</style>`

 }, 6000)
 return f
                }
                else{
        
                const lix= document.createElement("li")
               lix.className="m-item879798798_v1 post_mn46747_t56876876799"
              
               
                lix.innerHTML = `
                <style>
                span a {
                    color:white;
                }
                span a:hover {
                    color:blue;
                }
                </style>
                <article class="post ">
               
                <a  href="/users/${comment.Username}">${comment.Username}</a>
               <span>${comment.CreatedAt}</span></br><span>${Messages}</span>       
                </article>
                `
                f.prepend(lix)
                return f
                }
                
                }
        
            }
            var z = localStorage.getItem("auth_user")
            var l = JSON.parse(z).id
    //const unsubscribeFromComments = timelineSub(l, onCommentArrive)
    const unsubscribeFromComments = subscribeToNotifications(onCommentArrive)
let timeline = /** @type {import("/js/types.js").TimelineItem} */ (null)
const template = document.createElement('template')
template.innerHTML = `
<div class="container">
<ol id="timeline-list"></ol>
<button id="load-more-button">Загрузить еще</button>
<div class="pt76397654_687687"></div>
</div>
`

export default async function renderHomePage() {
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    const badge =document.querySelector('.mess')
    badge.innerHTML=``
    gp.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu_p6978676669876789.css">`
    chat.innerHTML=`<img id='im-gg-ll' src='/js/svg/notes.svg'/>
    <div class="bd-gg-ll">
    <h2> ◆ Здесь вы можите вести переписку с пользователями.</h2>
    <span> Для тогого, чтобы начать найдите пользователя и выберите написать сообщение.</span>
    </div>`
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const timeline = await timelines()
   
    await Notifications()
    if (timeline.length==0){
        page.querySelector(".container").remove()
        page.innerHTML = ``
        const gp = document.createElement("div") 
        gp.innerHTML =`
      
        <img id='im-gg-ll' src='/js/svg/notes.svg'/>
        </br><h1 style="margin: 0 0 0 20%;"> Ой, у вас нет сообщений!  =(</h1><p style="width: 70vh; color:silver; text-align: center;">(Внимание: для того чтобы начать переписку вам нужно найти пользователя, для этого воспользуйтесь поиском: <a href="/search"> нажмите чтобы перейти</a> ) </p>
        `
        
        page.append(gp)
        return page
    }else{
    
    console.log(timeline)
    //const timelinez = await fetchNotifications()
   
    
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const loadMore =/** @type {HTMLButtonElement} */ page.getElementById('load-more-button')
    const list = renderList({
        items: timeline,
        loadMoreFunc:  timelines,
        pageSize: -1,
        renderItem: renderMess,
    })

     
  
    //const postFormButton = postForm.querySelector('button')
    const timelineList = /** @type {HTMLOListElement} */ (page.getElementById('timeline-list'))
    const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
    
   
  
    //const timelinec = await fetchNotificationv()
 

    /**
     * @param {Event} ev 
     */


  
    const onPageDisconnect = () => {
        unsubscribeFromComments()
        list.teardown()
    }

       
       

        timelineList.appendChild(list.el)
        let arr = timeline[0].Messages.split(',');
       
        if( arr[3].slice(0, -1) =="") {
            const elMess= timelineList.querySelector(".dgi"+timeline[0].UsersnameR)
           
            elMess.style.cssText=`background: red;
            width: 10px;
            height: 10px;
            display: inline-flex;
            border-radius: 50%;
            float: right; `
        }
        const onloadMoreButtonClick = async () =>{
            const lastTimelineItem = timeline[timeline.length - 1]
            const newTimelineItems = await timelines( lastTimelineItem.ID)
            console.log(lastTimelineItem.ID)
            timeline.push(...newTimelineItems)
            for (const timelineItem of newTimelineItems){
                console.log(timelineItem)
                timelineList.appendChild(renderMess(timelineItem))
            }
        
        }
        
        loadMore.addEventListener('click', onloadMoreButtonClick)
    
        page.addEventListener("disconnect", onPageDisconnect)
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
    addEventListener("messageev", onNotificationArrive)
    return () => {
        removeEventListener("messageev", onNotificationArrive)
        
    }
}
    
/**
 * 
 * @param {import("/js/types.js").Notification} notification 
 */
const onNA = async notification => {
    timeline = await timelines()
    

   if (notification.Type =="message" ){
     for (var i=0; i <timeline.length; i++){
         if(timeline[i].UsersnameR==notification.Actors[0]){
            const counter = document.querySelector(".mess_b_"+timeline[i].UsersnameR)
            const mess = document.querySelector(".mess_"+timeline[i].UsersnameR)
            mess.innerHTML = "новое сообщение"
         counter.innerHTML++
          }
    }
   }
   else{
    
   }
    
  
}

function renderMess(post){
   
    let arr = post.Messages.split(',');
    
     const li = document.createElement('li')
    
     li.className = 'post-item'
     li.innerHTML = `

     <article class="post post_${post.UsersnameR} ">
    <img  class="chat_img" src="${post.URL}">
     <a class="${post.UsersnameR}" href="/users/${post.UsersnameR}" >${post.UsersnameR}</a><div class="dgi${post.UsersnameR}" style="display:none;"></div>
     </br>
     <button id="mess-form-button">${post.UsersnameR}</button>
     `

     if  (arr[0].substr(1).length>10){
        var ost = arr[0].substr(1).substring(0, 10)
     li.innerHTML += `<span class="mess_${post.UsersnameR}">${ost}</span> `
     }else{
        li.innerHTML += `<span class="mess_${post.UsersnameR}">${arr[0].substr(1)}</span> `
     }
     if (post.count==undefined){
        li.innerHTML += `<span class="mess_b_${post.UsersnameR}">0</span>`
     }else{
        li.innerHTML +=`<span class="mess_b_${post.UsersnameR}">${post.count}</span> `
     }
     
     li.innerHTML +=` <span>${ago(arr[2])}</span> </br>
     </article>
     </br>
     `
     const messButton = /** @type {HTMLButtonElement=} */ (li.querySelector("#mess-form-button"))
     const onMess = async () => {

        var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var newUrl = baseUrl + `?${post.UsersnameR}`;
        history.pushState(null, null, newUrl);
        const divs = document.querySelector(`.post_${post.UsersnameR}`)
        divs.style.cssText="border-right: 2px solid #8298e9;"
        try {
            const timelini = await messLoad(post.ID)
            console.log(timelini,"timelini")
            const selmess= document.querySelector("#mess-form-button")
            const elMess= document.querySelector(".dgi"+selmess.innerHTML)
            elMess.style.cssText=`display:none; `
            const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
            const list = renderList({
                items: timelini,
                loadMoreFunc: before => messLoad(post.ID, before),
                pageSize: PAGE_SIZE,
                renderItem: renderMess,
            })
               
                
            const loadMoreButton = /** @type {HTMLButttonElement} */ (page.getElementById('load-more-button'))
            const timelineList = /** @type {HTMLOListElement} */ (document.querySelector('.pt76397654_687687'))
            
            const div = document.createElement('div')
            const btr = document.createElement('button')
            const btr2 = document.createElement('button')
            btr.className = "video_chat"
            btr2.className = "reload video_chat"
            const video = document.createElement('video')
            const div1 = document.createElement('div')
            const div2 = document.createElement('div')
            const img = document.createElement('img')
            const span = document.createElement('span')
            const span2 = document.createElement('span')
            span.innerHTML = post.UsersnameR
            span2.innerHTML = "1/1/1, 2:57:40 AM data"
            img.src= post.URL
            img.className="im_m23289305521"
            span.className="ava_mess_v3"
            div.className="ms_t343436890809"
            div1.className="ms_t34343689080"
            div2.className="ms_t3434"
            btr2.innerHTML=''
btr.innerHTML="<svg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 331.32 511'><defs><style>.cls-1{fill:#8198e9;}</style></defs><title>microphone</title><path class='cls-1' d='M422.14,273.55a15.24,15.24,0,0,0-30.48,0c0,74.54-60.64,135.18-135.18,135.18S121.3,348.09,121.3,273.55a15.24,15.24,0,1,0-30.48,0c0,86.21,66.19,157.23,150.42,165v41H184.69a15.24,15.24,0,0,0,0,30.48H328.28a15.24,15.24,0,0,0,0-30.48H271.72v-41C356,430.78,422.14,359.76,422.14,273.55Z' transform='translate(-90.82 1)'/><path class='cls-1' d='M256.48,371.13a97.7,97.7,0,0,0,97.58-97.58v-177a97.58,97.58,0,1,0-195.16,0v177A97.7,97.7,0,0,0,256.48,371.13ZM189.38,96.58a67.1,67.1,0,1,1,134.2,0v177a67.1,67.1,0,1,1-134.2,0Z' transform='translate(-90.82 1)'/></svg>"
            div.appendChild(img)
            div.appendChild(span)
            span.appendChild(div1)
            div.appendChild(btr)
            div.appendChild(btr2)
          //  div.appendChild(span2)
            const form = document.createElement('form')
            form.className="post-form"
            const texta = document.createElement('textarea')
            texta.className="post-form-tx"
            texta.placeholder="Type for message ..."
            const submit = document.createElement('button')
            submit.className="post-form-button"
            submit.innerHTML="⌲"
            form.appendChild(texta)
            form.appendChild(submit)
            
            
            timelineList.innerHTML=""
           
            /**
             * @param {Event} ev 
             */
            const onPageDisconnect = () => {
                unsubscribeFromComments()
                list.teardown()
            }
        
            timelineList.appendChild(div)
           
            timelineList.appendChild(div2)
            div2.appendChild( list.el)
                timelineList.appendChild(form)
                const g = /** @type {HTMLOListElement} */ (timelineList.querySelector('.feed'))
                g.className="g_feed678687687"
                const postForm =/** @type {HTMLFormElement} */ (timelineList.querySelector('.post-form'))
                const postFormTextArea = timelineList.querySelector(".post-form-tx")
 
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
                        const value = "none"
                        const uid2 = post.ID
                        const timelineItem = await publishPost({uid2, message, value })
                        timelineItem.Mine=true
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
                const onTextachange= async ev => {
                    ev.preventDefault()
                    try {
                    const message = smartTrim('typing')
                    const uid2 = post.ID
                    const value = "none"
                    const timelineItem = await publishPost({uid2, message, value })
                    return
                    }
                    catch (err) {
                        console.error(err)
                        alert(err.message)
                        setTimeout(() => {
                            postFormTextArea.focus()
                        })
                    } finally {
                        postFormTextArea.disabled = false
                       
                    }
                }
                const onButtonChat= async ev => {
                    ev.preventDefault()
                    location.reload();
                }
                const onButtonAudioChat= async ev => {
                    ev.preventDefault()
                    
                   
var device = navigator.mediaDevices.getUserMedia({audio:true})
var items = []
device.then(stream=>{
    var recorder = new MediaRecorder(stream)
    recorder.ondataavailable=async e=>{
        items.push(e.data)
        if (recorder.state == 'inactive'){
            
            var blob  = new Blob(items, {type:'audio/webm'})
            var audio = document.createElement('audio')
            let videoURL = URL.createObjectURL(blob);
            audio.innerHTML=`<source src="`+videoURL+`" type="video/webm" />`
            let audioURL= videoURL
            div.append(audio)
            const message = "audio"
            const uid2 = post.ID
            
            var reader = new FileReader();
 reader.readAsDataURL(blob); 
 reader.onloadend = async e => {
     var base64data = reader.result;                
     console.log(base64data);
     const value = base64data
            const timelineItem = await publishPost({uid2, message, value })
            const f = document.querySelector(".g_feed678687687")
                      const lix= document.createElement("li")
                        lix.className="m-item879798798_v1 post_mn46747_t56876876799"
                        var sound      = document.createElement('audio');
                        sound.id       = 'audio-player';
                        sound.controls = 'controls';
                        sound.src      = timelineItem.Value;
                        sound.type     = 'audio/webm';
                        
                         lix.innerHTML = `
                         
                         <article class="post ">
                        
                         <a href="/users/${timelineItem.UsersnameR}">${timelineItem.UsersnameR}</a>
                        <span>${timelineItem.CreatedAt}</span>      
                         </article>
                         `
                         lix.append(sound)
                         f.prepend(lix)
 }
          
        }
       
    }
    recorder.start(100)
    setTimeout(()=>{
        recorder.stop();
    }, 5000)

})
                }
                texta.addEventListener ("click", onTextachange)
                btr2.addEventListener ("click", onButtonChat)
                btr.addEventListener ("click", onButtonAudioChat)
                postForm.addEventListener("submit", onPostFormSubmit)
                page.addEventListener("disconnect", onPageDisconnect)
                
                return page
            
                
           
        
        function renderMess(post){
            console.log(post)
        
            
             const li = document.createElement('li')
             const ago = new Date(post.CreatedAt).toLocaleString()
             li.className = 'm-item879798798_v1'
             console.log(post.Mine,"mine")
             var sound      = document.createElement('audio');
             sound.id       = 'audio-player';
             sound.controls = 'controls';
             sound.src      = post.Value;
             sound.type     = 'audio/webm';
             function urlify(text) {
                var urlRegex = /(https?:\/\/[^\s]+)/g;
                return text.replace(urlRegex, function(url) {
                    
                    if (url.match(/\.(jpeg|jpg|gif|png)$/) != null){
                        return  ' <style>.img_link_3543434{width:100%;}</style> <img class="img_link_3543434" src="' + url + '"/>'
                    }else if(url.match(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/)){
                        var ID = ''
                        url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                        if(url[2] !== undefined) {
                          ID = url[2].split(/[^0-9a-z_\-]/i);
                          ID = ID[0];
                          return  `<style>iframe{width:100%;}</style> <iframe width="250" src="https://www.youtube.com/embed/${ID}"></iframe>`
                        }
                        else {
                          ID = url;
                          return  `<style>iframe{width:100%;}</style> <iframe width="250"  src="https://www.youtube.com/embed/${ID}"></iframe>`
                        }
                      
                         
                       
      }
                    
                    else{
                  return '</br><a href="' + url + '">' + url + '</a></br>';
                    }
                })
                // or alternatively
                // return text.replace(urlRegex, '<a href="$1">$1</a>')
              }
              
              var text = post.Messages;
              
              var Messages = urlify(text);
            if(post.Mine==true){
                li.className += ' post_mn46747_t56876876799'
        
            }
            else{
                li.className += ' post_mf373289'
            }
             li.innerHTML = `
             <style>.post_mn46747_t56876876799{
                 color:white;
             }
             span a {
                color:grey;
            }
            span a:hover {
                color:blue;
            }
             #audio-player{
                width: inherit;
             }
             </style>
             <article class="post ">
        
             <a href="/users/${post.UsersnameR}">${post.UsersnameR}</a>
            <span><time datetime="${post.CreatedAt}">${ago} data</time></span></br>
            `
            if (post.Messages=="audio"){
                li.prepend(sound) 
            }
            else{
            
            li.innerHTML +=`<span>${Messages}</span> </article> `
              
            }
             
          
             return li
        }
           
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
        
    }
     messButton.addEventListener("click", onMess)
     
     return li
   


}

/**
 * 
 * @param {Event} ev
 */
async function onLogiFormSubmit(ev){}

/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function timelines (before = 0) {
       
    return doGet(`/api/chat?before=${before}`)
 
 
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
 function readMess (ID, cb) {
       
    return doGet(`/api/message/read`, cb)
 
 
 }
 /**
 * @param {string=} before
 * @returns {Promise<import("/js/types.js").Notification[]>}
 */
function fetchNotifications(before = "") {
    return doGet(`/api/notifications?last=${PAGE_SIZE}&before=${encodeURIComponent(before)}`)
}


   /**
 * @param {string=} before
 * @returns {Promise<import("/js/types.js").Notification[]>}
 */
function fetchNotificationv() {
    return doGet(`/api/notifications`)
}
/**
 *  @param {string=} before
 * @returns {Promise<import("/js/types.js").TimelineItem>}

 */
function messLoad ( ID, before = 0) {
    console.log(ID)
    return doGet(`/api/message/${ID}/mess?before=${before}&last=${PAGE_SIZE}`)
 
 
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
function Notifications() {
    const value = "message"
    return doPost(`/api/notification`,{value})
}