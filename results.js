const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallStats = calculateStats(testInfo);
    const brokenDown = testInfo["graphData"];

    const timeXValues = [];
    const rawYValues = [];
    const wpmYValues = [];

    Object.keys(brokenDown).forEach(key => {
        const info = brokenDown[key];
        console.log(info)

        const stats = calculateStats(info);

        timeXValues.push(key);
        rawYValues.push(stats["raw"])
        wpmYValues.push(stats["wpm"])
    });

    wpmDiv.innerHTML = overallStats["wpm"];
    accDiv.innerHTML = overallStats["acc"];

    new Chart("chart", {
        type: "line",
        data: {
          labels: timeXValues,
          datasets: [{
            data: rawYValues,
            borderColor: "red",
            fill: false
          },{
            data: wpmYValues,
            borderColor: "green",
            fill: false
          }]
        },
        options: {
          legend: {display: false}
        }
      });
      
      
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