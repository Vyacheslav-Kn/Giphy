function memoizeSearch() {
    const generateKey = (searchPhrase, offset) => `${searchPhrase} : ${offset}`;
    const cachedResults = {};

    const mSearch = function (searchProperties) {
        const urlEncodedSearchPhrase = encodeURIComponent(searchProperties.searchPhrase);
        const queryString = `${searchProperties.endPoint}q=${urlEncodedSearchPhrase}&api_key=${searchProperties.apiKey}&limit=${searchProperties.limit}&offset=${searchProperties.offset}`;

        return new Promise(((resolveFunc, rejectFunc) => {
            const key = generateKey(urlEncodedSearchPhrase, searchProperties.offset);
            const cachedResult = cachedResults[key];

            if (cachedResult) {
                console.log(`cached value for key = ${key}`);
                resolveFunc(cachedResult);
            }

            const xhr = new XMLHttpRequest();
        
            xhr.onload = function() {
                if (xhr.status === 200) {
                    cachedResults[key] = xhr.response;
                    resolveFunc(xhr.response);
                } else {
                    const error = new Error(`Error... responce info:${xhr.status} ${xhr.statusText}`);
                    rejectFunc(error);
                }
            };
        
            xhr.open('GET', queryString, true);
            xhr.send();
        }));
    }

    return mSearch;
}

const search = memoizeSearch();

function enableSubmitButton(event) {
    const searchPhrase = event.currentTarget.value;

    if (searchPhrase.length) {
        document.getElementById("searchSubmit").disabled = false;
    } else {
        document.getElementById("searchSubmit").disabled = true;
    }
}

function moveToGifPage(gif) {
    // history.pushState({}, "", `/gif/${gif.id}`);
    document.getElementById("searchContainer").style.display = "none";

    document.getElementById("gifInfoImg").setAttribute("src", gif.images.original.url);        
    document.getElementById("gifInfoDescription").innerText = `Gif info: ${gif.title} ${gif.import_datetime}`;

    if (gif.user) {
        document.getElementById("authorInfoImg").setAttribute("src", gif.user.avatar_url);
        document.getElementById("authorInfoDescription").innerText = `Author info: ${gif.user.display_name}`;
        document.getElementById("authorInfo").style.display = "";
    }

    document.getElementById("singleGif").style.display = "";
}

function insertGifsOnPage(gifs) {
    const gifsPartContainer = document.createElement("div");
    gifsPartContainer.className = "gifsResultContainer";

    gifs.forEach(element => {
        const gifLink = document.createElement("a");
        gifLink.className = "gifLink";
        gifLink.onclick = () => moveToGifPage(element);

        const gifImage = document.createElement("img");
        gifImage.src = element.images.fixed_height_small.url;

        gifLink.appendChild(gifImage);
        gifsPartContainer.appendChild(gifLink);
    });

    document.getElementById("results").appendChild(gifsPartContainer);
}

function insertUploadButtonOnPage(searchProperties) {
    const uploadGifsButton = document.createElement("input");
    uploadGifsButton.type = "submit";
    uploadGifsButton.value = "upload gifs";

    uploadGifsButton.onclick = () => {
        searchProperties.offset += searchProperties.limit; 
        search(searchProperties).then(response => insertGifsOnPage(JSON.parse(response).data), error => console.log(error));
    }

    document.getElementById("controlButtons").appendChild(uploadGifsButton);
}

// eslint-disable-next-line max-statements
function sendSearchRequest() {
    // history.pushState({}, "", `/search?q=${searchPhrase}`);

    document.getElementById("results").innerHTML = "";
    document.getElementById("controlButtons").innerHTML = "";

    const searchPhrase = document.getElementById("searchInput").value;
    document.getElementById("searchInput").value = "";
    document.getElementById("searchSubmit").disabled = true; 

    const apiKey = "hBZX9D1GD3KQfZ5jwDWAyEYsqnQIIEIJ";
    const endPoint = "https://api.giphy.com/v1/gifs/search?";
    const limit = 5;
    const offset = 0;

    const searchProperties = {searchPhrase, offset, limit, endPoint, apiKey};

    search(searchProperties).then(response => {
        insertGifsOnPage(JSON.parse(response).data); 
        insertUploadButtonOnPage(searchProperties);
    }, error => console.log(error));
}

function moveBackToSearchPage() {
    // window.history.back();
    document.getElementById("singleGif").style.display = "none";
    document.getElementById("authorInfo").style.display = "none";
    document.getElementById("searchContainer").style.display = "";
}