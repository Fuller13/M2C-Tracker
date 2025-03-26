document.addEventListener("DOMContentLoaded", function() {
    loadCerts();
});

function addNewCert() {
    const certName = document.getElementById("newCertName").value;
    const courseOptions = document.getElementById("newCourseOptions").value;
    const cost = document.getElementById("newCost").value;
    const materials = document.getElementById("newMaterials").value;
    const companies = document.getElementById("newCompanies").value;
    const notes = document.getElementById("newNotes").value;

    if (!certName) {
        alert("Please enter a certification or degree name.");
        return;
    }

    const table = document.getElementById("certsTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${certName}</td>
        <td contenteditable="true">${courseOptions}</td>
        <td contenteditable="true">${cost}</td>
        <td contenteditable="true">${materials}</td>
        <td contenteditable="true">${companies}</td>
        <td contenteditable="true">${notes}</td>
        <td><button class="delete-btn" onclick="deleteCert(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newCertName").value = "";
    document.getElementById("newCourseOptions").value = "";
    document.getElementById("newCost").value = "";
    document.getElementById("newMaterials").value = "";
    document.getElementById("newCompanies").value = "";
    document.getElementById("newNotes").value = "";
}

function deleteCert(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveCerts() {
    const table = document.getElementById("certsTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const certName = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const courseOptions = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const cost = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const materials = rows[i].getElementsByTagName("TD")[3].innerHTML;
        const companies = rows[i].getElementsByTagName("TD")[4].innerHTML;
        const notes = rows[i].getElementsByTagName("TD")[5].innerHTML;
        data.push({ certName, courseOptions, cost, materials, companies, notes });
    }

    const user = getCurrentUser();
    localStorage.setItem(`certs_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadCerts() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`certs_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("certsTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.certName}</td>
                <td contenteditable="true">${item.courseOptions}</td>
                <td contenteditable="true">${item.cost}</td>
                <td contenteditable="true">${item.materials}</td>
                <td contenteditable="true">${item.companies}</td>
                <td contenteditable="true">${item.notes}</td>
                <td><button class="delete-btn" onclick="deleteCert(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
