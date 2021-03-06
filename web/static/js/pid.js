import {escapeHTML} from "/js/utils.js"
import {doPost} from "/js/http.js"
import {replaceNode, el} from "/js/utils.js"
/**
 * @param {import("/js/types.js").Post} post
 * @param {string=} timelineItemID
 */

export default function renderPost(post) {
    
   console.log(post)

    const ago = new Date(post.lk_j21_dv_i228).toLocaleString()
    
    let arr= post.lk_j21_dv_i293.String.split(',');
    const li = document.createElement('li')
    const div = document.createElement("div")
    div.className = 'itmm'
    li.className = 'post-item'
    
    li.innerHTML = `
    <style>
    .conter{
        text-align: justify;
        
        border-radius: 50px;
        padding: 30px;
    }
    .el_pt_pd{
        color: silver;
        display: inline-flex;
        width: 160px;
    }
    .el_pt_pd p {
        padding: 0;
        margin: 0 0 0 10px;
        color: #b2b2b2;
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
    </style>
    <div class="all">
    <div class="pt_mn_2434546454545454">
    
    <article class="post">
    <div class="post-header">
     </br>
     <h1>${post.lk_j21_dv_i292}</h1>
     <img src="${post.lk_j21_dv_i217}" style=" border-radius: 15px; width: 100vh;"/>
     <a href="/users/${post.lk_j21_dv_i215}">${post.lk_j21_dv_i215}
     </a>
    <a href="/post/${post.lk_j21_dv_i223}">
    <time datetime="${post.lk_j21_dv_i228}">${ago} data</time>
    </a>
    </div>
    </br></br>
    ` 

    
        li.innerHTML +=  `  
    <div class="post-content conter" style="text-align: justify;">${escapeHTML(post.lk_j21_dv_i227)}</div>

    `
    
    
    li.innerHTML += `
    </br>
    <div class="post-controls">
    <button class="like-button" id="like-button"><span class="likes-count">${post.lk_j21_dv_i229} </span></button>
    <a class="comment-count" href="/post/${post.lk_j21_dv_i223}"> ${post.lk_j21_dv_i214} </a>
    </div>
    </article>
    <div class="dv_p12323243"></div></div>
    
    </div>
    `
    li.innerHTML +=  `</br><div class="tags">`
   
    
    
    li.innerHTML +=  `</div ></br>
    
    <div class="el_pt_pd"><svg id="Capa_1" enable-background="new 0 0 510.843 510.843" height="40" viewBox="0 0 510.843 510.843" width="40"  fill="#8198e9" xmlns="http://www.w3.org/2000/svg"><g><path d="m510.176 305.962-12.38-68.13c-.74-4.076-4.65-6.777-8.72-6.039-4.075.741-6.779 4.645-6.038 8.72l12.382 68.144c1.205 6.565-.22 13.208-4.013 18.705s-9.498 9.188-16.09 10.398l-48.28 9.04c-4.072.763-6.754 4.681-5.992 8.752.675 3.605 3.824 6.121 7.363 6.121.458 0 49.644-9.165 49.644-9.165 10.506-1.929 19.634-7.834 25.702-16.629 6.068-8.793 8.348-19.424 6.422-29.917z"/><path d="m391.663 353.116-166.209 30.5c-13.563 2.488-26.622-6.518-29.11-20.076l-25.18-137.23c-2.489-13.563 6.518-26.622 20.077-29.11l249.891-45.86c6.561-1.204 13.206.219 18.705 4.013 5.497 3.793 9.188 9.498 10.394 16.063l6.38 34.78c.747 4.075 4.651 6.769 8.73 6.024 4.074-.748 6.771-4.656 6.023-8.73l-6.38-34.781c-1.929-10.506-7.835-19.634-16.629-25.703-8.796-6.068-19.425-8.349-29.932-6.42l-.709.13-1.136-6.181c-1.746-9.52-7.096-17.788-15.062-23.282-7.965-5.493-17.595-7.556-27.113-5.81l-257.31 47.214c-19.646 3.604-32.697 22.524-29.092 42.175l26.542 144.657c3.201 17.446 18.478 29.69 35.62 29.69 2.162 0 4.355-.195 6.556-.599l4.415-.811.455 2.477c3.535 19.264 20.403 32.784 39.332 32.784 2.387 0 4.809-.215 7.239-.661l166.209-30.5c4.074-.748 6.771-4.657 6.023-8.73-.747-4.074-4.662-6.773-8.729-6.023zm-217.651-3.289c-11.516 2.115-22.603-5.534-24.714-17.045l-26.542-144.656c-2.112-11.516 5.534-22.603 17.045-24.714l257.31-47.214c5.577-1.025 11.224.185 15.89 3.404 4.667 3.219 7.801 8.063 8.824 13.642l1.135 6.181-234.427 43.022c-21.694 3.98-36.104 24.872-32.124 46.571l22.018 119.999z"/><path d="m267.014 267.481c0 36.544 29.731 66.275 66.275 66.275s66.274-29.731 66.274-66.275-29.73-66.275-66.274-66.275-66.275 29.731-66.275 66.275zm117.549 0c0 28.273-23.002 51.275-51.274 51.275-28.273 0-51.275-23.002-51.275-51.275s23.002-51.275 51.275-51.275c28.272 0 51.274 23.002 51.274 51.275z"/><path d="m9.283 314.803 45.228-11.056c4.024-.984 6.488-5.043 5.505-9.066-.983-4.024-5.043-6.484-9.066-5.505l-45.229 11.056c-4.024.984-6.488 5.043-5.505 9.066.837 3.426 3.904 5.721 7.28 5.721.589 0 1.189-.07 1.787-.216z"/><path d="m109.577 369.916-45.228 11.056c-4.024.984-6.488 5.043-5.505 9.066.837 3.426 3.904 5.721 7.28 5.721.589 0 1.189-.07 1.787-.216l45.228-11.056c4.024-.984 6.488-5.043 5.505-9.066s-5.043-6.485-9.067-5.505z"/><path d="m88.049 324.375-70.354 18.091c-4.012 1.032-6.428 5.12-5.396 9.131.871 3.385 3.917 5.634 7.258 5.634.618 0 1.247-.077 1.873-.238l70.354-18.091c4.012-1.032 6.428-5.12 5.396-9.131-1.032-4.012-5.122-6.43-9.131-5.396z"/><path d="m88.905 295.923c.572 0 1.152-.065 1.732-.203l9.505-2.248c4.031-.954 6.526-4.994 5.573-9.025-.954-4.031-4.996-6.526-9.025-5.573l-9.505 2.248c-4.031.954-6.526 4.994-5.573 9.025.817 3.451 3.895 5.776 7.293 5.776z"/><path d="m28.067 391.182-17.086 4.021c-4.032.949-6.532 4.987-5.583 9.019.813 3.455 3.893 5.784 7.294 5.784.569 0 1.146-.065 1.724-.201l17.086-4.021c4.032-.949 6.532-4.987 5.583-9.019s-4.986-6.528-9.018-5.583z"/></g></svg> <p> ????????: ${post.lk_j21_dv_i291.Int64}</p>
    `
   if (post.lk_j21_dv_i295==true){
    li.innerHTML += `<div class="el_pt_pd"><svg id="left-indent" enable-background="new 0 0 300 300" height="40" fill="#8198e9" viewBox="0 0 300 300" width="40" xmlns="http://www.w3.org/2000/svg"><g><path d="m79.516 92.484c.781.781 1.805 1.172 2.828 1.172s2.047-.391 2.828-1.172l2.828-2.828 2.828 2.828c.781.781 1.805 1.172 2.828 1.172s2.047-.391 2.828-1.172c1.562-1.562 1.562-4.094 0-5.656l-2.828-2.828 2.828-2.828c1.562-1.562 1.562-4.094 0-5.656s-4.094-1.562-5.656 0l-2.828 2.828-2.828-2.828c-1.562-1.562-4.094-1.562-5.656 0s-1.562 4.094 0 5.656l2.828 2.828-2.828 2.828c-1.563 1.563-1.563 4.094 0 5.656z"/><path d="m60 184c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12zm0 16c-2.205 0-4-1.793-4-4s1.795-4 4-4 4 1.793 4 4-1.795 4-4 4z"/><path d="m90.189 225.445c-2.501-.005-4.533 2.02-4.538 4.521s2.02 4.533 4.521 4.538c2.502.005 4.533-2.02 4.538-4.521.005-2.502-2.019-4.533-4.521-4.538z"/><path d="m132 36c-2.209 0-4 1.789-4 4v220c0 2.211 1.791 4 4 4s4-1.789 4-4v-220c0-2.211-1.791-4-4-4z"/><path d="m156 80h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4zm4-16h72v8h-72z"/><path d="m236 216h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-72v-8h72z"/><path d="m260 96h-104c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h104c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-96v-8h96z"/><path d="m156 160h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4zm4-16h72v8h-72z"/><path d="m260 176h-104c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h104c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-96v-8h96z"/><path d="m114.273 146.707-31.846-22c-1.227-.844-2.814-.938-4.131-.25-1.318.691-2.143 2.055-2.143 3.543v12h-36.153c-2.209 0-4 1.789-4 4v12c0 2.211 1.791 4 4 4h36.154v12c0 1.488.824 2.852 2.143 3.543.584.305 1.221.457 1.857.457.797 0 1.592-.238 2.273-.707l31.846-22c1.082-.75 1.727-1.98 1.727-3.293s-.645-2.543-1.727-3.293zm-30.119 17.668v-8.375c0-2.211-1.791-4-4-4h-36.154v-4h36.154c2.209 0 4-1.789 4-4v-8.375l20.809 14.375z"/></g></svg><p> ?????? ????????????: ?????????????????????????? ????????</p></div>`
   }else{
    li.innerHTML += `<div class="el_pt_pd"><svg id="left-indent" enable-background="new 0 0 300 300" height="40" fill="#8198e9" viewBox="0 0 300 300" width="40" xmlns="http://www.w3.org/2000/svg"><g><path d="m79.516 92.484c.781.781 1.805 1.172 2.828 1.172s2.047-.391 2.828-1.172l2.828-2.828 2.828 2.828c.781.781 1.805 1.172 2.828 1.172s2.047-.391 2.828-1.172c1.562-1.562 1.562-4.094 0-5.656l-2.828-2.828 2.828-2.828c1.562-1.562 1.562-4.094 0-5.656s-4.094-1.562-5.656 0l-2.828 2.828-2.828-2.828c-1.562-1.562-4.094-1.562-5.656 0s-1.562 4.094 0 5.656l2.828 2.828-2.828 2.828c-1.563 1.563-1.563 4.094 0 5.656z"/><path d="m60 184c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12-5.383-12-12-12zm0 16c-2.205 0-4-1.793-4-4s1.795-4 4-4 4 1.793 4 4-1.795 4-4 4z"/><path d="m90.189 225.445c-2.501-.005-4.533 2.02-4.538 4.521s2.02 4.533 4.521 4.538c2.502.005 4.533-2.02 4.538-4.521.005-2.502-2.019-4.533-4.521-4.538z"/><path d="m132 36c-2.209 0-4 1.789-4 4v220c0 2.211 1.791 4 4 4s4-1.789 4-4v-220c0-2.211-1.791-4-4-4z"/><path d="m156 80h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4zm4-16h72v8h-72z"/><path d="m236 216h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-72v-8h72z"/><path d="m260 96h-104c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h104c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-96v-8h96z"/><path d="m156 160h80c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4h-80c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4zm4-16h72v8h-72z"/><path d="m260 176h-104c-2.209 0-4 1.789-4 4v16c0 2.211 1.791 4 4 4h104c2.209 0 4-1.789 4-4v-16c0-2.211-1.791-4-4-4zm-4 16h-96v-8h96z"/><path d="m114.273 146.707-31.846-22c-1.227-.844-2.814-.938-4.131-.25-1.318.691-2.143 2.055-2.143 3.543v12h-36.153c-2.209 0-4 1.789-4 4v12c0 2.211 1.791 4 4 4h36.154v12c0 1.488.824 2.852 2.143 3.543.584.305 1.221.457 1.857.457.797 0 1.592-.238 2.273-.707l31.846-22c1.082-.75 1.727-1.98 1.727-3.293s-.645-2.543-1.727-3.293zm-30.119 17.668v-8.375c0-2.211-1.791-4-4-4h-36.154v-4h36.154c2.209 0 4-1.789 4-4v-8.375l20.809 14.375z"/></g></svg><p> ?????? ????????????: ??????????????????</p></div>`
   } 
   if (post.lk_j21_dv_i296==true){
    li.innerHTML += `<div class="el_pt_pd"><?xml version="1.0"?>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40"fill="#8198e9"><g id="Outline"><path d="M309.989,227.827c29.6-18.925,54.1-43.444,70.859-70.91,16.326-26.758,25.2-55.46,26.472-85.417H408A23.527,23.527,0,0,0,431.5,48V24a7.5,7.5,0,0,0-7.5-7.5H88A7.5,7.5,0,0,0,80.5,24V48A23.527,23.527,0,0,0,104,71.5h.677c1.27,29.957,10.148,58.659,26.475,85.417,16.758,27.466,41.26,51.985,70.859,70.91a33.46,33.46,0,0,1,0,56.346c-29.6,18.925-54.1,43.444-70.859,70.91-16.328,26.761-25.207,55.465-26.474,85.425A24.524,24.524,0,0,0,80.5,465v23a7.5,7.5,0,0,0,7.5,7.5H424a7.5,7.5,0,0,0,7.5-7.5V464A23.527,23.527,0,0,0,408,440.5h-.677c-1.271-29.957-10.148-58.659-26.475-85.417-16.758-27.466-41.261-51.985-70.859-70.91a33.46,33.46,0,0,1,0-56.346ZM95.5,48V31.5h321V48a8.51,8.51,0,0,1-8.5,8.5H104A8.51,8.51,0,0,1,95.5,48Zm321,416v16.5H95.5V465a9.511,9.511,0,0,1,9.5-9.5H408A8.51,8.51,0,0,1,416.5,464ZM156.326,440.5c9.833-15.6,34.228-30.213,69.191-41.093,13.416-4.175,23.818-10.142,30.483-17.343,6.664,7.2,17.067,13.168,30.483,17.343,34.963,10.88,59.358,25.493,69.191,41.093ZM279.58,256a48.221,48.221,0,0,0,22.328,40.812C357.044,332.062,389.639,384.1,392.3,440.5H372.437c-8.976-22.222-37.552-41.741-81.5-55.415-14.954-4.654-25.352-11.915-27.814-19.422a7.5,7.5,0,0,0-14.253,0c-2.462,7.507-12.859,14.768-27.813,19.422-43.946,13.675-72.528,33.193-81.5,55.415H119.7c2.663-56.4,35.258-108.438,90.393-143.688a48.462,48.462,0,0,0,0-81.624C154.956,179.938,122.361,127.9,119.7,71.5H392.3c-2.662,56.4-35.251,108.438-90.387,143.688A48.221,48.221,0,0,0,279.58,256Z"/><path d="M358.318,124.12a7.5,7.5,0,0,0-6.418-3.62H160.1a7.5,7.5,0,0,0-6.641,10.986c14.123,26.9,36.873,50.892,65.791,69.383a65.309,65.309,0,0,1,29.344,44.671,7.5,7.5,0,0,0,14.812,0,65.313,65.313,0,0,1,29.344-44.672c28.917-18.49,51.667-42.482,65.79-69.382A7.5,7.5,0,0,0,358.318,124.12ZM284.67,188.23A80.5,80.5,0,0,0,256,220.106a80.489,80.489,0,0,0-28.67-31.875c-22.679-14.5-41.2-32.563-54.18-52.731h165.7C325.87,155.668,307.349,173.729,284.67,188.23Z"/><path d="M256,264.5a7.5,7.5,0,0,0-7.5,7.5v7.987a7.5,7.5,0,1,0,15,0V272A7.5,7.5,0,0,0,256,264.5Z"/><path d="M256,304.5a7.5,7.5,0,0,0-7.5,7.5v7.987a7.5,7.5,0,1,0,15,0V312A7.5,7.5,0,0,0,256,304.5Z"/></g></svg>
    <p>?????? ??????????????????: ???? ???????????????????? ????????</p></div>`
   }else{
    li.innerHTML += `<div class="el_pt_pd"><svg id="Icons" height="40" viewBox="0 0 74 74" width="40" fill="#8198e9" xmlns="http://www.w3.org/2000/svg"><path d="m69.88 46.741a1.022 1.022 0 0 1 -.255-.034 1 1 0 0 1 -.712-1.222 33.6 33.6 0 0 0 1.01-6.05 1 1 0 0 1 1.994.149 35.615 35.615 0 0 1 -1.07 6.416 1 1 0 0 1 -.967.741z"/><path d="m37.01 72.01a35 35 0 1 1 32.015-49.144 1 1 0 0 1 -1.83.808 32.994 32.994 0 1 0 .01 26.662 1 1 0 0 1 1.83.808 35.021 35.021 0 0 1 -32.025 20.866z"/><path d="m70.919 35.51a1 1 0 0 1 -1-.926 32.837 32.837 0 0 0 -1.019-6.055 1 1 0 1 1 1.932-.518 34.812 34.812 0 0 1 1.081 6.424 1 1 0 0 1 -.913 1.072z"/><path d="m37.011 65.008a28 28 0 1 1 28-28 28.031 28.031 0 0 1 -28 28zm0-54a26 26 0 1 0 26 26 26.029 26.029 0 0 0 -26-26z"/><path d="m37.011 18.594a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m37.011 60.008a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m50.739 24.28a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 1 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m21.455 53.564a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 0 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m52.567 53.564a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 0 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m23.283 24.28a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 1 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m59.011 38.008h-2.586a1 1 0 0 1 0-2h2.586a1 1 0 0 1 0 2z"/><path d="m17.6 38.008h-2.589a1 1 0 0 1 0-2h2.589a1 1 0 0 1 0 2z"/><path d="m32.942 42.181a1 1 0 0 1 -.707-1.707l3.765-3.765v-12.7a1 1 0 1 1 2 0v13.115a1 1 0 0 1 -.293.707l-4.058 4.057a1 1 0 0 1 -.707.293z"/></svg><p>?????? ??????????????????: ?????????????????? ??????????????????</p></div>`
   } if (post.lk_j21_dv_i297==true){
    li.innerHTML += `<div class="el_pt_pd"> <svg id="Icons" height="40" viewBox="0 0 74 74" width="40" fill="#8198e9" xmlns="http://www.w3.org/2000/svg"><path d="m69.88 46.741a1.022 1.022 0 0 1 -.255-.034 1 1 0 0 1 -.712-1.222 33.6 33.6 0 0 0 1.01-6.05 1 1 0 0 1 1.994.149 35.615 35.615 0 0 1 -1.07 6.416 1 1 0 0 1 -.967.741z"/><path d="m37.01 72.01a35 35 0 1 1 32.015-49.144 1 1 0 0 1 -1.83.808 32.994 32.994 0 1 0 .01 26.662 1 1 0 0 1 1.83.808 35.021 35.021 0 0 1 -32.025 20.866z"/><path d="m70.919 35.51a1 1 0 0 1 -1-.926 32.837 32.837 0 0 0 -1.019-6.055 1 1 0 1 1 1.932-.518 34.812 34.812 0 0 1 1.081 6.424 1 1 0 0 1 -.913 1.072z"/><path d="m37.011 65.008a28 28 0 1 1 28-28 28.031 28.031 0 0 1 -28 28zm0-54a26 26 0 1 0 26 26 26.029 26.029 0 0 0 -26-26z"/><path d="m37.011 18.594a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m37.011 60.008a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m50.739 24.28a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 1 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m21.455 53.564a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 0 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m52.567 53.564a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 0 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m23.283 24.28a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 1 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m59.011 38.008h-2.586a1 1 0 0 1 0-2h2.586a1 1 0 0 1 0 2z"/><path d="m17.6 38.008h-2.589a1 1 0 0 1 0-2h2.589a1 1 0 0 1 0 2z"/><path d="m32.942 42.181a1 1 0 0 1 -.707-1.707l3.765-3.765v-12.7a1 1 0 1 1 2 0v13.115a1 1 0 0 1 -.293.707l-4.058 4.057a1 1 0 0 1 -.707.293z"/></svg><p> ?????????? ?? ????????????: ?????????? 30 ??/????????????</p> </div>`
   }else{
    li.innerHTML += ` <div class="el_pt_pd"><svg id="Icons" height="40" viewBox="0 0 74 74" width="40" fill="#8198e9" xmlns="http://www.w3.org/2000/svg"><path d="m69.88 46.741a1.022 1.022 0 0 1 -.255-.034 1 1 0 0 1 -.712-1.222 33.6 33.6 0 0 0 1.01-6.05 1 1 0 0 1 1.994.149 35.615 35.615 0 0 1 -1.07 6.416 1 1 0 0 1 -.967.741z"/><path d="m37.01 72.01a35 35 0 1 1 32.015-49.144 1 1 0 0 1 -1.83.808 32.994 32.994 0 1 0 .01 26.662 1 1 0 0 1 1.83.808 35.021 35.021 0 0 1 -32.025 20.866z"/><path d="m70.919 35.51a1 1 0 0 1 -1-.926 32.837 32.837 0 0 0 -1.019-6.055 1 1 0 1 1 1.932-.518 34.812 34.812 0 0 1 1.081 6.424 1 1 0 0 1 -.913 1.072z"/><path d="m37.011 65.008a28 28 0 1 1 28-28 28.031 28.031 0 0 1 -28 28zm0-54a26 26 0 1 0 26 26 26.029 26.029 0 0 0 -26-26z"/><path d="m37.011 18.594a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m37.011 60.008a1 1 0 0 1 -1-1v-2.586a1 1 0 0 1 2 0v2.586a1 1 0 0 1 -1 1z"/><path d="m50.739 24.28a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 1 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m21.455 53.564a1 1 0 0 1 -.707-1.707l1.828-1.828a1 1 0 0 1 1.414 1.414l-1.828 1.828a1 1 0 0 1 -.707.293z"/><path d="m52.567 53.564a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 0 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m23.283 24.28a1 1 0 0 1 -.707-.293l-1.828-1.828a1 1 0 1 1 1.414-1.414l1.828 1.828a1 1 0 0 1 -.707 1.707z"/><path d="m59.011 38.008h-2.586a1 1 0 0 1 0-2h2.586a1 1 0 0 1 0 2z"/><path d="m17.6 38.008h-2.589a1 1 0 0 1 0-2h2.589a1 1 0 0 1 0 2z"/><path d="m32.942 42.181a1 1 0 0 1 -.707-1.707l3.765-3.765v-12.7a1 1 0 1 1 2 0v13.115a1 1 0 0 1 -.293.707l-4.058 4.057a1 1 0 0 1 -.707.293z"/></svg> <div class="el_pt_pd"><p> ?????????? ?? ????????????: ?????????? 30 ??/????????????</p></div>`
   }
   
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
return li
}
function togglePostLike(PostID) {
    return doPost(`/api/post/${PostID}/toggle_like`)
}