const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallStats = calculateStats(testInfo);
    const brokenDown = testInfo["graphData"];

    const timeXValues = [0];
    const rawYValues = [0];
    const wpmYValues = [0];

    Object.keys(brokenDown).forEach(key => {
        const info = brokenDown[key];

        const stats = calculateStats(info);

        timeXValues.push(key);
        rawYValues.push(stats["raw"])
        wpmYValues.push(stats["wpm"])
    });

    wpmDiv.innerHTML = overallStats["wpm"];
    accDiv.innerHTML = overallStats["acc"];

    let maxNum = Math.max(Math.max(...rawYValues), Math.max(...wpmYValues));
    let maxGraphY = 10 * Math.ceil(maxNum / 10);

    new Chart("chart", {
        type: "line",
        data: {
          labels: timeXValues,
          datasets: [
            {
              data: rawYValues,
              borderColor: "gray",
              fill: false
            },
            {
              data: wpmYValues,
              borderColor: "#e2b714",
              fill: false
            }
          ]
        },
        options: {
          plugins: {
            legend: {
                display: false,
            }
          },
          responsive: false,
          scales: {
            x: {
              display: false,
            },
            y: {
              title: {
                display: true,
                text: "Words per Minute",
                font: {
                  size: 15,
                  family: 'Roboto Mono',
                }
              },
              min: 0,
              max: maxGraphY,
            }
          }
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