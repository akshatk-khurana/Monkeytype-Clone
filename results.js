const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallStats = calculateStats(testInfo);

    wpmDiv.innerHTML = overallStats["wpm"];
    accDiv.innerHTML = overallStats["acc"];

    // code to process and display it
})

function calculateStats(data) {
    const timeMS = data["timeTaken"];
    const correctWordChars = data["charCounts"]["correctWordChars"];
    const allCorrectChars = data["charCounts"]["allCorrectChars"];
    const totalChars = data["charCounts"]["totalChars"];

    let multiplier = Math.floor(60000 / timeMS);
    let wpm = Math.floor(correctWordChars / 5) * multiplier;
    let raw = Math.floor(totalChars / 5) * multiplier;
    let acc = Math.floor(allCorrectChars / totalChars * 100);

    return {
        "wpm" : wpm,
        "raw" : raw,
        "acc" : acc,
    };
}