import {manageBrowserButtons, moveBackToSearchPage} from './manipulate-user-actions'
import {sendSearchRequest, tryToUnlockSearchButton} from './manipulate-page-elements.js'
import {getElement} from './helpers-and-routes.js'

function initializePageListeners () {
    getElement("searchInput").addEventListener("oninput", tryToUnlockSearchButton)
    getElement("searchSubmit").addEventListener("onclick", sendSearchRequest)
    getElement("moveBackSubmit").addEventListener("onclick", moveBackToSearchPage)
  
    window.addEventListener("onpopstate", manageBrowserButtons)
    window.addEventListener("onload", manageBrowserButtons)
}