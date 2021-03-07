

const reUsername = /^[a-zA-Z][a-zA-Z0-9_-]{0,17}$/
const template = document.createElement('template')
template.innerHTML = `
<style>
@font-face {
	font-family: 'FontName'; 
	src: url(/fonts/19755.ttf); 
}
#btn-reg-lk{
}
button{
    background: #ad2a96;
}
.a_side_ineer_body{
    width:100%;
    height:100vh;
    max-height:100vh;
    
    background-size: 100%;
   // background-color: #4f2dc1;
   
}
#sidebar {
   max-width: 880px!important;
   min-width: 880px!important;
    margin-left: 68vh!important;
    min-height: 40px!important;
    color: #fff;
    transition: all 0.3s;
    position: absolute;
    float: left;
}
.leftside{
    left: 0;
    position: absolute;
    height: 100vh;
   
}#line_block { 
    width: 220px; 
    height:50px; 
    background:#f1f1f1; 
    float:left; 
    margin: 0 62px 15px 0; 
    text-align:center;
    padding: 10px;
    margin-top:60px;
    }
    h2{
        font-size: 30px;
    }
    .p, .span, .h3 {

        color: grey;
        font-size: 18px;
    }

.wrapper{
    background-image:url("img/footer.svg");
    min-height: 100vh;
}
.link{
    margin-left:50px;font-size: 18px;
    display: inline-block;
    margin-top: 8px;
}

h2{    font-size: 19px;}
h1{    font-size: 40px;    margin-top: 100px;
    color: #282628; }
img{
    height: 100vh;
}
</style>
<div class="container" >
<h1>Мы создали Rulixolt, чтобы помочь вам найти работу</h1>

<div id="line_block">

<h3  class="h3"><span class="span">
1.
</span> <span class="span">Разместите работу (это бесплатно)</span></h3> <p  class="p">
Расскажите о своем проекте. Платформа связывает вас с лучшими талантами и агентствами по всему миру или рядом с вами.
</p> </div> 
<div id="line_block"><h3  class="h3"><span class="span">
2.
</span> <span class="span">Подождите</span></h3> <p  class="p">
Получите квалифицированные предложения в течение 24 часов. Сравните ставки, отзывы и предыдущие работы. Опросите избранных и наймите наиболее подходящих.
</p></div> 
<div id="line_block">
<h3  class="h3"><span class="span">
3.
</span> <span class="span">Легкое взаимодействие</span></h3> <p  class="p">
Используйте нашу платформу для общения в чате, обмена файлами и отслеживания основных этапов проекта с вашего рабочего стола.
</p>
</div>

</div>

`
export default function renderAccessPage() {
    const calendar = document.querySelector("#r456_sib809809")
    const header = document.querySelector(".head_line_for")
    const sidebar = document.querySelector(".sidebar")
    const listofuser = document.querySelector("#chat_window_room")
   
    if (header!=null ){
   header.innerHTML=`<div class="top_line sh_hd798789798_ds"><span class="logo_cl32392323">Rl</span></div><a class="link" href="/">Главна</a><a class="link" href="/">О нас</a><a class="link"  href="/privacy">Поддержка</a>
    <a class="link" style="margin-left:500px;"href="/">Вход</a> <a class="link" href="/">Регистрация</a>`
    
    if (calendar!=null){
        sidebar.remove()
    calendar.remove()
    if (listofuser!=null){
    listofuser.remove()
    }
    }
    
    }
    //sidebar.innerHTML=`<button id="btn-reg-lk">О нас</button><button id="btn-reg-lk">Почему мы?</button><button id="btn-reg-lk">Подержка</button>`
   // gp.remove()
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const loginForm = /** @type {HTMLFormElement} */ (page.getElementById('login-form'))
    const namer = page.querySelector(".namer")
    const btnreg = page.querySelector("#btn-reg-fm")
    const btnnex = page.querySelector("#btn-nx-fm")
   
   
    return page
}

