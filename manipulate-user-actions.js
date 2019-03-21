import * as browser from "./browser-helpers"
import * as ids from "./elements-ids.js"
import * as pageElements from "./manipulate-page-elements"
import * as pages from "./manipulate-pages.js"
import * as search from "./search.js"
import * as storage from "./manipulate-local-storage.js"
import {urlToGifMethod, urlToSearchMethod} from "./routes"

export function sendSearchRequest () {
    const searchPhrase = encodeURIComponent(pageElements.getElement(ids.searchInput).value)
    const limit = search.defaultLimit
    const offset = search.defaultOffset

    const searchProperties = {searchPhrase, offset, limit}
    history.pushState({searchState: searchProperties}, "", `${urlToSearchMethod}${searchPhrase}`)

    pageElements.clearSearchElements()

    search.searchGifsByPhrase(searchProperties)
        .then(data => {
            pageElements.insertLoadedGifs(data)
            pageElements.insertLoadButton(searchProperties)
        })
        .catch(error => console.log(error))
}

export function moveToGifPage (gif) {
    const gifState = {gifId: gif.id}
    history.pushState({gifState}, "", `${urlToGifMethod}${gif.id}`)
    
    pageElements.insertGif(gif)
}

export function moveBackToSearchPage () {
    if (history.state.hasComeByReference) {
        window.location = browser.getRepositoryLocation()
        return
    }

    history.back()

    // Event 'onpopstate' didn't happen -> manipulate page elements manually
    pageElements.clearGifElements()
}

// eslint-disable-next-line max-statements
export function manageBrowserButtons () {
    let currentState = history.state
    let currentUrl = location.href

    const savedPathName = storage.getPathName()
    if (savedPathName) {
        currentUrl = `${savedPathName.replace("/Giphy/", "")}`
    }

    if (!history.state) {
        const savedHistoryState = storage.getHistoryState()

        if (!savedHistoryState) {
            pages.preparePagesForNonUserInitiatedTransition(currentUrl)
            return
        }

        // User comes after refreshing some page -> take state from local storage
        history.replaceState(savedHistoryState, "", currentUrl)
        storage.clear()
        currentState = savedHistoryState
    }

    pages.preparePagesForUserInitiatedTransition(currentState)
}