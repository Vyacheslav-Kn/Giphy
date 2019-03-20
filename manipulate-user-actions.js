import * as page from './manipulate-page-elements.js'
import * as storage from './manipulate-local-storage.js'
import {urlToGifMethod} from './helpers-and-routes.js'

// eslint-disable-next-line max-statements
export function manageBrowserButtons () {
    let currentState = history.state
    let currentUrl = location.href

    const savedPathName = JSON.parse(storage.getPathName())
    if (savedPathName) {
        currentUrl = `${savedPathName.replace('/Giphy/', '')}`
    }

    if (!history.state) {
        const savedHistoryState = JSON.parse(storage.getHistoryState())

        if (!savedHistoryState) {
            page.preparePageForNonUserInitiatedTransition(currentUrl)
            return
        }

        // User comes after refreshing some page -> take state from local storage
        history.replaceState(savedHistoryState, '', currentUrl)
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
        if (location.indexOf(urlToGifMethod) >= 0) {
            window.location = location.substring(0, location.indexOf(urlToGifMethod))
            return
        }
    }

    history.back()

    // Event 'onpopstate' doesn't happened -> manipulate page elements manually
    page.clearGifElements()
}