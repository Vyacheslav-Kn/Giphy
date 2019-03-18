const pageElements = {}

export function getPageElement (elementId) {
    if (pageElements[elementId]) {
        console.log(`element ${elementId} was already searched`)
        return pageElements[elementId]
    }
    pageElements[elementId] = window.elementId

    return window.elementId
}