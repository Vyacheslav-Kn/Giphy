import * as search from '../Scripts/search.js'
import * as storage from '../Scripts/manipulate-local-storage.js'
import { getElement, setElementVisibility, urlToGifMethod, urlToSearchMethod } from '../Scripts/helpers-and-routes.js'
import { moveToGifPage } from '../Scripts/manipulate-user-actions.js'

export function tryToUnlockSearchButton (event) {
  const searchPhrase = event.currentTarget.value

  getElement('searchSubmit').disabled = !searchPhrase.length
}

export function insertGifOnPage (gif) {
  setElementVisibility('searchContainer', 'none')

  getElement('gifInfoImg').src = gif.images.original.url
  getElement('gifInfoDescription').innerText = `Gif info: ${gif.title} ${gif.import_datetime}`

  if (gif.user) {
    getElement('authorInfoImg').src = gif.user.avatar_url
    getElement('authorInfoDescription').innerText = `Author info: ${gif.user.display_name}`
    setElementVisibility('authorInfo', '')
  }

  setElementVisibility('gifContainer', '')
}

export function insertLoadedGifsOnPage (gifs) {
  const loadedGifsContainer = document.createElement('div')
  loadedGifsContainer.className = 'loadedGifsContainer'

  gifs.forEach(gif => {
    const gifLink = document.createElement('a')
    gifLink.className = 'gifLink'
    gifLink.onclick = () => moveToGifPage(gif)

    const gifImage = document.createElement('img')
    gifImage.src = gif.images.fixed_height_small.url

    gifLink.appendChild(gifImage)
    loadedGifsContainer.appendChild(gifLink)
  })

  getElement('results').appendChild(loadedGifsContainer)
}

export function insertLoadButtonOnPage ({ searchPhrase, limit, offset }) {
  const loadGifsButton = document.createElement('input')
  loadGifsButton.type = 'submit'
  loadGifsButton.value = 'load gifs'

  loadGifsButton.onclick = () => {
    offset += limit

    const newSearchState = history.state.searchState
    newSearchState.offset = offset
    history.replaceState({ searchState: newSearchState }, '', null)

    search.searchGifsByPhrase({ searchPhrase, offset, limit }).then(data => {
      insertLoadedGifsOnPage(data)
    })
      .catch(error => console.log(error))
  }

  getElement('controlButtons').appendChild(loadGifsButton)
}

export function clearSearchElements () {
  getElement('results').innerHTML = ''
  getElement('controlButtons').innerHTML = ''
  getElement('searchInput').value = ''
  getElement('searchSubmit').disabled = true
}

export function clearGifElements () {
  setElementVisibility('gifContainer', 'none')
  setElementVisibility('authorInfo', 'none')
  setElementVisibility('searchContainer', '')
}

export function sendSearchRequest () {
  const searchPhrase = encodeURIComponent(getElement('searchInput').value)
  const limit = 5
  const offset = 0

  const searchProperties = { searchPhrase, offset, limit }
  history.pushState({ searchState: searchProperties }, '', `${urlToSearchMethod}${searchPhrase}`)

  clearSearchElements()

  search.searchGifsByPhrase(searchProperties).then(data => {
    insertLoadedGifsOnPage(data)
    insertLoadButtonOnPage(searchProperties)
  })
    .catch(error => console.log(error))
}

function openNewSearchPage (currentUrl) {
  const searchPhrase = currentUrl.substring(currentUrl.indexOf(urlToSearchMethod) + urlToSearchMethod.length)
  const searchProperties = { searchPhrase, offset: 0, limit: 5 }
  history.replaceState({ searchState: searchProperties }, '', currentUrl)

  search.searchGifsByPhrase(searchProperties).then(data => {
    insertLoadedGifsOnPage(data)
    insertLoadButtonOnPage(searchProperties)
  })
    .catch(error => console.log(error))

  storage.clear()
}

function openNewGifPage (currentUrl) {
  const gifId = currentUrl.substring(currentUrl.indexOf(urlToGifMethod) + urlToGifMethod.length)
  history.replaceState({ isMovedFromMainPage: true, gifState: { gifId } }, '', currentUrl)

  search.getGifById(gifId).then(data => {
    insertGifOnPage(data)
  })
    .catch(error => console.log(error))

  storage.clear()
}

export function preparePageForNonUserInitiatedTransition (currentUrl) {
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
  clearSearchElements()
}

function openOldSearchPage (currentState) {
  const { searchState } = currentState
  const numberOfLoadGifsRequests = (searchState.offset / searchState.limit) + 1

  clearSearchElements()
  clearGifElements()

  for (let i = 0; i < numberOfLoadGifsRequests; i++) {
    searchState.offset = searchState.limit * i

    search.searchGifsByPhrase(searchState).then(data => {
      insertLoadedGifsOnPage(data)
    })
      .catch(error => console.log(error))
  }

  insertLoadButtonOnPage(searchState)
}

function openOldGifPage (currentState) {
  const { gifState } = currentState
  search.getGifById(gifState.gifId).then(data => {
    insertGifOnPage(data)
  })
    .catch(error => console.log(error))
}

export function preparePageForUserInitiatedTransition (currentState) {
  // User comes back to search page
  if (currentState.searchState) {
    openOldSearchPage(currentState)
  }

  // User comes back to gif page
  if (currentState.gifState) {
    openOldGifPage(currentState)
  }
}
