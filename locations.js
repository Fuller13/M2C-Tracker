document.addEventListener("DOMContentLoaded", function() {
    loadLocations();
});

function addNewLocation() {
    const city = document.getElementById("newCity").value;
    const jobOptions = document.getElementById("newJobOptions").value;
    const jobAreas = document.getElementById("newJobAreas").value;
    const costOfLiving = document.getElementById("newCostOfLiving").value;
    const schools = document.getElementById("newSchools").value;
    const familyOpportunity = document.getElementById("newFamilyOpportunity").value;
    const otherFactors = document.getElementById("newOtherFactors").value;
    const grade = document.getElementById("newGrade").value;

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    const table = document.getElementById("locationsTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${city}</td>
        <td contenteditable="true">${jobOptions}</td>
        <td contenteditable="true">${jobAreas}</td>
        <td contenteditable="true">${costOfLiving}</td>
        <td contenteditable="true">${schools}</td>
        <td contenteditable="true">${familyOpportunity}</td>
        <td contenteditable="true">${otherFactors}</td>
        <td contenteditable="true">${grade}</td>
        <td><button class="delete-btn" onclick="deleteLocation(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newCity").value = "";
    document.getElementById("newJobOptions").value = "";
    document.getElementById("newJobAreas").value = "";
    document.getElementById("newCostOfLiving").value = "";
    document.getElementById("newSchools").value = "";
    document.getElementById("newFamilyOpportunity").value = "";
    document.getElementById("newOtherFactors").value = "";
    document.getElementById("newGrade").value = "1";
}

function deleteLocation(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveLocations() {
    const table = document.getElementById("locationsTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const city = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const jobOptions = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const jobAreas = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const costOfLiving = rows[i].getElementsByTagName("TD")[3].innerHTML;
        const schools = rows[i].getElementsByTagName("TD")[4].innerHTML;
        const familyOpportunity = rows[i].getElementsByTagName("TD")[5].innerHTML;
        const otherFactors = rows[i].getElementsByTagName("TD")[6].innerHTML;
        const grade = rows[i].getElementsByTagName("TD")[7].innerHTML;
        data.push({ city, jobOptions, jobAreas, costOfLiving, schools, familyOpportunity, otherFactors, grade });
    }

    const user = getCurrentUser();
    localStorage.setItem(`locations_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadLocations() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`locations_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("locationsTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.city}</td>
                <td contenteditable="true">${item.jobOptions}</td>
                <td contenteditable="true">${item.jobAreas}</td>
                <td contenteditable="true">${item.costOfLiving}</td>
                <td contenteditable="true">${item.schools}</td>
                <td contenteditable="true">${item.familyOpportunity}</td>
                <td contenteditable="true">${item.otherFactors}</td>
                <td contenteditable="true">${item.grade}</td>
                <td><button class="delete-btn" onclick="deleteLocation(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
