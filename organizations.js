document.addEventListener("DOMContentLoaded", function() {
    loadOrgs();
});

function addNewOrg() {
    const name = document.getElementById("newOrgName").value;
    const link = document.getElementById("newOrgLink").value;
    const description = document.getElementById("newOrgDescription").value;
    const notes = document.getElementById("newOrgNotes").value;

    if (!name || !link) {
        alert("Please enter both an organization name and link.");
        return;
    }

    const table = document.getElementById("orgsTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${name}</td>
        <td><a href="${link}" target="_blank">${link}</a></td>
        <td contenteditable="true">${description}</td>
        <td contenteditable="true">${notes}</td>
        <td><button class="delete-btn" onclick="deleteOrg(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newOrgName").value = "";
    document.getElementById("newOrgLink").value = "";
    document.getElementById("newOrgDescription").value = "";
    document.getElementById("newOrgNotes").value = "";
}

function deleteOrg(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveOrgs() {
    const table = document.getElementById("orgsTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const link = rows[i].getElementsByTagName("TD")[1].querySelector("a").href;
        const description = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const notes = rows[i].getElementsByTagName("TD")[3].innerHTML;
        data.push({ name, link, description, notes });
    }

    const user = getCurrentUser();
    localStorage.setItem(`orgs_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadOrgs() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`orgs_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("orgsTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.name}</td>
                <td><a href="${item.link}" target="_blank">${item.link}</a></td>
                <td contenteditable="true">${item.description}</td>
                <td contenteditable="true">${item.notes}</td>
                <td><button class="delete-btn" onclick="deleteOrg(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
