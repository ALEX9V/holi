import { doPost,doGet, doPostAvatar } from "/js/http.js"
const template = document.createElement('template')
template.innerHTML = `
<style> 
#post-form-button{background:#8198e9;}
#tag, #title{width: 350px;}
#opitpp{    box-shadow: none;}</style>
<h1 >Обновить ✦</h1>
</br></br>
<div class="container">
<form name="fileinfoimg"  id="post-form_sh">
<input type="file" name="upfile"  id="upfile" style="background-color: white;">
<button id="post-form-button">Publish</button>
</form>
<form name="fileinfo"  id="post-form">

<input type="text" required="" id="tag" placeholder="Тэг">
</br>
<input type="text" id="title" placeholder="Заголовок">
</br>
</br>
<input type="text" id="amot" placeholder="цена от">
<input type="text" id="ampos" placeholder="цена до">
</br>
<h3>Уровень Опыта</h3>
<p><input id="opitpp" type="radio" name="age" value="0">Новичок</p>
<p><input id="opitpp" type="radio" name="age" value="1" >Среднее</p>
<p><input id="opitpp" type="radio" name="age" value="2">Эксперт</p>
<h3>Доступ</h3>
<p><input id="acceserpp" type="radio" name="access" value="0">Временная работа</p>
<p><input id="acceserpp" type="radio" name="access" value="1">На длительный срок</p>
</br>
<h3>Тип занятости</h3>
<p><input id="tpwork" type="radio" name="worktp" value="0">Почасовая</p>
<p><input  id="tpwork" type="radio" name="worktp" value="1">Фиксированная цена</p>
</br>
<h3>Часы в неделю</h3>
<p><input id="hourtp" type="radio" name="hourtp" value="0"> менее 30 часов</p>
<p><input id="hourtp" type="radio" name="hourtp" value="1">более 30 часов</p>
</br>
<span>Пишите пост</span>
</br>
    <textarea name='content' id="textareas" placeholder="Описание должно быть не менее 100 символов (обязательное поле)"></textarea>
    </br>
   
    </br>
    <button id="post-form-button">Publish</button>
</form>
</div>
`

