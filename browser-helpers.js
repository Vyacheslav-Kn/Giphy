import {urlToGifMethod, urlToSearchMethod} from "./configuration.js"

export function getRepositoryLocation () {
    const {href} = location
    const indexOfSearchMethod = href.indexOf(urlToSearchMethod)

    if (indexOfSearchMethod > -1) {
        return href.substring(0, indexOfSearchMethod)
    }

    return href.substring(0, href.indexOf(urlToGifMethod))
}
