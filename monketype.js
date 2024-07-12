const textDiv = document.querySelector('#text-div');

document.addEventListener('DOMContentLoaded', () => {
    const words = [];

    let numberOfWords = 20;
    let request = fetch(`http://127.0.0.1:5000/word-generation-api/${numberOfWords}`, 
        {
            mode: "cors",
            method: "GET",
            headers: {
                Accept: 'application/json',
            }
        })
    
    request.then(response => response.json())
    .then((response) => {
        let wordsList = response["words"];
        for (let i = 0; i < wordsList.length; i++) {
            words.push(wordsList[i]);
        }
    })

    document.addEventListener('keydown', event => {
        if ('abcdefghijklmnopqrstuvwxyz '.includes(event.key) || event.key == "Space") {
            let typed = event.key == "Space" ? " " : event.key;

        } else if (event.key === "Backspace") {
            
        }
    })

})