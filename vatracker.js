document.addEventListener("DOMContentLoaded", function() {
    loadVAClaims();
});

function addNewVAClaim() {
    const condition = document.getElementById("newCondition").value;
    const ratingCriteria = document.getElementById("newRatingCriteria").value;
    const history = document.getElementById("newHistory").value;
    const statement = document.getElementById("newStatement").value;
    const evidence = document.getElementById("newEvidence").value;

    if (!condition) {
        alert("Please enter a condition.");
        return;
    }

    const table = document.getElementById("vaTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${condition}</td>
        <td contenteditable="true">${ratingCriteria}</td>
        <td contenteditable="true">${history}</td>
        <td contenteditable="true">${statement}</td>
        <td contenteditable="true">${evidence}</td>
        <td><button class="delete-btn" onclick="deleteVAClaim(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newCondition").value = "";
    document.getElementById("newRatingCriteria").value = "";
    document.getElementById("newHistory").value = "";
    document.getElementById("newStatement").value = "";
    document.getElementById("newEvidence").value = "";
}

function deleteVAClaim(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveVAClaims() {
    const table = document.getElementById("vaTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const condition = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const ratingCriteria = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const history = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const statement = rows[i].getElementsByTagName("TD")[3].innerHTML;
        const evidence = rows[i].getElementsByTagName("TD")[4].innerHTML;
        data.push({ condition, ratingCriteria, history, statement, evidence });
    }

    const user = getCurrentUser();
    localStorage.setItem(`vaClaims_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadVAClaims() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`vaClaims_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("vaTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.condition}</td>
                <td contenteditable="true">${item.ratingCriteria}</td>
                <td contenteditable="true">${item.history}</td>
                <td contenteditable="true">${item.statement}</td>
                <td contenteditable="true">${item.evidence}</td>
                <td><button class="delete-btn" onclick="deleteVAClaim(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
