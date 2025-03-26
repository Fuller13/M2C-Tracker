document.addEventListener("DOMContentLoaded", function() {
    loadContacts();
});

function addNewContact() {
    const name = document.getElementById("newContactName").value;
    const company = document.getElementById("newContactCompany").value;
    const title = document.getElementById("newContactTitle").value;
    const relationship = document.getElementById("newContactRelationship").value;
    const email = document.getElementById("newContactEmail").value;
    const phone = document.getElementById("newContactPhone").value;

    if (!name) {
        alert("Please enter a name.");
        return;
    }

    const table = document.getElementById("contactsTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${name}</td>
        <td contenteditable="true">${company}</td>
        <td contenteditable="true">${title}</td>
        <td contenteditable="true">${relationship}</td>
        <td contenteditable="true">${email}</td>
        <td contenteditable="true">${phone}</td>
        <td><button class="delete-btn" onclick="deleteContact(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newContactName").value = "";
    document.getElementById("newContactCompany").value = "";
    document.getElementById("newContactTitle").value = "";
    document.getElementById("newContactRelationship").value = "";
    document.getElementById("newContactEmail").value = "";
    document.getElementById("newContactPhone").value = "";
}

function deleteContact(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveContacts() {
    const table = document.getElementById("contactsTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const company = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const title = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const relationship = rows[i].getElementsByTagName("TD")[3].innerHTML;
        const email = rows[i].getElementsByTagName("TD")[4].innerHTML;
        const phone = rows[i].getElementsByTagName("TD")[5].innerHTML;
        data.push({ name, company, title, relationship, email, phone });
    }

    const user = getCurrentUser();
    localStorage.setItem(`contacts_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadContacts() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`contacts_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("contactsTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.name}</td>
                <td contenteditable="true">${item.company}</td>
                <td contenteditable="true">${item.title}</td>
                <td contenteditable="true">${item.relationship}</td>
                <td contenteditable="true">${item.email}</td>
                <td contenteditable="true">${item.phone}</td>
                <td><button class="delete-btn" onclick="deleteContact(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
