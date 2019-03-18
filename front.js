import {searchGifsByPhrase} from './search'

export function unlockSearchButton (event) {
    const searchPhrase = event.currentTarget.value

    if (searchPhrase.length) {
        document.getElementById('searchSubmit').disabled = false
    } else {
        document.getElementById('searchSubmit').disabled = true
    }
}

function insertGifOnPage (gif) {
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

function moveToGifPage (gif) {
    const gifState = {gifId: gif.id}
    history.pushState({gifState}, '', `gif/${gif.id}`)

    insertGifOnPage(gif)
}

function insertLoadedGifsOnPage (gifs) {
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

function insertLoadButtonOnPage ({searchPhrase, limit, offset}) {
    const loadGifsButton = document.createElement('input')
    loadGifsButton.type = 'submit'
    loadGifsButton.value = 'load gifs'

    loadGifsButton.onclick = () => {
        offset += limit

        const newSearchState = history.state.searchState
        newSearchState.offset = offset
        history.replaceState({searchState: newSearchState}, '', null)

        searchGifsByPhrase({searchPhrase, offset, limit}).then(response => insertLoadedGifsOnPage(JSON.parse(response).data), error => console.log(error))
    }

    document.getElementById('controlButtons').appendChild(loadGifsButton)
}

function clearSearchElements () {
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
    if (history.state.isMovedFromMainPage) {
        window.location = 'https://vyacheslav-kn.github.io/Giphy/'
        return
    }

    history.back()
    document.getElementById('gifContainer').style.display = 'none'
    document.getElementById('authorInfo').style.display = 'none'

    document.getElementById('searchContainer').style.display = ''
}