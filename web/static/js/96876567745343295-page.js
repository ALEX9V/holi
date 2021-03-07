import { doPost } from "/js/http.js"
import { stringifyJSON } from "/js/jsbigint.js"
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
   
}
#content{
    width:  auto;
    min-height: 0;
    transition: all 0.3s;
    margin-top: 0;
}
.rightside{
    padding-top: 20vh;
    margin-left: 60vh;
}
.rightside input{
    border-radius: 20px;
    box-shadow: inset rgb(66 66 138 / 25%) 0px 6px 18px 2px, rgb(163 169 174 / 30%) 0px 1px 2px 0px;
    width: 200px;
    color:#98a0a3;
}
h2{    font-size: 19px;}
h1{font-size: 36px;    color: #ad2a96; }
img{
    height: 100vh;
}
</style>
<div class="container" >
<div class="leftside">
<img src="/img/ff731eee5a363f187d43a41e7446841d.jpg"/>
</div>
<div class="rightside">
<h1>Rulix</h1>
<div class="errors"></div>
<div class="namer">
<h2>Войдите, чтобы продолжить</h2> 
<form id="login-form" class="login-form">
<h2>Почта </h2>
    <input type="text" name="email" id="RL-log-in-vl" placeholder="Введите mi@ya.com" autocomplete="email" required>
    <button id="btn-nx-fm">далее</button> 
</form>

</br>
<span>Не зарегистрированы? Зарегистрируйтесь прямо сейчас</span></br></br>

<button id="btn-reg-fm">Зарегистрироваться</button>
</div>

</div>

</div>

`
export default function renderAccessPage() {
    const calendar = document.querySelector("#r456_sib809809")
    const header = document.querySelector(".head_line_for")
    const sidebar = document.querySelector(".sidebar")
    const listofuser = document.querySelector("#chat_window_room")
   
    if (header!=null ){
    header.remove()
    
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
    const errors= page.querySelector(".errors")
    const btnnex = page.querySelector("#btn-nx-fm")
    btnreg.addEventListener("click", onRgFormSubmit)
    btnnex.addEventListener("click", onNexFormSubmit)
   
    return page
}
function ckEmail(tst)
{  
    var okd = ['yahoo.com', 'yandex.ru',"google.com","mail.ru"] // Valid domains...
    var emailRE = /^[a-zA-Z0-9._+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/
  var aLst = emailRE.exec(tst)

  if (!aLst) return 'A valid e-mail address is requred';
  var sLst = aLst[1].toLowerCase()
  for (var i = 0; i < okd.length; i++) {
      if (sLst == okd[i]) {
          return true
      }
  }

  
  return aLst[1];
}
async function onNexFormSubmit(ev){
    const namer = document.querySelector(".namer")
    var text = document.getElementById("RL-log-in-vl").value
    text = text.replace(/ +/g, ' ').trim()
    alert(text)
     var ckValid = ckEmail(text)
    if (ckValid === true) {
   
    namer.innerHTML=`

    <form id="login-form" class="login-form">
    <span>Имя: </span><span id="email-rl-bt">${text}</span>
     <h2>Пароль </h2>
        <input type="password" name="password" placeholder="Введите пароль" autocomplete="email"  required>
        </br></br>
        <button>Войти</button>
    </form>`
    namer.addEventListener("submit", onLoginFormSubmit)
    
}
else {
    alert("ошибка")  // placeholder for show error message
}
}
async function onRgFormSubmit(ev){
    const namer = document.querySelector(".namer")
    namer.innerHTML=`
    <form id="reg-form" class="reg-form">
    <h2>Логин</h2>
        <input type="text" class="rl-us-in" placeholder="Логин"  required/>
        </br> 
        <h2>Имя</h2>
        <input type="text"  class="rl-us-nm" name="names" placeholder="Имя" pattern="[а-яА-ЯёЁ]+" required title="Можно использовать только кириллицу" required>
        </br> 
        <h2>Фамилия</h2>
        <input type="text" class="rl-us-fm" name="name" placeholder="Фамилия" pattern="[а-яА-ЯёЁ]+" required title="Можно использовать только кириллицу" required>
        </br> 
        <h2>Почта </h2>
        <input type="text" name="email" class="rl-em-in" placeholder="Введите mi@ya.com" autocomplete="email" required>
        </br></br> 
     <h2>Пароль </h2>
        <input type="password" name="password" class="rl-ps-in" placeholder="Введите пароль от учетной записи" autocomplete="email"  required>
        </br></br>
        <p style="color: gray;"><input type="checkbox" name="a" value="true" style="width:20px;"required > Создание учетной записи означает, что вы согласны с нашими </br> <a href="/privacy" target="_blank" >Условиями предоставления услуг и Политикой конфиденциальности</a></p>
    </form>
    <button class="reg">Зарегистрироваться</button>
   
   
   ` 
   const btn = namer.querySelector(".reg")
   btn.addEventListener("click", async function(){
       alert()
       var per_name =/^[А-Я]$/i
   const username = document.querySelector(".rl-us-in").value
   const fn = document.querySelector(".rl-us-nm").value
   const ln = document.querySelector(".rl-us-fm").value
   const email = document.querySelector(".rl-em-in").value
   const password = document.querySelector(".rl-ps-in").value
if (!reUsername.test(username)) {
    const errors= document.querySelector(".errors")
    errors.innerHTML=`<h2 style="    color: rebeccapurple;    font-size: 17px;">Ощибка: Неверный логин. Попробуйте еще раз.</h2>`
    return
}
if(!per_name.test(fn)||!per_name.test(ln)){
    const errors= document.querySelector(".errors")
    errors.innerHTML=`<h2 style="    color: rebeccapurple;    font-size: 17px;">Ощибка: Можно использовать только кириллицу!</h2>`
    
}


email.replace( /\s/g, '')
var ckValid = ckEmail(email)
if (ckValid === true) {
   try { 
   await createUser(email, username, password, fn, ln)
   saveLogin(await login(email, password))
    location.reload()
} catch (err) {
    console.error(err)
    alert("errname")
    alert(err.name)
    if (err.name === "Error") {
        runRegistrationProgram(email, password)
    }
}
}else{alert("error")}
})
}
/**
 * 
 * @param {Event} ev
 */
async function onLoginFormSubmit(ev){
    ev.preventDefault()
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget)
    const pass = form.querySelector("input").value
    alert(pass)
    const button = form.querySelector("button")
    const email = document.getElementById("email-rl-bt").innerHTML
    alert(email)
   // input.disabled = true
    button.disabled = true
    
   
    try{
        saveLogin(await login(email, pass))
        location.reload()
        
        
    } catch (err) {
        console.log(err)
        if (err) {
        if (confirm('User not found. Do you want to create an account?')){
            runRegistrationProgram(email)
        }
        return
    }
        setTimeout(input.focus())
    } finally {
    input.disabled = false
    button.disabled=false
   
    }

}
/**
 * @param {import("/js/types.js").LoginOutput} payload
 */
function saveLogin(payload) {

   
console.log( payload.AuthUser)

    localStorage.setItem("auth_user", stringifyJSON( payload.AuthUser))
    localStorage.setItem("token", payload.Token)
    localStorage.setItem("expires_at", String(payload.ExpiresAt))
    localStorage.setItem("avatar_image", stringifyJSON( payload.URL))
}
/**
 * @param {string} email
 * @param {string=} username
 */
async function runRegistrationProgram(email, username, pass, fn, ln) {
    username = prompt("Username:", username)
    if (username === null) {
        return
    }
    username = username.trim()
    if (!reUsername.test(username)) {
        alert("invalid username")
        runRegistrationProgram(email, username)
        return
    }
       try { 
       await createUser(email, username, fn, ln)
       saveLogin(await login(email))
        location.reload()
    } catch (err) {
        console.error(err)
        alert("errname")
        alert(err.name)
        if (err.name === "Error") {
            runRegistrationProgram(email)
        }
    }
}
/**
 * @returns {Promise<import("/js/types.js").LoginOutput>}
 */
function login(email, pass) {
    return doPost("/api/login", { email, pass })
}
/**
 * @param {string} email
 * @param {string} username
 * @returns {Promise<void>}
 */
function createUser(email, username, pass , fn, ln) {
    return doPost("/api/signup", { email, username, pass, fn, ln})
}