import {urlToGifMethod, urlToSearchMethod} from "./configuration.js"

export function getRepositoryLocation () {
    const {href} = location
    let index = href.indexOf(urlToSearchMethod)

    if (index === -1) {
        index = href.indexOf(urlToGifMethod)
    }

    return href.substring(0, index)
}
