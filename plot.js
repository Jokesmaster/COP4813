const plotForm = document.getElementById("plotForm");
const outputValues = document.getElementById("outputValues");
const plotError = document.getElementById("plotError");

plotForm.addEventListener("submit", function (event) {
    event.preventDefault();

    plotError.textContent = "";

    const amplitude = Number(document.getElementById("amplitude").value);
    const damping = Number(document.getElementById("damping").value);
    const frequency = Number(document.getElementById("frequency").value);
    const xMin = Number(document.getElementById("xMin").value);
    const xMax = Number(document.getElementById("xMax").value);
    const stepSize = Number(document.getElementById("stepSize").value);

    if (
        Number.isNaN(amplitude) ||
        Number.isNaN(damping) ||
        Number.isNaN(frequency) ||
        Number.isNaN(xMin) ||
        Number.isNaN(xMax) ||
        Number.isNaN(stepSize)
    ) {
        showPlotError("Please enter a valid number in every field.");
        return;
    }

    if (xMax <= xMin) {
        showPlotError("X Maximum must be greater than X Minimum.");
        return;
    }

    if (stepSize <= 0) {
        showPlotError("Step Size must be greater than zero.");
        return;
    }

    const pointCount = Math.floor((xMax - xMin) / stepSize) + 1;

    if (pointCount > 2000) {
        showPlotError(
            "That range creates too many points. Increase the step size or reduce the X range."
        );
        return;
    }

    const points = [];

    for (let x = xMin; x <= xMax + stepSize / 2; x += stepSize) {
        const y = calculateDampedOscillation(
            amplitude,
            damping,
            frequency,
            x
        );

        points.push([
            Number(x.toFixed(4)),
            Number(y.toFixed(4))
        ]);
    }

    displayValues(points);
    
    if (typeof Highcharts === "undefined") {
    showPlotError("The chart library failed to load. Please refresh the page.");
    return;
}

createChart(points);
    createChart(points);
});

function calculateDampedOscillation(amplitude, damping, frequency, x) {
    return amplitude * Math.exp(-damping * x) * Math.cos(frequency * x);
}

function displayValues(points) {
    let html = "<div class='calculated-values'>";

    for (const point of points) {
        html +=
            "<p>X = " +
            point[0] +
            " &nbsp;&nbsp; Y = " +
            point[1] +
            "</p>";
    }

    html += "</div>";

    outputValues.innerHTML = html;
}

function showPlotError(message) {
    plotError.textContent = message;
}
function createChart(points) {
    Highcharts.chart("chartContainer", {
        chart: {
            type: "line"
        },

        title: {
            text: "Damped Oscillation"
        },

        subtitle: {
            text: "y = A × e^(-bx) × cos(wx)"
        },

        xAxis: {
            title: {
                text: "X"
            }
        },

        yAxis: {
            title: {
                text: "Y"
            }
        },

        tooltip: {
            pointFormat: "X = {point.x}<br>Y = {point.y:.4f}"
        },

        series: [{
            name: "Damped Oscillation",
            data: points
        }],

        credits: {
            enabled: false
        }
    });
}