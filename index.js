import * as ids from "./elements-ids.js"
import {manageBrowserButtons, moveBackToSearchPage, sendSearchRequest} from "./manipulate-user-actions.js"
import {getElement} from "./html-helpers.js"
import {updateSearchButton} from "./manipulate-page-elements.js"

export function initializePageListeners () {
    getElement(ids.searchInput).addEventListener("input", updateSearchButton)
    getElement(ids.searchSubmit).addEventListener("click", sendSearchRequest)
    getElement(ids.moveBackSubmit).addEventListener("click", moveBackToSearchPage)

    window.addEventListener("popstate", manageBrowserButtons)
    window.addEventListener("load", manageBrowserButtons)
}
