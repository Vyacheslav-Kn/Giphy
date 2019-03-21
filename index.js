import {manageBrowserButtons, moveBackToSearchPage} from './manipulate-user-actions.js'
import {sendSearchRequest, tryToUnlockSearchButton} from './manipulate-page-elements.js'
import {getElement} from './helpers-and-routes.js'

export function initializePageListeners () {
    getElement("searchInput").addEventListener("input", tryToUnlockSearchButton)
    getElement("searchSubmit").addEventListener("click", sendSearchRequest)
    getElement("moveBackSubmit").addEventListener("click", moveBackToSearchPage)

    window.addEventListener("popstate", manageBrowserButtons)
    window.addEventListener("load", manageBrowserButtons)
}