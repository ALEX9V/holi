
import {doGet, doPost, subscribe} from '/js/http.js'
import { ago, smartTrim } from "/js/utils.js"
import renderCom from '/js/coms.js'
import renderList from '/js/list.js'

const template = document.createElement('template')
template.innerHTML = `

<style>
.wrappers{
     padding-top: 60px;
     width: 700px;
}
#txtau{
    background-color: rgb(255, 255, 255);
    color:#3e3e3e;
    width: 628px;
    height: 60px;

}
.wr-gp{
    overflow: auto;
    min-width: 500px;
    /* position: absolute; */
    background: white;
    margin-top: 100px;
    height:80vh;
}
.avatar{width: 90%;
margin-top: 50px;
border-radius: 10px;
margin-bottom: 40px;}
.post-item {
    box-shadow: none;
}#line_block { 
    width:180px; 
    height:200px; 
    background:#f1f1f1; 
    float:left; 
    margin: 0 15px 15px 0; 
    text-align:center;
    padding: 10px;
    }
    #group-form-button{
        margin-top: 80px;
    }
    #chat_window_room{
        overflow: auto;
    }
.post_com_v{box-shadow: none;
    width: 60%;
    min-height: 200px;
    margin-top: 40px;
    background-color: var(--color-it-root);
    border-radius: 10px;
    padding: 10px;}
  .avatar_coms_p4564747574{
      border-radius: 50%;
        width: 40px;}
 button{background-color: rgb(130, 152, 233);color:white;}
</style>
<div class="wrappers">

<div id="post"></div>
</div>
<div class="container">

<h1>Ссылки</h1>
<div id="vidgp"><form id="gp-form" class="gp-form">
<textarea id="txtau" name='content' placeholder="Write something"></textarea>
<button id="gp-form-button">Publish</button>
</form></div> 
<br>
<p></p>

<div id="com"></div>

<form id="post-form" class="post-form">
    <textarea id="txtaus" name='content' placeholder="Write something"></textarea>
    <button id="post-form-button">Publish</button>
</form>
<br>
<div id="comments-outlet" class="comments-wrapper"></div>
<ol id="timeline-list"></ol>
 
</div>
`
export default async function renderPostUserpage(params) {
    const timeline = await fetchComment()
    
    const PostID = BigInt(params.PostID)
    await subgp(PostID)
    
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
        reverse: true,
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
    loadMoreFunc: before => fetchComment(PostID, before),
    pageSize: 4,
    reverse: true,
})
const listm = await listOfMess(PostID)
    const list7 = renderList({
    items: listm,
    renderItem: renderMess,
    loadMoreFunc: before => fetchComment(PostID, before),
    pageSize: 4,
    reverse: true,
})
    const div3= document.createElement('div')
    const listofuser = document.querySelector("#chat_window_room")
    listofuser.innerHTML=""
    window.onpopstate = function (event) {listofuser.innerHTML=""}
    listofuser.append(div3)
    div3.append(list1.el)  
    const div5 = document.createElement("h1")
    
    let commentsCountEl = /** @type {HTMLElement=} */ (null)
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
    textag.placeholder="Type for message ..."
    const submitg = document.createElement('button')
    submitg.className="post-form-buttong"
    formg.appendChild(textag)
    formg.appendChild(submitg)
    wrgp.append(divgp)
    wrgp.append(formg)
    divgp.innerHTML=""
   
    div5.innerHTML="Chat"
    divgp.append(div5)
    vidjet.append(list2.el)
    divgp.append(list7.el)
    const incrementCommentsCount = () => {
       
        if (commentsCountEl === null) {
            commentsCountEl = posts.querySelector(".comment-count")
            console.log(commentsCountEl+"commentsCountEl")
        }
        post[0].ComCount++
        commentsCountEl.textContent = String(post[0].ComCount)
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
     const comment = await createComment(title, PostID, authUserRaw.username )
  
     
    list.flush()
    postForm.reset()   
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
    const onCommentArrive = comment => {
        list.enqueue(comment)
        incrementCommentsCount()
    }

   
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
     const container = document.createElement('div')
     const li = document.createElement('li')
     const div = document.createElement("div")
     div.className = 'dv_p12323243'
     li.className = 'post-item'
     
     li.innerHTML = `
     <style>

     .img_src_user{
         width:550px;
     }
     h1, span{
        color:rgb(106 107 112);
     }
     </style>
     <div class="all">
     <div class="pt_mn_2434546454545454">
     
     <article class="post">
     <div class="post-header">
    
     </br>
      <h1>${post.Theme}</h1>
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
    
    container.appendChild(li)
   
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
 return container
 }
 function renderUser(post) {
    
    console.log(post)
   
     const container = document.createElement('div')
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
        width: 40px;
        height: 40px;
        border-radius:50%;
        padding: 10px;
     }

     </style>
     <div class="all">
     <div class="pt_mn_2434546454545454">
     
     <article class="post">
     <div class="post-header">
     <img src="${post.URL}" class="gp-user-li">
     <a href="/users/${post.Username}" >${post.Username}</a>
     </br>
     </div>  
     </div>
     </article>
    </div>
     `
    
    container.appendChild(li)
 return container
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
        const value = "none"
        const uid2 = PostID
        const timelineItem = await publishPost({uid2, message, value })

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
 function renderVid(post) {
    
    console.log(post)
   
     const container = document.createElement('div')
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
    
     </br>
      <h1><svg id="_x31__x2C_5" enable-background="new 0 0 24 24" height="80" viewBox="0 0 24 24" width="80" xmlns="http://www.w3.org/2000/svg"><path d="m12 6c-1.228 0-12-.084-12-3s10.772-3 12-3 12 .084 12 3-10.772 3-12 3zm-10.412-3c.732.568 4.245 1.5 10.412 1.5s9.68-.932 10.412-1.5c-.732-.568-4.245-1.5-10.412-1.5s-9.68.932-10.412 1.5zm20.939.116h.01z"/><path d="m12 12c-1.228 0-12-.084-12-3 0-.414.336-.75.75-.75.385 0 .702.29.745.664.462.553 4.012 1.586 10.505 1.586s10.043-1.033 10.505-1.586c.043-.374.36-.664.745-.664.414 0 .75.336.75.75 0 2.916-10.772 3-12 3zm10.5-3.001c0 .001 0 .001 0 0zm-21 0c0 .001 0 .001 0 0z"/><path d="m12 18c-1.228 0-12-.084-12-3 0-.414.336-.75.75-.75.385 0 .702.29.745.664.462.553 4.012 1.586 10.505 1.586s10.043-1.033 10.505-1.586c.043-.374.36-.664.745-.664.414 0 .75.336.75.75 0 2.916-10.772 3-12 3zm10.5-3.001c0 .001 0 .001 0 0zm-21 0c0 .001 0 .001 0 0z"/><path d="m12 24c-1.228 0-12-.084-12-3v-18c0-.414.336-.75.75-.75s.75.336.75.75v17.919c.481.556 4.03 1.581 10.5 1.581s10.019-1.025 10.5-1.581v-17.919c0-.414.336-.75.75-.75s.75.336.75.75v18c0 2.916-10.772 3-12 3z"/><circle cx="5" cy="14" r="1"/><circle cx="5" cy="8" r="1"/><circle cx="5" cy="20" r="1"/></svg></h1>
     </br>
      
     <a href="${post.Link}" target="_blank">
     ${post.Link}
     </a>
     </div>  
     </div>
     </article>
    </div>
     `
    
    container.appendChild(li)
 return container
 }
 function renderMess(post){
    console.log(post)
    let arr = post.Messages.split(',&&^%$%&&*^&**,');
    
     const li = document.createElement('li')
    
     li.className = 'post-item'
     li.innerHTML = `
     video{
        width: 300px;
     }
     <style>.m-item879798798_v1{
        background-color:white;
        margin-bottom:20px;
        border-radius:10px;
        padding:10px;
        width:250px;
     }
     .post_mn46747_t56876876799 { 
        margin-left:200px;
        background-color:#8298e9;
        color: white;
    }
    .post_mn46747_t56876876799 span { 
        color: white;
    }
    .ms_t343436890809{
        width: 100%;
        min-width: 470px;
padding: 0;
margin-bottom: 30px;
height: 50px;
background-color: white;
margin-top: 25px;
    }
    .ms_t343436890809 span{
        color:#8198e9;
    }
    .post-form{
        display: contents;
bottom: 0;
width: 470px;
background-color:white;
    }
    form textarea{
        width: 400px;
        background-color: white;
        color: #3a4364;
    }
   .im_m23289305521{
        width: 40px;
border-radius: 50%;
margin-left: 30px;
margin-top: 5px;
    }
   .ava_mess_v3{
        
        position: absolute;
        margin-top: 20px;
        margin-left: 80px;
    }
    .ms_t34343689080{
        display:none;
    }
   
     </style>
     <article class="post post_${post.UsersnameR} ">
    <img src="${post.URL}">
     <a href="/users/${post.UsersnameR}" >${post.UsersnameR}</a>
     </br>
     <button id="mess-form-button">${post.UsersnameR}</button>
     
    <span class="mess_${post.UsersnameR}">${arr[0].substr(1)}</span> 
     `
     if (post.count==undefined){
        li.innerHTML += `<span class="mess_b_${post.UsersnameR}">0</span>`
     }else{
        li.innerHTML +=`<span class="mess_b_${post.UsersnameR}">${post.count}</span> `
     }
     li.innerHTML +=` <span></span> 
     </article>
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
            const video = document.createElement('video')
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

            div2.className="ms_t34343689080"

            div.appendChild(img)
            div.appendChild(span)
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
                timelineList.appendChild( list.el)
                timelineList.appendChild(form)
                const g = /** @type {HTMLOListElement} */ (timelineList.querySelector('.feed'))
                g.className="g_feed678687687"
                const postForm =/** @type {HTMLFormElement} */ (timelineList.querySelector('.post-form'))
                const messForm =/** @type {HTMLFormElement} */ (document.querySelector('.post-formg'))
            
                const postFormTextArea = timelineList.querySelector(".post-form-tx")
                const messFormTextArea = timelineList.querySelector(".post-form-txg")
                
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
                   alert()
                   let constraintObj = { 
                    audio: false, 
                    video: { 
                        facingMode: "user", 
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 } 
                    } 
                }; 
                // width: 1280, height: 720  -- preference only
                // facingMode: {exact: "user"}
                // facingMode: "environment"
                
                //handle older browsers that might implement getUserMedia in some way
                if (navigator.mediaDevices === undefined) {
                    navigator.mediaDevices = {};
                    navigator.mediaDevices.getUserMedia = function(constraintObj) {
                        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                        if (!getUserMedia) {
                            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                        }
                        return new Promise(function(resolve, reject) {
                            getUserMedia.call(navigator, constraintObj, resolve, reject);
                        });
                    }
                }else{
                    navigator.mediaDevices.enumerateDevices()
                    .then(devices => {
                        devices.forEach(device=>{
                            console.log(device.kind.toUpperCase(), device.label);
                            //, device.deviceId
                        })
                    })
                    .catch(err=>{
                        console.log(err.name, err.message);
                    })
                }
        
                navigator.mediaDevices.getUserMedia(constraintObj)
                .then(function(mediaStreamObj) {
                    //connect the media stream to the first video element
                    let video = document.querySelector('video');
                    if ("srcObject" in video) {
                        video.srcObject = mediaStreamObj;
                    } else {
                        //old version
                        video.src = window.URL.createObjectURL(mediaStreamObj);
                    }
                    
                    video.onloadedmetadata = function(ev) {
                        //show in the video element what is being captured by the webcam
                        video.play();
                    };
                    
                    //add listeners for saving video/audio
                    let start = document.getElementById('btnStart');
                    let stop = document.getElementById('btnStop');
                    let vidSave = document.getElementById('vid2');
                    let mediaRecorder = new MediaRecorder(mediaStreamObj);
                    let chunks = [];
                    
                    start.addEventListener('click', (ev)=>{
                        mediaRecorder.start();
                        console.log(mediaRecorder.state);
                    })
                    stop.addEventListener('click', (ev)=>{
                        mediaRecorder.stop();
                        console.log(mediaRecorder.state);
                    });
                    mediaRecorder.ondataavailable = function(ev) {
                        chunks.push(ev.data);
                    }
                    mediaRecorder.onstop = (ev)=>{
                        let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
                        chunks = [];
                        let videoURL = window.URL.createObjectURL(blob);
                        vidSave.src = videoURL;
                    }
                })
                .catch(function(err) { 
                    console.log(err.name, err.message); 
                });
                }
                const onButtonAudioChat= async ev => {
                    ev.preventDefault()
                    
                    alert()
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
           console.log(items)
            alert(blob)
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
async function createComment(title, PostID, username) {
    var value=""
    var PID="611871718207422465"
    const comment = await doPost(`/api/group/${PostID}/new`, { PID,value,title, username})
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
function subscribeToComments(postID, cb) {
    
    return subscribe(`/api/post/${postID}/comment`, cb)
}
function checkregu(postID) {
    return doPost(`/api/group/${postID}`)
}
function subgp(PostID) {
    return subscribe('/api/group/'+ PostID)
}
function chPgp(Pass, PostID) {
   
    return doPost(`/api/groups/${PostID}`, {Pass})
}
function listOfUser(PostID) {
    return doGet(`/api/groups/${PostID}/user`)
}
function listOfVid(PostID) {
    return doGet(`/api/group/${PostID}/vidjet`)
}
function listOfMess(PostID) {
    return doGet(`/api/message/${PostID}/gp`)
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