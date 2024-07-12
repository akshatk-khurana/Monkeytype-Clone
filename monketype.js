const textDiv = document.querySelector('#text-div');

document.addEventListener('DOMContentLoaded', () => {
    const words = [];
    const cursor = [0, 0];

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

        constructTypingDisplay(words);
    })

    document.addEventListener('keydown', event => {
        if ('abcdefghijklmnopqrstuvwxyz '.includes(event.key) || event.key == "Space") {
            let currentElement = getElementBasedOnCursor(cursor);
            let typed = event.key == "Space" ? " " : event.key;

            if (typed === currentElement.innerHTML) {
                currentElement.style.color = "white";
            } else {
                currentElement.style.color = "red";
                if (currentElement.innerHTML === " ") {
                    currentElement.innerHTML = typed;
                }
            }

        } else if (event.key === "Backspace") {
            // pass
        }
    })

})

function constructTypingDisplay(words) {
    for (let i = 0; i < words.length; i++) {
        const wordElement = document.createElement("div");
        wordElement.className = "word-div";

        let word = words[i];
        for (let char of word) {
            const charElement = document.createElement("div");
            charElement.className = "char-div";
            charElement.innerHTML = char;

            wordElement.appendChild(charElement);
        }

        textDiv.appendChild(wordElement);
    }
}

function getElementBasedOnCursor(cursor) {
    const allWordDivs = textDiv.children;
    const thisWordDiv = allWordDivs[cursor[0]];

    const allCharDivs = thisWordDiv.children;
    const thisCharDiv = allCharDivs[cursor[1]];

    return thisCharDiv;
}