const questions = [
    {
        problem: "A user cannot connect to the internet, but other computers in the room are online.",
        choices: [
            "Replace the monitor",
            "Check the Ethernet cable and network adapter",
            "Reinstall Microsoft Word",
            "Clear the printer queue"
        ],
        answer: 1,
        explanation: "Checking the physical network connection and adapter is a good first troubleshooting step."
    },
    {
        problem: "A printer is stuck with several documents waiting to print.",
        choices: [
            "Restart the print spooler",
            "Replace the keyboard",
            "Change the desktop wallpaper",
            "Disable Wi-Fi"
        ],
        answer: 0,
        explanation: "Restarting the print spooler can clear stuck print jobs."
    },
    {
        problem: "A computer powers on but has no network connection after someone moved the desk.",
        choices: [
            "Check the Ethernet cable",
            "Replace the CPU",
            "Install a new browser",
            "Format the hard drive"
        ],
        answer: 0,
        explanation: "A loose or disconnected Ethernet cable is one of the first things to check."
    },
    {
        problem: "A user says their computer is extremely slow after opening many programs.",
        choices: [
            "Check Task Manager and close unnecessary programs",
            "Replace the monitor",
            "Change the keyboard",
            "Turn off the printer"
        ],
        answer: 0,
        explanation: "Task Manager can help identify programs using excessive CPU or memory."
    },
    {
        problem: "A user cannot hear audio from their computer.",
        choices: [
            "Check the volume, output device, and speaker connection",
            "Replace the hard drive",
            "Restart the print spooler",
            "Change the IP address"
        ],
        answer: 0,
        explanation: "The first step should be checking the volume, selected output device, and physical audio connection."
    },
    {
        problem: "A computer displays a message that storage space is almost full.",
        choices: [
            "Delete unnecessary files and check disk usage",
            "Replace the mouse",
            "Disable Bluetooth",
            "Restart the router"
        ],
        answer: 0,
        explanation: "Checking disk usage and removing unnecessary files is the appropriate first step."
    },
    {
        problem: "A wireless user suddenly loses connection while everyone using Ethernet is still online.",
        choices: [
            "Check Wi-Fi status and reconnect to the wireless network",
            "Replace the monitor cable",
            "Clear the printer queue",
            "Uninstall the keyboard driver"
        ],
        answer: 0,
        explanation: "The issue is likely related to the wireless connection, so Wi-Fi status should be checked first."
    },
    {
        problem: "A program stops responding and will not close normally.",
        choices: [
            "Use Task Manager to end the task",
            "Replace the computer",
            "Change the network cable",
            "Reset the printer"
        ],
        answer: 0,
        explanation: "Task Manager can force a frozen application to close."
    },
    {
        problem: "A user cannot print, and the printer shows as offline.",
        choices: [
            "Check printer power, connection, and status",
            "Replace the computer RAM",
            "Change the desktop wallpaper",
            "Disable the firewall"
        ],
        answer: 0,
        explanation: "Printer power, connectivity, and status should be checked before making larger changes."
    },
    {
        problem: "A website will not load on one computer, but it loads normally on another.",
        choices: [
            "Check the browser, network connection, and try refreshing",
            "Replace the monitor",
            "Install a new printer",
            "Remove the keyboard"
        ],
        answer: 0,
        explanation: "Start by checking the browser and network connection before assuming a hardware failure."
    }
];

const scoreDisplay = document.getElementById("score");
const questionNumberDisplay = document.getElementById("questionNumber");
const streakDisplay = document.getElementById("streak");

const questionText = document.getElementById("questionText");
const answerContainer = document.getElementById("answerContainer");
const feedback = document.getElementById("feedback");

const startButton = document.getElementById("startButton");
const nextButton = document.getElementById("nextButton");
const restartButton = document.getElementById("restartButton");

const resultsSection = document.getElementById("resultsSection");
const finalScore = document.getElementById("finalScore");
const correctAnswersDisplay = document.getElementById("correctAnswers");
const incorrectAnswersDisplay = document.getElementById("incorrectAnswers");
const playerRank = document.getElementById("playerRank");

let currentQuestion = 0;
let score = 0;
let streak = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

function startGame() {
    currentQuestion = 0;
    score = 0;
    streak = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;

    resultsSection.hidden = true;
    restartButton.hidden = true;
    nextButton.hidden = true;
    startButton.hidden = true;

    updateScoreboard();
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];

    questionText.textContent = question.problem;
    answerContainer.innerHTML = "";

    questionNumberDisplay.textContent =
        `${currentQuestion + 1} / ${questions.length}`;

    feedback.textContent = "";
    feedback.className = "feedback";

    question.choices.forEach(function (choice, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.classList.add("answer-button");
        button.textContent = choice;

        button.addEventListener("click", function () {
            checkAnswer(index, button);
        });

        answerContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex, selectedButton) {
    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll(".answer-button");

    buttons.forEach(function (button) {
        button.disabled = true;
    });

    if (selectedIndex === question.answer) {
        score += 100;
        streak++;
        correctAnswers++;

        selectedButton.classList.add("correct");

        feedback.textContent =
            `Correct! ${question.explanation}`;

        feedback.className =
            "feedback correct-feedback";
    } else {
        streak = 0;
        incorrectAnswers++;

        selectedButton.classList.add("incorrect");

        buttons[question.answer].classList.add("correct");

        feedback.textContent =
            `Incorrect. ${question.explanation}`;

        feedback.className =
            "feedback incorrect-feedback";
    }

    updateScoreboard();

    nextButton.hidden = false;
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        nextButton.hidden = true;
        showQuestion();
    } else {
        endGame();
    }
}

function endGame() {
    answerContainer.innerHTML = "";

    questionText.textContent =
        "You completed all 10 troubleshooting scenarios.";

    feedback.textContent = "";
    feedback.className = "feedback";

    nextButton.hidden = true;

    finalScore.textContent = score;
    correctAnswersDisplay.textContent = correctAnswers;
    incorrectAnswersDisplay.textContent = incorrectAnswers;

    if (score >= 900) {
        playerRank.textContent = "IT Expert";
    } else if (score >= 700) {
        playerRank.textContent = "Advanced Technician";
    } else if (score >= 400) {
        playerRank.textContent = "Technician";
    } else {
        playerRank.textContent = "Beginner";
    }

    resultsSection.hidden = false;
    restartButton.hidden = false;
}

function updateScoreboard() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
}

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", startGame);