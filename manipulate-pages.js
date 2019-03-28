import * as pageElements from "./manipulate-page-elements.js"
import * as search from "./search.js"
import * as storage from "./manipulate-local-storage.js"
import {urlToGifMethod, urlToSearchMethod} from "./configuration.js"

function openNewSearchPage (currentUrl) {
    const searchPhrase = currentUrl.substring(currentUrl.indexOf(urlToSearchMethod) + urlToSearchMethod.length)
    const searchProperties = {searchPhrase, offset: search.defaultOffset, limit: search.defaultLimit}
    history.replaceState({searchState: searchProperties}, "", currentUrl)

    search.searchGifsByPhrase(searchProperties)
        .then(data => {
            pageElements.insertLoadedGifs(data)
            pageElements.insertLoadButton(searchProperties)
        })
        .catch(error => console.log(error))

    storage.clear()
}

function openNewGifPage (currentUrl) {
    const gifId = currentUrl.substring(currentUrl.indexOf(urlToGifMethod) + urlToGifMethod.length)
    history.replaceState({hasComeByReference: true, gifState: {gifId}}, "", currentUrl)

    search.getGifById(gifId)
        .then(data => pageElements.insertGif(data))
        .catch(error => console.log(error))

    storage.clear()
}

export function preparePagesForNonUserInitiatedTransition (currentUrl) {
    // Search page reference
    if (currentUrl.indexOf(urlToSearchMethod) >= 0) {
        openNewSearchPage(currentUrl)
        return
    }

    // Gif page reference
    if (currentUrl.indexOf(urlToGifMethod) >= 0) {
        openNewGifPage(currentUrl)
        return
    }

    // Main page reference
    pageElements.clearGifElements()
    pageElements.clearSearchElements()
}

function openOldSearchPage (currentState) {
    const {searchState} = currentState
    const modifiedSearchState = {...currentState.searchState}

    const numberOfLoadGifsRequests = (searchState.offset / searchState.limit) + 1
    modifiedSearchState.limit = numberOfLoadGifsRequests * searchState.limit
    modifiedSearchState.offset = search.defaultOffset

    pageElements.clearSearchElements()
    pageElements.clearGifElements()

    search.searchGifsByPhrase(modifiedSearchState)
        .then(data => {
            // Inserts gifs into page, like user loaded them through requests
            for (let i = 0; i < numberOfLoadGifsRequests; i++) {
                const gifsPortion = data.slice(searchState.limit * i, searchState.limit * (i + 1))
                pageElements.insertLoadedGifs(gifsPortion)
            }
        })
        .catch(error => console.log(error))

    pageElements.insertLoadButton(searchState)
}

function openOldGifPage (currentState) {
    const {gifState} = currentState
    search.getGifById(gifState.gifId)
        .then(data => pageElements.insertGif(data))
        .catch(error => console.log(error))
}

export function preparePagesForUserInitiatedTransition (currentState) {
    // User comes to search page
    if (currentState.searchState) {
        openOldSearchPage(currentState)
        return
    }

    // User comes to gif page
    if (currentState.gifState) {
        openOldGifPage(currentState)
    }
}
