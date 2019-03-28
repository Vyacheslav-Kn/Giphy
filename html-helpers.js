const pageElements = {}

export function getElement (elementId) {
    if (pageElements[elementId]) {
        console.log(`element ${elementId} was already searched`)
        return pageElements[elementId]
    }
    pageElements[elementId] = window[elementId]

    return window[elementId]
}

export function hideElement (elementId) {
    getElement(elementId).style.display = "none"
}

export function showElement (elementId) {
    getElement(elementId).style.display = ""
}
