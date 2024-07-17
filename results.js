const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallStats = calculateStats(testInfo, true);
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
              min: -100,
              max: maxGraphY + 20,
            }
          }
        }
    });
})

function calculateStats(data, calculateAcc) {
    const time = data["timeTaken"];
    const intervalTime = data["intervalTime"];

    const correctWordChars = data["charCounts"]["correctWordChars"];
    const allCorrectChars = data["charCounts"]["allCorrectChars"];
    const totalChars = data["charCounts"]["totalChars"];

    let multiplierT = Math.floor(60000 / time);
    let multiplierIT = Math.floor(60000 / intervalTime);

    let wpm = Math.floor(correctWordChars / 5) * multiplierT;
    let raw = Math.floor(allCorrectChars / 5) * multiplierIT;

    let results = {
      "wpm" : wpm,
      "raw" : raw,
    };

    if (calculateAcc) {
      let acc = Math.floor(allCorrectChars / totalChars * 100);
      results["acc"] = acc;
    }

    return results;
}