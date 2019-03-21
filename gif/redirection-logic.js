import {addHistoryStateAndPathName} from "./manipulate-local-storage.js"
import {getRepositoryLocation} from "./browser-helpers.js"

export function redirect() {
    const {state} = history
    let pathName = location.pathname
    if (location.search) {
        pathName += location.search
    }
    addHistoryStateAndPathName(state, pathName)

    window.location = getRepositoryLocation()
}