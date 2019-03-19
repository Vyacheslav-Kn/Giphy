import {urlToGifMethod, urlToSearchMethod} from './helpers-and-routes.js'
import {addHistoryStateAndPathName} from './manipulate-local-storage.js'

export function redirect() {
    const {state} = history
    let pathName = window.location.pathname
    if (window.location.search) {
        pathName += window.location.search
    }
    addHistoryStateAndPathName(JSON.stringify(state), JSON.stringify(pathName))

    if (window.location.indexOf(urlToSearchMethod) >= 0) {
        window.location = window.location.substring(0, window.location.indexOf(urlToSearchMethod))
        return
    }

    window.location = window.location.substring(0, window.location.indexOf(urlToGifMethod))
}