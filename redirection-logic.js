import {urlToGifMethod, urlToSearchMethod} from './helpers-and-routes.js'
import {addHistoryStateAndPathName} from './manipulate-local-storage.js'

function getWindowLocation () {
    const {href} = location
    if (href.indexOf(urlToSearchMethod) >= 0) {
        return href.substring(0, href.indexOf(urlToSearchMethod))
    }

    return href.substring(0, href.indexOf(urlToGifMethod))
}

export function redirect() {
    const {state} = history
    let pathName = window.location.pathname
    if (window.location.search) {
        pathName += location.search
    }
    addHistoryStateAndPathName(JSON.stringify(state), JSON.stringify(pathName))

    window.location = getWindowLocation()
}