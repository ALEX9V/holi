import {escapeHTML} from "/js/utils.js"
/**
 * @param {import("/js/types.js").Post} post
 * @param {string=} timelineItemID
 */

export default function renderCom(post) {
   
   console.log(post)
   console.log(post.CreatedAt)
    const ago = new Date(post.CreatedAt).toLocaleString()
    console.log(ago)
    const li = document.createElement('li')
   
    li.className = 'post-item post_com_v'
    li.innerHTML = `
    <article class="post" style="display: inline;">
    <div class="post-header" style="display: inline;">
    <img class="avatar_coms_p4564747574" src="${post.URL}"/>
    <a  href="/users/${post.Username}">${post.Username}
     </a>
    
    <a >
    <time datetime="${post.CreatedAt}">${ago} data</time>
    </br>`
    if(post.Groupim!=null){

    
    for(var i=0; i<post.Groupim.length; i++){
    li.innerHTML += `
    <img class="imgstgp" style="width:calc(90%/${post.Groupim.length})" src="${(post.Groupim[i]).URL}"/>
    `
    }
}
    if (post.Sel==true){
        li.innerHTML += `<svg id="Bold" enable-background="new 0 0 24 24"  width="20px" height="20px" fill="#8298e9"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g><path d="m12 0c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12zm6.989 10.044-1.087 6.333c-.062.36-.374.623-.739.623h-10.326c-.365 0-.677-.263-.739-.623l-1.087-6.333c-.048-.277.064-.558.289-.727.226-.17.525-.197.779-.074l2.894 1.409 2.372-4.267c.264-.477 1.047-.477 1.311 0l2.372 4.267 2.894-1.409c.253-.123.553-.096.779.074.224.169.336.45.288.727z"/></g></svg>`
    
    }else{ }
    li.innerHTML += `


 </a>
    </div>
        
    <div class="post-content">${escapeHTML(post.Tittle)}</div>
    <div class="pt-ct-com"style="display: contents;"><button class="bt-ct-cm" style="margin-top:20px; border-radius:50px;" value="${post.ID}">Выбрать</button></div>
    `
    if (post.Sel==true){
        li.innerHTML += `<span style="color: #8198e9;
        margin-left: 120px;">✔︎</span>
        <span> Был выбран как исполнитель </span>`
    }
        li.innerHTML += `  </article> `
  
return li
}