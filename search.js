import {apiKey, endPoint, urlToSearchMethod} from "./configuration.js"

export const defaultLimit = 5
export const defaultOffset = 0

function generateQueryString ({searchPhrase, params}) {
    let queryString = `${endPoint}${urlToSearchMethod}${searchPhrase}`

    for (let key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            queryString += `&${key}=${params[key]}`
        }
    }

    return queryString
}

function memoizeSearch () {
    const generateKey = (searchPhrase, offset, limit) => `${searchPhrase} : ${offset} : ${limit}`
    const cachedResults = {}

    const mSearch = function ({searchPhrase, limit, offset}) {
        const params = {offset, limit, "api_key": apiKey};
        const queryString = generateQueryString({searchPhrase, params})

        const key = generateKey(searchPhrase, offset, limit)
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
