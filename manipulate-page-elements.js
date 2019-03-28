import * as ids from "./elements-ids.js"
import * as search from "./search.js"
import {getElement, hideElement, showElement} from "./html-helpers.js"
import {moveToGifPage} from "./manipulate-user-actions.js"

export function updateSearchButton (event) {
    const searchPhrase = event.currentTarget.value

    getElement(ids.searchSubmit).disabled = !searchPhrase.length
}

export function insertGif (gif) {
    hideElement(ids.searchContainer)

    getElement(ids.gifInfoImg).src = gif.images.original.url
    getElement(ids.gifInfoDescription).innerText = `Gif info: ${gif.title} ${gif.import_datetime}`

    if (gif.user) {
        getElement(ids.authorInfoImg).src = gif.user.avatar_url
        getElement(ids.authorInfoDescription).innerText = `Author info: ${gif.user.display_name}`
        showElement(ids.authorInfo)
    }

    showElement(ids.gifContainer)
}

export function insertLoadedGifs (gifs) {
    const loadedGifsContainer = document.createElement("div")
    loadedGifsContainer.className = "loadedGifsContainer"

    gifs.forEach(gif => {
        const gifLink = document.createElement("a")
        gifLink.className = "gifLink"
        gifLink.onclick = () => moveToGifPage(gif)

        const gifImage = document.createElement("img")
        gifImage.src = gif.images.fixed_height_small.url

        gifLink.appendChild(gifImage)
        loadedGifsContainer.appendChild(gifLink)
    })

    getElement(ids.results).appendChild(loadedGifsContainer)
}

export function insertLoadButton ({searchPhrase, limit, offset}) {
    const loadGifsButton = document.createElement("input")
    loadGifsButton.type = "submit"
    loadGifsButton.value = "load gifs"

    loadGifsButton.onclick = () => {
        offset += limit

        const newSearchState = history.state.searchState
        newSearchState.offset = offset
        history.replaceState({searchState: newSearchState}, "", null)

        search.searchGifsByPhrase({searchPhrase, offset, limit})
            .then(data => insertLoadedGifs(data))
            .catch(error => console.log(error))
    }

    getElement(ids.controlButtons).appendChild(loadGifsButton)
}

export function clearSearchElements () {
    getElement(ids.results).innerHTML = ""
    getElement(ids.controlButtons).innerHTML = ""
    getElement(ids.searchInput).value = ""
    getElement(ids.searchSubmit).disabled = true
}

export function clearGifElements () {
    hideElement(ids.gifContainer)
    hideElement(ids.authorInfo)
    showElement(ids.searchContainer)
}
