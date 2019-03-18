import {searchGifsByPhrase} from './search.js'

export function tryToUnlockSearchButton (event) {
    const searchPhrase = event.currentTarget.value

    document.getElementById('searchSubmit').disabled = Boolean(searchPhrase.length)
}

export function insertGifOnPage (gif) {
    document.getElementById('searchContainer').style.display = 'none'

    document.getElementById('gifInfoImg').src = gif.images.original.url
    document.getElementById('gifInfoDescription').innerText = `Gif info: ${gif.title} ${gif.import_datetime}`

    if (gif.user) {
        document.getElementById('authorInfoImg').src = gif.user.avatar_url
        document.getElementById('authorInfoDescription').innerText = `Author info: ${gif.user.display_name}`
        document.getElementById('authorInfo').style.display = ''
    }

    document.getElementById('gifContainer').style.display = ''
}

export function moveToGifPage (gif) {
    const gifState = {gifId: gif.id}
    history.pushState({gifState}, '', `gif/${gif.id}`)

    insertGifOnPage(gif)
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

    document.getElementById('results').appendChild(loadedGifsContainer)
}

export function insertLoadButtonOnPage ({searchPhrase, limit, offset}) {
    const loadGifsButton = document.createElement('input')
    loadGifsButton.type = 'submit'
    loadGifsButton.value = 'load gifs'

    loadGifsButton.onclick = () => {
        offset += limit

        const newSearchState = history.state.searchState
        newSearchState.offset = offset
        history.replaceState({searchState: newSearchState}, '', null)

        searchGifsByPhrase({searchPhrase, offset, limit}).then(response => {
            insertLoadedGifsOnPage(JSON.parse(response).data)
        }, error => console.log(error))
    }

    document.getElementById('controlButtons').appendChild(loadGifsButton)
}

export function clearSearchElements () {
    document.getElementById('results').innerHTML = ''
    document.getElementById('controlButtons').innerHTML = ''

    document.getElementById('searchInput').value = ''
    document.getElementById('searchSubmit').disabled = true
}

export function sendSearchRequest () {
    const searchPhrase = encodeURIComponent(document.getElementById('searchInput').value)
    const limit = 5
    const offset = 0

    const searchProperties = {searchPhrase, offset, limit}
    history.pushState({searchState: searchProperties}, '', `search?q=${searchPhrase}`)

    clearSearchElements()

    searchGifsByPhrase(searchProperties).then(response => {
        insertLoadedGifsOnPage(JSON.parse(response).data)
        insertLoadButtonOnPage(searchProperties)
    }, error => console.log(error))
}

export function moveBackToSearchPage () {
    const urlToGifMethod = 'gif/'
    if (history.state.isMovedFromMainPage) {
        if (window.location.indexOf(urlToGifMethod) >= 0) {
            window.location = window.location.substring(0, window.location.indexOf(urlToGifMethod))
            return
        }       
    }

    history.back()
    document.getElementById('gifContainer').style.display = 'none'
    document.getElementById('authorInfo').style.display = 'none'

    document.getElementById('searchContainer').style.display = ''
}