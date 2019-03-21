import {apiKey, endPoint, urlToSearchMethod} from "./routes.js"

export const defaultLimit = 5
export const defaultOffset = 0

function memoizeSearch () {
    const generateKey = (searchPhrase, offset) => `${searchPhrase} : ${offset}`
    const cachedResults = {}

    const mSearch = function ({searchPhrase, limit, offset}) {
        const queryString = `${endPoint}${urlToSearchMethod}${searchPhrase}&api_key=${apiKey}&limit=${limit}&offset=${offset}`

        const key = generateKey(searchPhrase, offset)
        const cachedResult = cachedResults[key]

        if (cachedResult) {
            console.log(`cached value for key = ${key}`)
            return Promise.resolve(cachedResult)
        }

        return new Promise((resolve) => {
            fetch(queryString)
                .then(response => response.json())
                .then(responseJSON => {
                    cachedResults[key] = responseJSON.data
                    resolve(responseJSON.data)
                })
                .catch(error => console.log(error))
        })
    }

    return mSearch
}

export const searchGifsByPhrase = memoizeSearch()

export function getGifById (id) {
    return new Promise((resolve) => {
        const queryString = `${endPoint}${id}?api_key=${apiKey}`

        fetch(queryString)
            .then(response => response.json())
            .then(responseJSON => resolve(responseJSON.data))
            .catch(error => console.log(error))
    })
}