const cmsContainer = document.getElementById("cmsContainer");
const cmsError = document.getElementById("cmsError");

fetch("cms.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Unable to load cms.json");
        }

        return response.json();
    })
    .then(function (data) {
        displayCMS(data.systems);
    })
    .catch(function (error) {
        console.error(error);

        cmsContainer.innerHTML = "";

        cmsError.textContent =
            "The CMS comparison data could not be loaded.";
    });


function createList(items) {
    const list = document.createElement("ul");

    list.classList.add("cms-detail-list");

    items.forEach(function (item) {
        const listItem = document.createElement("li");

        listItem.textContent = item;

        list.appendChild(listItem);
    });

    return list;
}


function createSourceLink(url) {
    const source = document.createElement("a");

    source.href = url;
    source.target = "_blank";
    source.rel = "noopener noreferrer";

    source.classList.add("cms-source");

    source.textContent = "Source";

    return source;
}


function displayCMS(systems) {
    const tableContainer = document.createElement("div");

    tableContainer.classList.add("cms-table-container");


    const table = document.createElement("table");

    table.classList.add("cms-table");


    const thead = document.createElement("thead");

    const headerRow = document.createElement("tr");


    const headings = [
        "System",
        "Support / Produced By",
        "Technology Base",
        "Major Capabilities",
        "Major Limitations",
        "Example Site"
    ];


    headings.forEach(function (heading) {
        const th = document.createElement("th");

        th.textContent = heading;

        headerRow.appendChild(th);
    });


    thead.appendChild(headerRow);

    table.appendChild(thead);


    const tbody = document.createElement("tbody");


    systems.forEach(function (system) {
        const row = document.createElement("tr");


        // System Name
        const nameCell = document.createElement("td");

        const systemName = document.createElement("strong");

        systemName.textContent = system.name;

        nameCell.appendChild(systemName);

        row.appendChild(nameCell);


        // Support
        const supportCell = document.createElement("td");

        const supportText = document.createElement("p");

        supportText.textContent = system.support;

        supportCell.appendChild(supportText);

        supportCell.appendChild(
            createSourceLink(system.supportSource)
        );

        row.appendChild(supportCell);


        // Technology
        const technologyCell = document.createElement("td");

        const technologyText = document.createElement("p");

        technologyText.textContent = system.technology;

        technologyCell.appendChild(technologyText);

        technologyCell.appendChild(
            createSourceLink(system.technologySource)
        );

        row.appendChild(technologyCell);


        // Capabilities
        const capabilitiesCell = document.createElement("td");

        capabilitiesCell.appendChild(
            createList(system.capabilities)
        );

        capabilitiesCell.appendChild(
            createSourceLink(system.capabilitiesSource)
        );

        row.appendChild(capabilitiesCell);


        // Limitations
        const limitationsCell = document.createElement("td");

        limitationsCell.appendChild(
            createList(system.limitations)
        );

        limitationsCell.appendChild(
            createSourceLink(system.limitationsSource)
        );

        row.appendChild(limitationsCell);


        // Example Site
        const exampleCell = document.createElement("td");

        const exampleLink = document.createElement("a");

        exampleLink.href = system.exampleUrl;
        exampleLink.target = "_blank";
        exampleLink.rel = "noopener noreferrer";

        exampleLink.textContent = system.exampleName;

        exampleCell.appendChild(exampleLink);

        exampleCell.appendChild(
            document.createElement("br")
        );

        exampleCell.appendChild(
            createSourceLink(system.exampleSource)
        );

        row.appendChild(exampleCell);


        tbody.appendChild(row);
    });


    table.appendChild(tbody);

    tableContainer.appendChild(table);


    cmsContainer.innerHTML = "";

    cmsContainer.appendChild(tableContainer);
}