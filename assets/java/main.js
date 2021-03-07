console.log("hello world")
import{ createRouter} from './router.js'
const r = createRouter()
r.route('/', () => {
    return 'homepage'
})
r.subscribe(renderInto(document.querySelector('main')))
r.install()
function renderInto(target){
    return result => (
        terget.innerHTML = result
    )
}