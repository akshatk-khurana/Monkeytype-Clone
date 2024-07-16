const textDiv = document.querySelector('#text-div');
const cursor = [0, 0];

let numberOfWords = 10;
let numberOfWordsWithSpaces = numberOfWords * 2 - 1;
let started = false;

// For calculating stats
let startTime;
let endTime;
const typingData = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchWordsAndSetup(numberOfWords);
    
    document.addEventListener('keydown', event => {        
        whenKeyPressed(event);
    })

})

setInterval(() => {
    if (started) {
        let currentTime = new Date().getTime();
        let characterCounts = countIncorrectAndCorrect();

        const currData = {
            "timeTaken" : currentTime - startTime,
            "charCounts" : characterCounts,
        }

        typingData[currData["timeTaken"]] = currData;
    }
}, 2000);

function whenKeyPressed(event) {
    const key = event.key;
    let move = true;

    if ('abcdefghijklmnopqrstuvwxyz '.includes(key) || key == "Space") {
        if (started == false) {
            started = true;
            startTime = new Date().getTime();
        }

        let currentElement = getElementBasedOnCursor(cursor);
        let typed = event.key == " " ? "&nbsp;" : event.key;

        if (typed === currentElement.innerHTML) {
            currentElement.classList.add("correct");
        } else {
            currentElement.classList.add("incorrect");

            // If space is pressed wrong
            if (currentElement.innerHTML === "&nbsp;") {
                move = false;
                
                const elementBeforeSpace = textDiv.children[cursor[0] - 1];
                let incorrectExtraCount = elementBeforeSpace.querySelectorAll(".extra").length;
                
                // Add additional characters
                if (incorrectExtraCount < 19) {
                    const charElement = document.createElement("div");
                    charElement.className = "char-div incorrect extra";
                    charElement.innerHTML = typed;    
                    elementBeforeSpace.appendChild(charElement);
                }
            }
        }

        const oldCursor = [cursor[0], cursor[1]];

        if (move) {
            updateBorder(cursor, false);
            moveCursor(cursor, numberOfWordsWithSpaces, false);
            updateBorder(cursor, true);
        }

        const updatedCurrentElement = getElementBasedOnCursor(cursor);
        const childrenCount = updatedCurrentElement.parentElement.children.length;

        let endOfTest = cursor[0] == numberOfWordsWithSpaces - 1 && cursor[1] == childrenCount - 1;
        let sameCursor = cursor[0] == oldCursor[0] && cursor[1] == oldCursor[1];
        if (endOfTest && sameCursor) {
            // if last character was entered correctly
            if (updatedCurrentElement.classList.contains("correct") || typed == "&nbsp;") {
                updateBorder(cursor, false);
                onTypeTestEnd();
            }
        }

    } else if (event.key === "Backspace") {
        moveCursor(cursor, numberOfWordsWithSpaces, true);
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

function moveCursor(cursor, numWords, back) {
    const parent = getElementBasedOnCursor(cursor).parentElement;
    const maxIndex = parent.children.length - 1;

    if (back) {
        // A temporary cursor variable
        const newCursor = [cursor[0], cursor[1]];

        if (newCursor[1] == 0) {
            if (newCursor[0] != 0) {
                newCursor[0]--;
                let max = getElementBasedOnCursor([newCursor[0], 0]).parentElement.children.length; 
                newCursor[1] = max - 1;
            }
        } else {
            newCursor[1]--;
        }

        const beforeElement = getElementBasedOnCursor(newCursor);
        
        if (anyIncorrectSoFar(cursor)) {
            updateBorder(cursor, false);
            if (beforeElement.classList.contains("extra")) {
                beforeElement.remove()
            } else {
                beforeElement.className = "char-div";
                cursor[0] = newCursor[0];
                cursor[1] = newCursor[1];
            }

            updateBorder(cursor, true);
        }
    } else {
        if (cursor[1] == maxIndex) {
            if (cursor[0] != numWords - 1) {
                cursor[0]++;
                cursor[1] = 0;
            }
        } else {
            cursor[1]++;
        }
    }
}

function anyIncorrectSoFar(cursor) {
    const wordDivs = textDiv.children;

    for (let i = 0; i <= cursor[0]; i++) {
        const charDivs = wordDivs[i].children;
        for (let j = 0; j < charDivs.length; j++) {
            if (charDivs[j].classList.contains("incorrect")) {
                return true;
            }
        }
    }
    return false;
}

function countIncorrectAndCorrect() {
    const wordDivs = textDiv.children;
    let count = {
            "correctWordChars" : 0,
            "allCorrectChars" : 0,
            "totalChars" : 0
        };

    for (let i = 0; i <= cursor[0]; i++) {
        const charDivs = wordDivs[i].children;
        let allCorrect = true;

        for (let j = 0; j < charDivs.length; j++) {
            const char = charDivs[j];

            let isIncorrect = char.classList.contains("incorrect");
            let isCorrect = char.classList.contains("correct");
            let isExtra = char.classList.contains("extra");

            if (isIncorrect) {
                allCorrect = false;
            } 
            
            if (isCorrect) {
                count["allCorrectChars"]++;
            }

            if ((isCorrect || isIncorrect) && !isExtra) {
                count["totalChars"]++;
            }
        }

        if (allCorrect) {
            count["correctWordChars"] += charDivs.length;
        } 
    }
    return count; 
}

function onTypeTestEnd() {
    endTime = new Date().getTime();
    const characterCounts = countIncorrectAndCorrect();

    const testData = {
        "timeTaken" : endTime - startTime,
        "wordCount" : numberOfWords,
        "charCounts" : characterCounts,
        "graphData" : typingData,
    }

    localStorage.setItem("testData", JSON.stringify(testData))

    setTimeout(() => {
        window.open("results.html");
    }, 200);
}

function fetchWordsAndSetup(number) {
    const words = [];
    let request = fetch(`http://127.0.0.1:5000/word-generation-api/${number}`, 
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
}