
const calendar = document.querySelector("#r456_sib809809")
if(calendar==null){
   
}
const template = document.createElement('template')
template.innerHTML = `
<style>
a{font-family: 'helfetica'; }
.wrapper {
   
}

.container{
    margin-top: 25vh;
    text-align: center;
    font-family: sans-serif;
}
.head_line_for {
    background-color: transparent;
    box-shadow:none!important;
}
.a_side_ineer_body{
    width:100%;
    height:100vh;
    background:url('/img/aaaaa.svg')no-repeat;
    background-size: 100%;
   // background-color: #4f2dc1;
   
}
h1{
    font-size: 50px;
    color: #8198e9;
    font-family: 'FontName'; 
}
.a_hd_rl{
    margin-left: 60px;
    margin-top: 13px;
    display: inline-table;
}
.btn-mn-cl{
    margin-top:20px;
}
span{
    
    font-size: 20px;
    color: rgb(255 255 255);
 
}
.logreg{
    display: block;
    float: right;
    margin-right: 40px;
}
@font-face {
	font-family: 'FontName'; 
	src: url(/fonts/19755.ttf); 
}
@font-face {
	font-family: 'helfetica'; 
	src: url(/fonts/17573.ttf); 
}
.btn-mn-cl-im{
    width: 300px;
    height: 47px;
    font-size: 15px;
}

.container-pt{
    width: 100vh;
    height: 500px;
   
    margin-top: 25vh;
    padding: 30px;
    border-radius:50px;
}
#line_block { 
    width: 220px; 
    height:50px; 
    background:#f1f1f1; 
    float:left; 
    margin: 0 62px 15px 0; 
    text-align:center;
    padding: 10px;
    }
    h2{
        font-size: 30px;
    }
    .p, .span, .h3 {
        color:grey;
    }
    .h1{    text-align: center;
        margin-top: 10vh;
    }
  #mine_block  {
        margin-top: 30vh;
    }
  .btn-bt{
        margin-left: 35vh;
        margin-bottom: 20vh;
    }
    .ft-rl-67868768{
        bottom: 0;
        height: 100px;
        width: 100%;
        background: #2c0348;
        border-radius: 30px 30px 0 0;
        color: gray;
        position: absolute;
        top: 380%;
        text-align: center;
        left: 0;
        padding: 99px 0 1px 0;
    
    }
</style>

<div class="container">

<h1 > Площадка фриланса</h1>
</br>
<span>Нанимайте проверенных профессионалов с уверенностью, используя нашу удаленную платформу талантов, а также вы можете открыть стартап в любой точке мира.Независимо от того, где вы находитесь, Rulixolt позволяет наладить обратную связь с заказчиками и исполнителями.</span>
</br>
<div class="btn-mn-cl">
<a class="a_hd_rl" href="/login"><button class="btn-mn-cl-im">Вход</button></a><a class="a_hd_rl" href="/searcher"><button class="btn-mn-cl-im" style="margin-left:40px;    background: #514e6b;">Продолжить с Rulixolt </button></a>
</div>
</div>

<div class="container-pt">
<img src="/img/576576576.svg"/>
<h2 class="h1">✦ Как это работает ?</h2>
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
</br>
<div id="mine_block">
<h2 class="h1">
<img src="/img/24-hours.svg"/>
✦ Как начать?
</h2>
<div id="line_block">

<h3  class="h3"><span class="span">
</span> <span class="span">▾ Шаг 1 </span></h3> <p  class="p">
Зарегистрируйтесь или войдите в систему. Для этого перейдите во вкладку регистрации.
</p> </div> 
<div id="line_block"><h3  class="h3"><span class="span">

</span> <span class="span">▾ Шаг 2</span></h3> <p  class="p">
Заполните профиль во вкладке настройки профиля.
</p></div> 
<div id="line_block">
<h3  class="h3"><span class="span">

</span> <span class="span">▾ Шаг 3</span></h3> <p  class="p">
Начинайте искать заказы или исполнителей. 
</p>
</div>
</div>
<img style="margin-top: 15vh;" src="/img/576576575.svg"/>
<h2 class="h1" style="
background: url(img/bg.svg);
height: 27vh;">♦︎ Готовы присоединиться к нам ?
</br></br>
<a class="a_hd_rl" style="" href="/login"><button class="btn-mn-cl-im ">Вход</button></a>
</h2>

<div class="ft-rl-67868768">
© 2021, Rulixolt Web Services, Inc. или ее филиалы. Все права защищены.
</div>
</div>
`
export default function renderNotFoundPage() {
    const page = /** {DocumentFragment} */ (template.content.cloneNode(true))
    
    const header = document.querySelector(".head_line_for")
   
    const sidebar = document.querySelector("#sidebar")
    const listofuser = document.querySelector("#chat_window_room")
    if (header!=null && calendar!=null){
   header.innerHTML=`<span class="logo_cl32392323">Rl</span><a class="a_hd_rl" href="about">О НАС</a><a class="a_hd_rl" href="/searcher">ГЛАВНАЯ</a> <a class="a_hd_rl" href="/users/admin">ПОДДЕРЖКА</a>
   <div class="logreg"><a class="a_hd_rl" href="/login">Вход</a> <a class="a_hd_rl" href="/search" onclick="window.location.reload();">Регистрация</a></div>`
  
   calendar.remove()
   if(listofuser!=null){
    listofuser.innerHTML=""
    sidebar.remove()
   }
  }
    return page
}

