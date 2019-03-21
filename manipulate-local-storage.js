const historyStateKey = "historyState"
const pathNameKey = "pathName"

export function addHistoryStateAndPathName (state, path) {
    localStorage.setItem(historyStateKey, JSON.stringify(state))
    localStorage.setItem(pathNameKey, JSON.stringify(path))
}

export function clear () {
    localStorage.removeItem(historyStateKey)
    localStorage.removeItem(pathNameKey)
}

export function getHistoryState () {
    return JSON.parse(localStorage.getItem(historyStateKey))
}

export function getPathName () {
    return JSON.parse(localStorage.getItem(pathNameKey))
}