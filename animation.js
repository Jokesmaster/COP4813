const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");

const message = document.getElementById("animationMessage");

// Ball properties
let ball = {
    x: 100,
    y: 100,
    radius: 50,

    dx: 2.3,
    dy: 2.0,

    color: "#22d3ee"
};

// Explosion particles
let particles = [];

// Colors the ball can randomly change to
const colors = [
    "#22d3ee",
    "#a855f7",
    "#f43f5e",
    "#22c55e",
    "#f59e0b",
    "#3b82f6",
    "#ec4899"
];

function drawBall() {
    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = ball.color;

    ctx.shadowColor = ball.color;
    ctx.shadowBlur = 25;

    ctx.fill();

    ctx.closePath();

    // Reset shadow
    ctx.shadowBlur = 0;
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce off left and right walls
    if (
        ball.x + ball.radius >= canvas.width ||
        ball.x - ball.radius <= 0
    ) {
        ball.dx = -ball.dx;
    }

    // Bounce off top and bottom walls
    if (
        ball.y + ball.radius >= canvas.height ||
        ball.y - ball.radius <= 0
    ) {
        ball.dy = -ball.dy;
    }
}

function createExplosion() {
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: ball.x,
            y: ball.y,

            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 0.5) * 10,

            radius: Math.random() * 5 + 2,

            life: 40,

            color: ball.color
        });
    }
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        particle.x += particle.dx;
        particle.y += particle.dy;

        particle.life--;

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = particle.color;

        ctx.fill();

        ctx.closePath();

        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function animate() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    updateBall();

    drawBall();

    drawParticles();

    requestAnimationFrame(animate);
}

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX =
        (event.clientX - rect.left) * scaleX;

    const mouseY =
        (event.clientY - rect.top) * scaleY;

    const distance = Math.sqrt(
        Math.pow(mouseX - ball.x, 2) +
        Math.pow(mouseY - ball.y, 2)
    );

    // Make the clickable area slightly larger than the visible ball
    const hitboxRadius = ball.radius + 25;

    if (distance <= hitboxRadius) {
        // Reverse direction
        ball.dx = -ball.dx;
        ball.dy = -ball.dy;

        // Pick a random color
        const randomColor =
            colors[Math.floor(Math.random() * colors.length)];

        ball.color = randomColor;

        // Explosion effect
        createExplosion();

        // Visible event confirmation
        message.textContent =
            "Ball clicked! Direction changed and explosion triggered!";
    }
});

animate();