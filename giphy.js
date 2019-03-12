function memoizeSearch() {
    const generateKey = (searchPhrase, offset) => `${searchPhrase} : ${offset}`;
    const cachedResults = {};

    const mSearch = function (searchProperties) {
        const urlEncodedSearchPhrase = encodeURIComponent(searchProperties.searchPhrase);
        const queryString = `${searchProperties.endPoint}q=${urlEncodedSearchPhrase}&api_key=${searchProperties.apiKey}&limit=${searchProperties.limit}&offset=${searchProperties.offset}`;

        return new Promise(((resolve, reject) => {
            const key = generateKey(urlEncodedSearchPhrase, searchProperties.offset);
            const cachedResult = cachedResults[key];

            if (cachedResult) {
                console.log(`cached value for key = ${key}`);
                resolve(cachedResult);
            }

            const xhr = new XMLHttpRequest();
        
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cachedResults[key] = xhr.response;
                    resolve(xhr.response);
                } else {
                    const error = new Error(`Error... responce info:${xhr.status} ${xhr.statusText}`);
                    reject(error);
                }
            };
        
            xhr.open('GET', queryString, true);
            xhr.send();
        }));
    }

    return mSearch;
}

const search = memoizeSearch();