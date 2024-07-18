const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');

document.addEventListener('DOMContentLoaded', () => {
    // Overall stuff
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallData = testInfo["charCounts"];
    const overallTime = testInfo["time"];

    const overallWPM = calculateWPM(overallData["correctWordChars"], overallTime);
    const overallRaw = calculateWPM(overallData["allCorrectChars"], overallTime);
    const overallAcc = calculateAcc(overallData["allCorrectChars"], overallData["totalChars"]);

    wpmDiv.innerHTML = overallWPM;
    accDiv.innerHTML = overallAcc;

    // Graph stuff
    const brokenDown = testInfo["graphData"];

    const timeXValues = [];
    const rawYValues = [];
    const wpmYValues = [];

    Object.keys(brokenDown).forEach(key => {
      // "correctWordChars" : 0,
    // "allCorrectChars" : 0,
    // "totalChars"
        const info = brokenDown[key];
        const time = info["time"];
        const intervalTime = info["intervalTime"];

        timeXValues.push(key);
        console.log(calculateWPM(info["correctWordChars"], time))
        wpmYValues.push(calculateWPM(info["correctWordChars"], time));
        rawYValues.push(calculateWPM(info["allCorrectChars"], intervalTime));
    });

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


// for raw and wpm
function calculateWPM(charsTyped, time) {
  let multiplier = Math.floor(60000 / time);
  return Math.floor(charsTyped / 5) * multiplier;
}

// for accuracy
function calculateAcc(charsTyped, total) {
  return Math.floor(charsTyped / total * 100);
}