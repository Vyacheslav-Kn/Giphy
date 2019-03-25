import {urlToGifMethod, urlToSearchMethod} from "./configuration.js"

export function getRepositoryLocation () {
    const {href} = location
    if (href.indexOf(urlToSearchMethod) >= 0) {
        return href.substring(0, href.indexOf(urlToSearchMethod))
    }

    return href.substring(0, href.indexOf(urlToGifMethod))
}

export function getRepositoryName () {
    const repositoryLocation = getRepositoryLocation()
    
    return repositoryLocation.substring(0, location.origin.length + 1)
}