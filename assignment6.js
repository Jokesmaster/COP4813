// Assignment 6 JSON LOADER
const inventoryContainer = document.getElementById("inventoryContainer");
const jsonError = document.getElementById("jsonError");

fetch("inventory.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Unable to load inventory.json");
        }

        return response.json();
    })
    .then(function (inventory) {
        displayInventory(inventory);
    })
    .catch(function (error) {
        console.error(error);

        jsonError.textContent =
            "The inventory data could not be loaded.";

        inventoryContainer.innerHTML = "";
    });

function displayInventory(inventory) {
    let html = `
        <div class="table-container">
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Weapon</th>
                        <th>Skin</th>
                        <th>Condition</th>
                        <th>StatTrak</th>
                        <th>Float</th>
                        <th>Paint Seed</th>
                    </tr>
                </thead>
                <tbody>
    `;

    for (const item of inventory) {
        const condition = item.condition || "Not Listed";
        const stattrak = item.stattrak ? "Yes" : "No";

        html += `
            <tr>
                <td>${item.weapon}</td>
                <td>${item.skin}</td>
                <td>${condition}</td>
                <td>${stattrak}</td>
                <td>${item.float}</td>
                <td>${item.paintSeed}</td>
            </tr>
        `;
    }

    html += `
                </tbody>
            </table>
        </div>
    `;

    inventoryContainer.innerHTML = html;
}