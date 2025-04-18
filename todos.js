// Load saved data from local storage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("todoTable");
    const rows = table.getElementsByTagName("TR");

    // Make Task Name and Type columns editable
    for (let i = 1; i < rows.length; i++) {
        const taskCell = rows[i].getElementsByTagName("TD")[0];
        const typeCell = rows[i].getElementsByTagName("TD")[1];
        taskCell.setAttribute("contenteditable", "true");
        typeCell.setAttribute("contenteditable", "true");

        // Add dropdown for Status column
        const statusCell = rows[i].getElementsByTagName("TD")[2];
        const currentStatus = statusCell.innerHTML;
        statusCell.innerHTML = `
            <select onchange="updateStatus(this)">
                <option value="Not Started" ${currentStatus === "Not Started" ? "selected" : ""}>Not Started</option>
                <option value="In Progress" ${currentStatus === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${currentStatus === "Completed" ? "selected" : ""}>Completed</option>
            </select>
        `;
    }

    // Load saved data from local storage
    loadSavedData();
});

// Add new task
function addNewTask() {
    const taskName = document.getElementById("newTaskName").value;
    const taskType = document.getElementById("newTaskType").value;
    const taskStatus = document.getElementById("newTaskStatus").value;

    if (!taskName) {
        alert("Please enter a task name.");
        return;
    }

    const table = document.getElementById("todoTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${taskName}</td>
        <td contenteditable="true">${taskType}</td>
        <td>
            <select onchange="updateStatus(this)">
                <option value="Not Started" ${taskStatus === "Not Started" ? "selected" : ""}>Not Started</option>
                <option value="In Progress" ${taskStatus === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${taskStatus === "Completed" ? "selected" : ""}>Completed</option>
            </select>
        </td>
        <td><button class="delete-btn" onclick="deleteTask(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    // Clear the form
    document.getElementById("newTaskName").value = "";
    document.getElementById("newTaskType").value = "Recurring";
    document.getElementById("newTaskStatus").value = "Not Started";
}

// Delete task
function deleteTask(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// Sorting function for table
function sortTable(columnIndex) {
    const table = document.getElementById("todoTable");
    let rows, switching = true, i, shouldSwitch, dir = "asc", switchCount = 0;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            const x = rows[i].getElementsByTagName("TD")[columnIndex];
            const y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
            let xValue = columnIndex === 2 ? x.querySelector("select").value : x.innerHTML.toLowerCase();
            let yValue = columnIndex === 2 ? y.querySelector("select").value : y.innerHTML.toLowerCase();
            if (dir === "asc") {
                if (xValue > yValue) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (xValue < yValue) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        } else {
            if (switchCount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// Save changes to local storage
function saveChanges() {
    const table = document.getElementById("todoTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const taskName = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const type = rows[i].getElementsByTagName("TD")[1].innerHTML;
        const status = rows[i].getElementsByTagName("TD")[2].querySelector("select").value;
        data.push({ taskName, type, status });
    }

    const user = getCurrentUser();
    localStorage.setItem(`todos_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
}

// Load saved data from local storage
function loadSavedData() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`todos_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("todoTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = ""; // Clear existing rows

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.taskName}</td>
                <td contenteditable="true">${item.type}</td>
                <td>
                    <select onchange="updateStatus(this)">
                        <option value="Not Started" ${item.status === "Not Started" ? "selected" : ""}>Not Started</option>
                        <option value="In Progress" ${item.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option value="Completed" ${item.status === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                </td>
                <td><button class="delete-btn" onclick="deleteTask(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Placeholder for status update logging
function updateStatus(selectElement) {
    const newStatus = selectElement.value;
    console.log(`Status updated to: ${newStatus}`);
}
