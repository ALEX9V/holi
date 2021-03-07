import { isAuthenticated } from '/js/auth.js'
//import { parseJSON } from '/js/json.js'
import { isObject, isPlainObject} from '/js/utils.js'
import { stringifyJSON, parseJSON } from '/js/jsbigint.js'

/**
 * @param {string} url
 * @param {{[:string]:string}=} headers
 */

export function doGet(url, headers){
  
return fetch(url, {
    headers: Object.assign(defaultHeaders(), headers), 
}).then(parseResponse)
}


/**
 * @param {string} url
 * @param {{[field:string]:any}=} body
 * @param {{[key:string]:string}=} headers
 */

export function doPost(url, body, headers){
   
    const init = {
        method: "POST",
        headers: defaultHeaders(),   
    }
    if (isObject(body)) { 
        init["body"] = JSON.stringify(body)
        init.headers["Content-Type"] = "application/json; charset=utf-8"
    }
  Object.assign(init.headers, headers)
  console.log(body) 
  return fetch(url, init).then(parseResponse)
}

function defaultHeaders() {
   
    return isAuthenticated() ? {
        authorization: 'Bearer ' + localStorage.getItem("token"),
    } : {}
}
export function subscribe(url, cb) {
    if (isAuthenticated()) {
        
        const _url = new URL(url, location.origin)
        
        _url.searchParams.set("token", localStorage.getItem("token"))
        url = _url.toString()
    }
    const eventSource = new EventSource(url)
    eventSource.onmessage = ev => {
        try {
            cb(JSON.parse(ev.data))
        } catch (_) { }
    }
    return () => {
        eventSource.close()
    }
}
export function doPostAvatar(url, body, headers){
   
    const init = {
        method: "POST",
        headers: defaultHeaders(), 
        body:  new FormData( body ),  
    }
    
  Object.assign(init.headers, headers) 
  return fetch(url, init).then(parseResponse)
}

export function doPostAvatarmult(url, body, headers){
   
    const init = {
        method: "POST",
        headers: defaultHeaders(), 
        body:   body ,  
    }
    
  Object.assign(init.headers, headers) 
  return fetch(url, init).then(parseResponse)
}
/**
 * 
 * @param {Response} res 
 */
async function parseResponse(res) {
    //let body =parseJSON( await  res.text())
      const body = await res.clone().json().catch(() => res.text())
       console.log(body)
     
      if (!res.ok) {
        const msg = String(body)
        const err = new Error(msg)
        
        err.name = msg.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("")    
        
       const  arr = err.name.split(':')  

    if(arr[0]=="CouldntDecodeToken"){
        localStorage.clear()
       
    }
    let e =err.name
let z = 'ErrUnauthenticated'
    if (e.trim()==z.trim()){
        console.log(err.message)
        alert("ok")
        localStorage.clear()
        

    }
        err["statusCode"] = res.status
        err["statusText"] = res.statusText
        err["url"] = res.url
        
        throw err
    }
  
  
    return body

}
/**
 * @param {string} url
 * @param {function} cb
 */

