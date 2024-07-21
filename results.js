const wpmDiv = document.querySelector('#wpm');
const accDiv = document.querySelector('#acc');
const rawDiv = document.querySelector('#raw');
const charDiv = document.querySelector('#characters');
const timeDiv = document.querySelector('#time');

document.addEventListener('DOMContentLoaded', () => {
    const testInfo = JSON.parse(localStorage.getItem("testData"));
    const overallData = testInfo["charCounts"];

    const correctWordChars = overallData["correctWordChars"];
    const allCorrectChars = overallData["allCorrectChars"];
    const totalChars = overallData["totalChars"];
    const extraChars = overallData["extraChars"];
    const overallTime = testInfo["time"];

    const overallWPM = calculateWPM(correctWordChars, overallTime);
    const overallRaw = calculateWPM(allCorrectChars, overallTime);
    const overallAcc = calculateAcc(allCorrectChars, totalChars);

    wpmDiv.innerHTML = overallWPM;
    accDiv.innerHTML = overallAcc;
    timeDiv.innerHTML = `${Math.round(overallTime / 1000)}s`;
    rawDiv.innerHTML = overallRaw;
    charDiv.innerHTML = `${allCorrectChars}/${totalChars - allCorrectChars}/${extraChars}`;

    const brokenDown = testInfo["graphData"];
    const timeXValues = [];
    const wpmYValues = [];

    Object.keys(brokenDown).forEach(key => {
      if (key != 0) {
        const info = brokenDown[key];
        const counts = info["charCounts"];

        timeXValues.push(key);
        wpmYValues.push(
          calculateWPM(counts["correctWordChars"], info["time"])
        );
      }
    });

    console.log(wpmYValues);

    new Chart("chart", {
        type: "line",
        data: {
          labels: timeXValues,
          datasets: [
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
              display: true,
              min: 0,
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
              max: 200,
              ticks: {
                callback: function(val, index) {
                  return val % 40 == 0 ? val : '';
                },      
              }
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