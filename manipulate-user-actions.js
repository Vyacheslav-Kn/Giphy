import * as page from './manipulate-page-elements.js'
import * as storage from './manipulate-local-storage.js'
import {urlToGifMethod} from './helpers-and-routes.js'

// eslint-disable-next-line max-statements
export function manageBrowserButtons () {
    let currentState = history.state
    let currentUrl = window.location.href

    const savedPathName = storage.getPathName()
    if (savedPathName !== null) {
        currentUrl = `${JSON.parse(savedPathName).replace('/Giphy/', '')}`
    } 

    if (history.state === null) {
        const savedHistoryState = storage.getHistoryState()

        if (savedHistoryState === null) {
            page.preparePageForNonUserInitiatedTransition(currentUrl)
            return
        }

        // User comes after refreshing some page -> take state from local storage
        currentState = JSON.parse(savedHistoryState)
        history.replaceState(currentState, '', currentUrl)
        storage.clear()
    }

    page.preparePageForUserInitiatedTransition(currentState)
}

export function moveToGifPage (gif) {
    const gifState = {gifId: gif.id}
    history.pushState({gifState}, '', `${urlToGifMethod}${gif.id}`)
    page.insertGifOnPage(gif)
}

export function moveBackToSearchPage () {
    if (history.state.isMovedFromMainPage) {
        if (window.location.indexOf(urlToGifMethod) >= 0) {
            window.location = window.location.substring(0, window.location.indexOf(urlToGifMethod))
            return
        }
    }

    history.back()
    
    // Event 'onpopstate' doesn't happened -> manipulate page elements manually
    page.clearGifElements()
}