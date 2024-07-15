const wpmDiv = document.querySelector('#wpm');
const rawDiv = document.querySelector('#raw');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));

    const timeMS = testInfo["timeTaken"]
    const correctCount = testInfo["charCounts"]["inCorrectWords"]
    const totalCount = testInfo["charCounts"]["inCorrectWords"]

    let multiplier = Math.floor(60000 / timeMS);
    let wpm = Math.floor(correctCount / 5) * multiplier;
    let raw = Math.floor(totalCount / 5) * multiplier;

    wpmDiv.innerHTML = wpm;
    rawDiv.innerHTML = raw;

    // code to process and display it
})
