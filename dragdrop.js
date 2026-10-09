const dragCar = document.getElementById("dragCar");
const garage = document.getElementById("garage");
const dropMessage = document.getElementById("dropMessage");

dragCar.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", "dragCar");

    dropMessage.textContent =
        "The car is being moved. Drop it into the garage!";
});

garage.addEventListener("dragover", function (event) {
    event.preventDefault();

    garage.classList.add("garage-hover");
});

garage.addEventListener("dragleave", function () {
    garage.classList.remove("garage-hover");
});

garage.addEventListener("drop", function (event) {
    event.preventDefault();

    garage.classList.remove("garage-hover");

    const draggedItem = event.dataTransfer.getData("text/plain");

    if (draggedItem === "dragCar") {
        garage.appendChild(dragCar);

        dragCar.classList.add("parked-car");

        dropMessage.textContent =
            "Success! The car was dropped into the garage.";

        garage.classList.add("garage-success");
    }
});