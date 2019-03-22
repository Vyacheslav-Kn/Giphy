import {urlToGifMethod, urlToSearchMethod} from "./configuration.js"

export function getRepositoryLocation () {
    const {href} = location
    if (href.indexOf(urlToSearchMethod) >= 0) {
        return href.substring(0, href.indexOf(urlToSearchMethod))
    }

    return href.substring(0, href.indexOf(urlToGifMethod))
}