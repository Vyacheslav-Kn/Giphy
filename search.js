function memoizeSearch () {
    const generateKey = (searchPhrase, offset) => `${searchPhrase} : ${offset}`
    const cachedResults = {}

    const mSearch = function ({searchPhrase, limit, offset}) {
        const apiKey = 'hBZX9D1GD3KQfZ5jwDWAyEYsqnQIIEIJ'
        const endPoint = 'https://api.giphy.com/v1/gifs/search?'

        const queryString = `${endPoint}q=${searchPhrase}&api_key=${apiKey}&limit=${limit}&offset=${offset}`

        return new Promise((resolve, reject) => {
            const key = generateKey(searchPhrase, offset)
            const cachedResult = cachedResults[key]

            if (cachedResult) {
                console.log(`cached value for key = ${key}`)
                resolve(cachedResult)
            }

            const xhr = new XMLHttpRequest()

            xhr.onload = function () {
                if (xhr.status === 200) {
                    cachedResults[key] = xhr.response
                    resolve(xhr.response)
                } else {
                    const error = new Error(`Error... response info:${xhr.status} ${xhr.statusText}`)
                    reject(error)
                }
            }

            xhr.open('GET', queryString, true)
            xhr.send()
        })
    }

    return mSearch
}

export const searchGifsByPhrase = memoizeSearch()

export function getGifById (id) {
    return new Promise((resolve, reject) => {
        const apiKey = 'hBZX9D1GD3KQfZ5jwDWAyEYsqnQIIEIJ'
        const endPoint = 'https://api.giphy.com/v1/gifs/'

        const queryString = `${endPoint}${id}?api_key=${apiKey}`

        const xhr = new XMLHttpRequest()

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                const error = new Error(`Error... responce info:${xhr.status} ${xhr.statusText}`)
                reject(error)
            }
        }

        xhr.open('GET', queryString, true)
        xhr.send()
    })
}