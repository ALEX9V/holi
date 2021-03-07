const mentionsRegExp = /\B@([a-zA-Z][a-zA-Z0-9_-]{0,17})/g
const urlsRegExp = /\b(https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,\.;]*[\-A-Za-z0-9+&@#\/%=~_|])/gi
const imageExtRegExp = /(\.gif|\.jpg|\.png)$/
const videoExtRegExp = /(\.mp4|\.webm)$/

export function isObject(x) {
    return typeof x === "object" && x !== null
}
export function isPlainObject(x) {
    return isObject(x) && !Array.isArray(x)
}
/**
 * 
 * @param {string} s 
 */
export function escapeHTML(s) 
{
    return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/"/g, "&#039;")
}
/**
 * @param {string} html
 */
export function el(html) {
    const template = document.createElement("template")
    template.innerHTML = html
    return template.content.childElementCount === 1
        ? template.content.firstElementChild
        : template.content
}
/**
 * @param {ParentNode} el
 */
export function collectMedia(el) {
    const media = /** @type {Node[]} */ ([])
    for (const link of Array.from(el.querySelectorAll("a"))) {
        if (imageExtRegExp.test(link.href)) {
            const img = document.createElement("img")
            img.src = link.href
            const a = document.createElement("a")
            a.href = link.href
            a.target = "_blank"
            a.rel = "noopener"
            a.className = "media-item"
            a.appendChild(img)
            media.push(a)
            continue
        }

        if (videoExtRegExp.test(link.href)) {
            const video = document.createElement("video")
            video.src = link.href
            video.controls = true
            video.loop = true
            video.volume = 0.5
            video.muted = true
            video.className = "media-item"
            media.push(video)
            continue
        }

        const youtubeVideoID = findYouTubeVideoID(link.href)
        if (youtubeVideoID !== null) {
            const img = document.createElement("img")
            img.src = `https://img.youtube.com/vi/${youtubeVideoID}/maxresdefault.jpg`
            const a = document.createElement("a")
            a.href = link.href
            a.target = "_blank"
            a.rel = "noopener"
            a.className = "media-item youtube-video-wrapper"
            a.appendChild(img)
            media.push(a)
            continue
        }
    }
    return media
}
/**
 * @param {Node} oldNode
 * @param {Node} newNode
 */
export function replaceNode(oldNode, newNode) {
    oldNode.parentNode.insertBefore(newNode, oldNode)
    oldNode.parentNode.removeChild(oldNode)
    return newNode
}
/**
 * @param {string|Date} date
 */
export function ago(date) {
    if (!(date instanceof Date)) {
        date = new Date(date)
    }
    const now = new Date()
    let diff = (now.getTime() - date.getTime()) / 1000
    if (diff <= 60) {
        return "Just now"
    } else if ((diff /= 60) < 60) {
        return (diff | 0) + "m"
    } else if ((diff /= 60) < 24) {
        return (diff | 0) + "h"
    } else if ((diff /= 24) < 7) {
        return (diff | 0) + "d"
    }
    let text = String(date).split(" ")[1] + " " + date.getDate()
    if (now.getFullYear() !== date.getFullYear()) {
        text += ", " + date.getFullYear()
    }
    return text
}
export function smartTrim(s) {
    return s
        .split("\n")
        .map(s => s.replace(/(\s)+/g, "$1").trim())
        .join("\n")
        .replace(/(\n){2,}/g, "$1$1")
        .trim()
}

export const transliterate = (
    
    function() {
        var
          rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
         eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)

        ;
   return function(text, engToRus) {

            var x;

            for(x = 0; x < rus.length; x++) {

                text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);

                text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());

         }
            return text;
}

    }
)();