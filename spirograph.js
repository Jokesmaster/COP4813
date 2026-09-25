const form = document.getElementById("spirographForm");
const canvas = document.getElementById("spirographCanvas");
const ctx = canvas.getContext("2d");
const errorDisplay = document.getElementById("spirographError");

let animationId = null;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    errorDisplay.textContent = "";

    const R = Number(document.getElementById("outerRadius").value);
    const r = Number(document.getElementById("innerRadius").value);
    const O = Number(document.getElementById("offset").value);

    if (
        Number.isNaN(R) ||
        Number.isNaN(r) ||
        Number.isNaN(O)
    ) {
        showError("Please enter valid numbers for R, r, and O.");
        return;
    }

    if (R < 50 || R > 200) {
        showError("Outer Radius must be between 50 and 200.");
        return;
    }

    if (r < 10 || r > 100) {
        showError("Inner Radius must be between 10 and 100.");
        return;
    }

    if (O < 0 || O > 100) {
        showError("Pen Offset must be between 0 and 100.");
        return;
    }

    if (r >= R) {
        showError("Inner Radius must be smaller than Outer Radius.");
        return;
    }

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpirograph(R, r, O);
});

function drawSpirograph(R, r, O) {
    let t = 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let previousPoint = getPosition(t, R, r, O);

    function animate() {
        t += 0.02;

        const currentPoint = getPosition(t, R, r, O);

        ctx.beginPath();

        ctx.moveTo(
            centerX + previousPoint.x,
            centerY + previousPoint.y
        );

        ctx.lineTo(
            centerX + currentPoint.x,
            centerY + currentPoint.y
        );

        ctx.strokeStyle = getRandomColor();
        ctx.lineWidth = 1.5;
        ctx.stroke();

        previousPoint = currentPoint;

        if (t < Math.PI * 80) {
            animationId = requestAnimationFrame(animate);
        }
    }

    animate();
}

function getPosition(t, R, r, O) {
    const x =
        (R + r) * Math.cos(t) -
        (r + O) * Math.cos(((R + r) / r) * t);

    const y =
        (R + r) * Math.sin(t) -
        (r + O) * Math.sin(((R + r) / r) * t);

    return { x, y };
}

function getRandomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return `rgb(${red}, ${green}, ${blue})`;
}

function showError(message) {
    errorDisplay.textContent = message;
}