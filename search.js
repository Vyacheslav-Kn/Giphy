function memoizeSearch () {
    const generateKey = (searchPhrase, offset) => `${searchPhrase} : ${offset}`
    const cachedResults = {}

    const mSearch = function ({searchPhrase, limit, offset}) {
        const apiKey = 'hBZX9D1GD3KQfZ5jwDWAyEYsqnQIIEIJ'
        const endPoint = 'https://api.giphy.com/v1/gifs/search?'

        const queryString = `${endPoint}q=${searchPhrase}&api_key=${apiKey}&limit=${limit}&offset=${offset}`

        return new Promise((resolve) => {
            const key = generateKey(searchPhrase, offset)
            const cachedResult = cachedResults[key]

            if (cachedResult) {
                console.log(`cached value for key = ${key}`)
                resolve(cachedResult)
            }

            fetch(queryString).then(response => response.json()).
                then(responseJSON => {
                    cachedResults[key] = responseJSON.data
                    resolve(responseJSON.data)
                }).
                catch(error => console.log(error))
        })
    }

    return mSearch
}

export const searchGifsByPhrase = memoizeSearch()

export function getGifById (id) {
    return new Promise((resolve) => {
        const apiKey = 'hBZX9D1GD3KQfZ5jwDWAyEYsqnQIIEIJ'
        const endPoint = 'https://api.giphy.com/v1/gifs/'

        const queryString = `${endPoint}${id}?api_key=${apiKey}`

        fetch(queryString).then(response => response.json()).
            then(responseJSON => {
                resolve(responseJSON.data)
            }).
            catch(error => console.log(error))
    })
}