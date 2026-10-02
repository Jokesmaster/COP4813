const inventoryContainer = document.getElementById("inventoryContainer");
const jsonError = document.getElementById("jsonError");

fetch("inventory.json")
    .then(response => response.json())
    .then(inventory => {
        console.log(inventory);

        inventoryContainer.innerHTML =
            "<pre>" + JSON.stringify(inventory, null, 2) + "</pre>";
    })
    .catch(error => {
        console.error(error);
        jsonError.textContent = "Error loading inventory data.";
    });