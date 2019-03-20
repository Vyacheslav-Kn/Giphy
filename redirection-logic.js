import {urlToGifMethod, urlToSearchMethod} from './helpers-and-routes.js'
import {addHistoryStateAndPathName} from './manipulate-local-storage.js'

function getWindowLocation () {
    if (window.location.indexOf(urlToSearchMethod) >= 0) {
        return window.location.substring(0, window.location.indexOf(urlToSearchMethod))
    }

    return window.location.substring(0, window.location.indexOf(urlToGifMethod))
}

export function redirect() {
    const {state} = history
    let pathName = window.location.pathname
    if (window.location.search) {
        pathName += window.location.search
    }
    addHistoryStateAndPathName(JSON.stringify(state), JSON.stringify(pathName))

    window.location = getWindowLocation()
}