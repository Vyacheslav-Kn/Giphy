export const urlToSearchMethod = 'search?q='
export const urlToGifMethod = 'gif/'

const pageElements = {}

export function getElement (elementId) {
    if (pageElements[elementId]) {
        console.log(`element ${elementId} was already searched`)
        return pageElements[elementId]
    }
    pageElements[elementId] = window[elementId]

    return window[elementId]
}

export function setElementVisibility (elementId, value) {
    getElement(elementId).style.display = value
}