import {createRouter } from '/js/router.js'
import { guard } from "/js/auth.js"
//import { doGet, doPost, subscribe } from "/js/http.js"
const viewAccess = view("96876567745343295")
const r = createRouter()
r.route('/', guard( view('RLim-p99278463271391'), view('96876567745143295')))
r.route('/login', guard( view('RLim-p99278463271391'), view('96876567745343295')))
r.route("/search",  guard( view("912592456734518285"), view('96876567745343295')))
r.route("/home", view("961765436617863245"))
r.route("/about", view("968765343745343295"))
r.route("/privacy", view("816787956189055434"))
r.route("/searcher", guard( view('826758792865673456'), view("826758792865673456")))
r.route("/chat", guard(  view("968765343767163285"), view('96876567745343295')))
r.route("/groups",guard(  view("968765343734563295"), view('96876567745343295')))
r.route("/perfomance", guard(view("961724102861063245"), view('96876567745343295')))
r.route(/^\/group\/(?<PostID>\d+)$/, guard(view("968765343756563295"), view('96876567745343295')))
r.route(/^\/update\/(?<PostID>\d+)$/, guard(view("update-id"), view('96876567745343295')))
r.route(/^\/groups\/(?<PostID>\d+)$/,guard( view("968765343745563295"), view('96876567745343295')))
r.route(/^\/messenge\/(?<PostID>\d+)$/, guard(view("mess"), view('96876567745343295')))
r.route(/^\/tags\/(?<Tag>[a-zA-Z][a-zA-Z0-9_-]{0,17})$/, guard(view("816787687189055438"), view('96876567745343295')))
r.route(/^\/users\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{0,17})$/,guard( view('user'), view('96876567745343295')))
r.route(/^\/users\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{0,17})\/update$/,guard( view('user-setting'), view('96876567745343295')))
r.route(/^\/users\/(?<username>[a-zA-Z][a-zA-Z0-9_-]{0,17})\/publicate$/,guard( view('user-public'), view('96876567745343295')))
r.route(/^\/post\/(?<PostID>\d+)$/, guard(view('965924102861019245'), view('96876567745343295')))
r.route("/notifications", guard(view("961724996781063245"), viewAccess))
r.route(/\//, view('961765456467863245'))
r.subscribe(renderInto(document.querySelector('main')))
r.install()
function view(name){
    return (...args) => import(`/js/${name}-page.js`).then(m => m.default(...args))
}

function renderInto(target){
    return async result => {
        target.innerHTML = ''
        target.appendChild(await result)
               
    }
}