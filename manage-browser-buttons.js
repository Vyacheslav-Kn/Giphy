import * as front from 'front.js'
import {searchGifById, searchGifsByPhrase} from 'search.js'

// eslint-disable-next-line max-statements
function preparePageWhenUserComesByReference (currentUrl) {
    const urlToSearchMethod = 'search?q='
    const urlToGifMethod = 'gif/'

    // Search page reference
    if (currentUrl.indexOf(urlToSearchMethod) >= 0) {
        const searchPhrase = currentUrl.substring(currentUrl.indexOf(urlToSearchMethod) + urlToSearchMethod.length)
        const searchProperties = {searchPhrase, offset: 0, limit: 5}
        history.replaceState({searchState: searchProperties}, '', currentUrl)

        searchGifsByPhrase(searchProperties).then(response => {
            front.insertLoadedGifsOnPage(JSON.parse(response).data)
            front.insertLoadButtonOnPage(searchProperties)
        }, error => console.log(error))
        localStorage.removeItem('historyState')
        localStorage.removeItem('pathName')
        return
    }

    // Gif page reference
    if (currentUrl.indexOf(urlToGifMethod) >= 0) {
        const gifId = currentUrl.substring(currentUrl.indexOf(urlToGifMethod) + urlToGifMethod.length)
        history.replaceState({isMovedFromMainPage: true, gifState: {gifId}}, '', currentUrl)

        searchGifById(gifId).then(response => {
            front.insertGifOnPage(JSON.parse(response).data)
        }, error => console.log(error))
        localStorage.removeItem('historyState')
        localStorage.removeItem('pathName')
        return
    }

    // Main page reference
    front.clearSearchElements()
}

// eslint-disable-next-line max-statements
function preparePageWhenUserComesByPressingBrowserButtons (currentState) {
    // User comes to search page
    if (currentState.searchState) {
        const {searchState} = currentState
        const numberOfLoadGifsRequests = (searchState.offset / searchState.limit) + 1

        document.getElementById('results').innerHTML = ''
        document.getElementById('controlButtons').innerHTML = ''

        for (let i = 0; i < numberOfLoadGifsRequests; i++) {
            searchState.offset = searchState.limit * i

            searchGifsByPhrase(searchState).then(response => {
                front.insertLoadedGifsOnPage(JSON.parse(response).data)
            }, error => console.log(error))
        }

        front.insertLoadButtonOnPage(searchState)

        document.getElementById('singleGif').style.display = 'none'
        document.getElementById('authorInfo').style.display = 'none'
        document.getElementById('searchContainer').style.display = ''
    }

    // User comes to gif page
    if (currentState.gifState) {
        const {gifState} = currentState
        searchGifById(gifState.gifId).then(response => {
            front.insertGifOnPage(JSON.parse(response).data)
        }, error => console.log(error))
    }
}

// eslint-disable-next-line max-statements
export function manageBrowserButtons () {
    let currentState = history.state
    let currentUrl = window.location.href 
    if (localStorage.getItem('pathName') !== null) {
        currentUrl = `${JSON.parse(localStorage.getItem('pathName')).replace('/Giphy/', '')}`;
    } 

    if (history.state === null) {
        if (JSON.parse(localStorage.getItem('historyState')) === null) {
            preparePageWhenUserComesByReference(currentUrl)
            return
        }

        // User comes after refreshing some page -> take state from local storage
        currentState = JSON.parse(localStorage.getItem('historyState'))
        history.replaceState(currentState, '', currentUrl)
        localStorage.removeItem('historyState')
        localStorage.removeItem('pathName')
    }

    preparePageWhenUserComesByPressingBrowserButtons(currentState)
}