const historyStateKey = 'historyState'
const pathNameKey = 'pathName'

export function addHistoryStateAndPathName (state, path) {
  localStorage.setItem(historyStateKey, state)
  localStorage.setItem(pathNameKey, path)
}

export function clear () {
  localStorage.removeItem(historyStateKey)
  localStorage.removeItem(pathNameKey)
}

export function getHistoryState () {
  localStorage.getItem(historyStateKey)
}

export function getPathName () {
  localStorage.getItem(pathNameKey)
}
