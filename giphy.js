function Search(searchProperties){
    const urlEncodedSearchPhrase = encodeURIComponent(searchProperties.searchPhrase);
    const queryString = `${searchProperties.endPoint}q=${urlEncodedSearchPhrase}&api_key=${searchProperties.apiKey}&limit=${searchProperties.limit}`;

    return new Promise(((resolve, reject) => {
        const xhr = new XMLHttpRequest();
    
        xhr.onload = function() {
            if (xhr.status === 200) {
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