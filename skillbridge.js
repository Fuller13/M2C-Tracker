document.addEventListener("DOMContentLoaded", function() {
    loadSkillbridge();
});

function addNewSkillbridge() {
    const location = document.getElementById("newLocation").value;
    const notes = document.getElementById("newNotes").value;
    const poc = document.getElementById("newPOC").value;
    const preference = document.getElementById("newPreference").value;

    if (!location) {
        alert("Please enter a location.");
        return;
    }

    const table = document.getElementById("skillbridgeTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${location}</td>
        <td contenteditable="true">${notes}</td>
        <td contenteditable="true">${poc}</td>
        <td contenteditable="true">${preference}</td>
        <td><button class="delete-btn" onclick="deleteSkillbridge(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newLocation").value = "";
    document.getElementById("newNotes").value = "";
    document.getElementById("newPOC").value = "";
    document.getElementById("newPreference").value = "";
}

function deleteSkillbridge(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function saveSkillbridge() {
    const table = document.getElementById("skillbridgeTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const location = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const notes = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const poc = rows[i].getElementsByTagName("TD")[2].innerHTML;
        const preference = rows[i].getElementsByTagName("TD")[3].innerHTML;
        data.push({ location, notes, poc, preference });
    }

    const user = getCurrentUser();
    localStorage.setItem(`skillbridge_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

function loadSkillbridge() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`skillbridge_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("skillbridgeTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.location}</td>
                <td contenteditable="true">${item.notes}</td>
                <td contenteditable="true">${item.poc}</td>
                <td contenteditable="true">${item.preference}</td>
                <td><button class="delete-btn" onclick="deleteSkillbridge(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
