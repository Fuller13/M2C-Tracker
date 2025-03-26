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
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
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

// Add dropdown for Status column
document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("todoTable");
    const rows = table.getElementsByTagName("TR");
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].getElementsByTagName("TD")[2];
        const currentStatus = cell.innerHTML;
        cell.innerHTML = `
            <select onchange="updateStatus(this)">
                <option value="Not Started" ${currentStatus === "Not Started" ? "selected" : ""}>Not Started</option>
                <option value="In Progress" ${currentStatus === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${currentStatus === "Completed" ? "selected" : ""}>Completed</option>
            </select>
        `;
    }
});

// Update status (placeholder for future persistence)
function updateStatus(selectElement) {
    const newStatus = selectElement.value;
    console.log(`Status updated to: ${newStatus}`);
    // In a real app, you'd save this to a database or local storage
}