export default async function rendeUploadPage(params) {
    const d =  await mime()
    const gp = document.querySelector(".gp")
    const chat = document.querySelector("#chat_window_room")
    const page = /** {DocumentFragment} */ (template.content.cloneNode(true))
    gp.innerHTML=""
         chat.innerHTML =`<link rel="stylesheet" type="text/css" href="/css/RLsu_p6978676549873389.css">`
    if (d.mm_34_pp_s243 == true){
        page.querySelector(".container").remove()

      const gp = document.createElement("div") 
       gp.innerHTML =`<svg height="200px" id="svg_pp_mm" viewBox="0 0 512.14969 512" fill=" #8198e9" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="m355.519531 512.113281c11.570313-.03125 21.695313-7.78125 24.746094-18.941406l23.597656-88.101563 89.367188-23.890624c13.617187-3.703126 21.679687-17.710938 18.050781-31.34375l-46.335938-172.699219 3.667969-13.652344c3.316407-12.574219-3.324219-25.636719-15.4375-30.371094l-20.863281-77.882812c-3.734375-13.605469-17.707031-21.679688-31.359375-18.125l-152.40625 40.882812-127.796875-34.261719c-5.238281-1.4375-10.800781-1.136718-15.851562.855469l-31.925782-31.871093c-10.761718-10.859376-26.507812-15.132813-41.28125-11.199219-14.773437 3.933593-26.3125 15.46875-30.25 30.242187-3.9375 14.773438.328125 30.523438 11.183594 41.285156l58.191406 58.191407-69.71875 260.265625c-3.648437 13.648437 4.421875 27.675781 18.054688 31.386718l329.722656 88.34375c2.164062.589844 4.398438.890626 6.644531.886719zm139.25-157.867187c1.207031 4.527344-1.460937 9.183594-5.976562 10.429687l-79.820313 21.332031 47.113282-175.878906zm-89.449219-300.636719c2.199219-.601563 4.546876-.296875 6.519532.84375 1.972656 1.136719 3.40625 3.019531 3.984375 5.222656l18.203125 67.996094-152.515625-40.859375zm-146.773437 205.054687-43.082031-14.359374 28.722656-28.75 14.359375 43.078124zm-34.730469-46.828124-72.40625-72.414063c-3.332031-3.332031-8.738281-3.332031-12.070312.003906-3.332032 3.332031-3.328125 8.738281.007812 12.070313l72.410156 72.394531-12.0625 12.078125-120.6875-120.6875 12.066407-12.066406 24.128906 24.140625c2.160156 2.15625 5.300781 3 8.25 2.207031 2.945313-.789062 5.246094-3.089844 6.035156-6.035156.789063-2.945313-.050781-6.089844-2.207031-8.246094l-24.132812-24.132812 12.066406-12.074219 120.667968 120.6875zm-168.949218-120.6875 36.207031-36.207032 12.066406 12.066406-36.199219 36.207032zm-37.667969-48.273438c0-10.355469 6.238281-19.695312 15.804687-23.65625 9.570313-3.960938 20.582032-1.769531 27.902344 5.554688l18.101562 18.101562-36.207031 36.207031-18.109375-18.109375c-4.8125-4.789062-7.511718-11.304687-7.492187-18.097656zm.394531 353.101562 67.171875-250.796874 108.886719 108.886718c.890625.871094 1.960937 1.53125 3.140625 1.9375.066406 0 .117187.09375.195312.117188l56.210938 18.773437c1.753906.578125 3.59375.863281 5.441406.855469 3.214844-.011719 6.359375-.9375 9.0625-2.671875l98.132813 26.351563c.722656.199218 1.46875.300781 2.21875.296874 4.285156 0 7.902343-3.175781 8.457031-7.421874.558593-4.246094-2.117188-8.246094-6.253907-9.351563l-94.71875-25.429687c-.085937-1.449219-.347656-2.882813-.785156-4.269532l-18.773437-56.214844c0-.078124-.09375-.128906-.128907-.207031-.40625-1.167969-1.066406-2.234375-1.929687-3.121093l-131.890625-131.945313 324.019531 86.792969c2.191407.585937 4.058594 2.015625 5.191407 3.980468 1.132812 1.960938 1.4375 4.292969.851562 6.484376l-88.304688 329.683593c-.582031 2.191407-2.015624 4.0625-3.980468 5.195313-1.964844 1.132812-4.300782 1.4375-6.488282.847656l-329.6875-88.3125c-2.1875-.585938-4.054687-2.015625-5.191406-3.976562-1.132812-1.964844-1.4375-4.296876-.847656-6.484376zm0 0"/><path d="m394.578125 200.785156c4.28125-.003906 7.898437-3.179687 8.457031-7.425781.554688-4.242187-2.121094-8.246094-6.253906-9.351563l-121.371094-32.519531c-2.976562-.886719-6.195312-.085937-8.410156 2.089844-2.214844 2.171875-3.074219 5.378906-2.246094 8.367187.828125 2.992188 3.21875 5.296876 6.234375 6.019532l121.378907 32.527344c.722656.195312 1.464843.292968 2.210937.292968zm0 0"/><path d="m381.316406 250.234375c4.28125-.003906 7.898438-3.175781 8.457032-7.421875.558593-4.246094-2.117188-8.246094-6.253907-9.355469l-82.519531-22.074219c-2.964844-.84375-6.152344-.027343-8.34375 2.144532-2.191406 2.167968-3.039062 5.351562-2.222656 8.324218.816406 2.972657 3.171875 5.273438 6.164062 6.015626l82.519532 22.078124c.714843.191407 1.457031.289063 2.199218.289063zm0 0"/><path d="m118.003906 268.324219-24.746094-6.628907c-2.96875-.867187-6.175781-.0625-8.378906 2.109376-2.203125 2.167968-3.0625 5.359374-2.242187 8.34375.820312 2.980468 3.1875 5.285156 6.191406 6.023437l24.746094 6.640625c.726562.191406 1.46875.289062 2.21875.289062 4.285156.003907 7.90625-3.171874 8.464843-7.417968.558594-4.246094-2.117187-8.25-6.253906-9.359375zm0 0"/><path d="m363.0625 342.8125c1.21875-4.550781-1.484375-9.222656-6.03125-10.445312l-189.585938-50.789063c-4.398437-.859375-8.710937 1.835937-9.875 6.164063-1.160156 4.328124 1.226563 8.820312 5.464844 10.277343l189.574219 50.792969c.722656.199219 1.464844.296875 2.210937.296875 3.855469.003906 7.234376-2.578125 8.242188-6.296875zm0 0"/><path d="m104.742188 317.777344-24.746094-6.632813c-4.542969-1.191406-9.195313 1.511719-10.410156 6.046875-1.214844 4.539063 1.46875 9.207032 6 10.441406l24.746093 6.621094c.71875.199219 1.460938.300782 2.210938.296875 4.28125.003907 7.902343-3.171875 8.460937-7.417969.5625-4.246093-2.113281-8.25-6.253906-9.355468zm0 0"/><path d="m343.777344 381.828125-189.574219-50.800781c-2.976563-.882813-6.195313-.082032-8.410156 2.089844-2.214844 2.175781-3.074219 5.378906-2.246094 8.371093.828125 2.988281 3.21875 5.292969 6.234375 6.019531l189.578125 50.796876c.722656.199218 1.46875.300781 2.21875.300781 4.28125-.003907 7.898437-3.179688 8.457031-7.425781.554688-4.246094-2.121094-8.246094-6.257812-9.351563zm0 0"/></svg>
       </br><h1 style="margin: 0 0 0 20%;"> Упс, Вы достигли лимита =(</h1><p style="margin: 0 0 0 15%;">(Внимание: вы можите публиковать не более 5 постов  раз в день) </p>
       `
       page.append(gp)
       return page
    } else{
    const postFormTextArea = page.getElementById('upfile')
    const tag = page.getElementById('tag')
    const title = page.getElementById('title')
    const amot = page.getElementById('amot')
    const ampos = page.getElementById('ampos')
    const item = await fetchPost(params.PostID)
   console.log(item)
    var form = document.forms.namedItem("fileinfo");
    const postFormTextAreas =page.getElementById('textareas')
    const postForm =/** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const postFormsh =/** @type {HTMLFormElement} */ (page.getElementById('post-form_sh'))
    const postFormButton = /** @type {HTMLButttonElement} */ (page.getElementById('post-form-button'))
    title.value = item[0].lk_j21_dv_i292
    tag.value = item[0].lk_j21_dv_i293.String
    amot.value=item[0].lk_j21_dv_i291.Int64
    postFormTextAreas.value = item[0].lk_j21_dv_i227
    if (item[0].lk_j21_dv_i294=="new"){
      page.querySelectorAll('#opitpp')[0].checked = true
    } else if (item[0].lk_j21_dv_i294=="medium"){
        page.querySelectorAll('#opitpp')[1].checked = true
    }else if (item[0].lk_j21_dv_i294=="expert"){
        page.querySelectorAll('#opitpp')[2].checked = true
    } if (item[0].lk_j21_dv_i296==false){
        page.querySelectorAll('#acceserpp')[0].checked = true
      } else{
          page.querySelectorAll('#acceserpp')[1].checked = true
      }
      
    if (item[0].lk_j21_dv_i295==false){
        page.querySelectorAll('#tpwork')[0].checked = true
      } else{
          page.querySelectorAll('#tpwork')[1].checked = true
      }
      if (item[0].lk_j21_dv_i297==false){
        page.querySelectorAll('#hourtp')[0].checked = true
      } else{
          page.querySelectorAll('#hourtp')[1].checked = true
      }
     
    const onpostubmit = async ev => {

        ev.preventDefault()   
        const age = document.querySelector('input[name="age"]:checked').value 
        const access = document.querySelector('input[name="access"]:checked').value 
        const worktp = document.querySelector('input[name="worktp"]:checked').value 
        const hourtp = document.querySelector('input[name="hourtp"]:checked').value 
        const content = postFormTextAreas.value
        const ages = age
        const acess1 = access.value
        const titles = title.value
        const tags = tag.value
        const amoti = amot.value
      

    try {
        
        const timelineItem = await publishPost( {content, ages, acess1, titles, tags, amoti, access, worktp, hourtp }, params.PostID )
       
    
    } catch (error) {
       console.log( error)
       
       return page
    }
 }  
 const onpostubmitsh = async ev => {
    ev.preventDefault()    
try {
await publishPostsh( postFormsh, params.PostID)
    
} catch (error) {
   console.log( error)
   
   return page
}
}
 
        postFormsh.addEventListener('submit', onpostubmitsh)
        postForm.addEventListener('submit', onpostubmit)

    return page

}
}
/**
 * @param {import("/js/types.js").CreatePostInput} input2
 * @returns {Promise<import("/js/types.js").TimelineItem>} 
 */
async function publishPost( input2, pid) {
    const timelineItem =  await doPost(`/api/post/${pid}/updater`, input2)
    return timelineItem
}
      
   

function mime( ) {
    return doGet(`/api/mime/` )
}

function fetchPost(PostID) {
    return doGet('/api/post/'+ PostID)
}
async function publishPostsh(input, PostID) {
    await doPostAvatar(`/api/updates/${PostID}`, input) 
}