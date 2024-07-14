const textDiv = document.querySelector('#text-div');
const cursor = [0, 0];
let numberOfWords = 20;
let numberOfWordsWithSpaces = numberOfWords * 2 - 1;

document.addEventListener('DOMContentLoaded', () => {
    const words = [];
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
            if (i != wordsList.length - 1) {
                words.push(" ");
            }
        }
        
        constructTypingDisplay(words);
        updateBorder(cursor, true);
    })

    document.addEventListener('keydown', event => {
        whenKeyPressed(event);
    })

})

function whenKeyPressed(event) {
    const key = event.key;

    if ('abcdefghijklmnopqrstuvwxyz '.includes(key) || key == "Space") {
        let currentElement = getElementBasedOnCursor(cursor);
        let typed = event.key == " " ? "&nbsp;" : event.key;

        if (typed === currentElement.innerHTML) {
            currentElement.classList.add("correct");
        } else {
            currentElement.classList.add("incorrect")

            // If space is pressed wrong
            console.log(currentElement.parentElement);
            if (currentElement.innerHTML === "&nbsp;") {
                console.log("Hello")

                const charElement = document.createElement("div");
                charElement.className = "char-div incorrect";
                charElement.innerHTML = typed;

                getElementBasedOnCursor(cursor).parentElement.appendChild(charElement);
                moveCursor(cursor, numberOfWordsWithSpaces);
            }
        }

        updateBorder(cursor, false);
        moveCursor(cursor, numberOfWordsWithSpaces);
        updateBorder(cursor, true);

    } else if (event.key === "Backspace") {
        // pass
    }
}

function constructTypingDisplay(words) {
    for (let i = 0; i < words.length; i++) {
        const wordElement = document.createElement("div");
        wordElement.className = "word-div";

        let word = words[i];
        for (let char of word) {
            const charElement = document.createElement("div");
            charElement.className = "char-div";
            charElement.innerHTML = char == " " ? "&nbsp;" : char;

            wordElement.appendChild(charElement);
        }

        textDiv.appendChild(wordElement);
    }
}

function updateBorder(cursor, on) {
    const elementToChange = getElementBasedOnCursor(cursor);
    elementToChange.style.borderLeft = on ? "2px solid #e2b714" : "none";
}

function getElementBasedOnCursor(cursor) {
    const allWordDivs = textDiv.children;
    const thisWordDiv = allWordDivs[cursor[0]];

    const allCharDivs = thisWordDiv.children;
    const thisCharDiv = allCharDivs[cursor[1]];

    return thisCharDiv;
}

function moveCursor(cursor, numWords) {
    const parent = getElementBasedOnCursor(cursor).parentElement;
    const maxIndex = parent.children.length - 1;

    if (cursor[1] == maxIndex) {
        if (cursor[0] == numWords - 1) {
            console.log("End!");
        } else {
            cursor[0]++;
            cursor[1] = 0;
        }
    } else {
        cursor[1]++;
    }
}