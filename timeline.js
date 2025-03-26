document.addEventListener("DOMContentLoaded", function() {
    loadTimeline();
    updateDaysUntilSeparation();
    // Update countdown every 24 hours (86400000 milliseconds)
    setInterval(updateDaysUntilSeparation, 86400000);
});

function updateDaysUntilSeparation() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`timeline_${user}`);
    let separationDate = "2026-04-15"; // Default

    // Find the Retirement Date from the table or saved data
    const table = document.getElementById("timelineTable");
    const rows = table.getElementsByTagName("TR");
    for (let i = 1; i < rows.length; i++) {
        const eventName = rows[i].getElementsByTagName("TD")[0].innerHTML;
        if (eventName === "Retirement Date") {
            separationDate = rows[i].getElementsByTagName("TD")[1].querySelector("input").value;
            break;
        }
    }

    // If no Retirement Date is found in the table, check saved data
    if (!separationDate && savedData) {
        const data = JSON.parse(savedData);
        const retirementEvent = data.find(item => item.event === "Retirement Date");
        if (retirementEvent) {
            separationDate = retirementEvent.date;
        }
    }

    // Calculate days until separation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day counting
    const sepDate = new Date(separationDate);
    const diffTime = sepDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById("daysUntilSeparation").textContent = diffDays > 0 ? diffDays : 0;
}

function addNewEvent() {
    const eventName = document.getElementById("newEventName").value;
    const eventDate = document.getElementById("newEventDate").value;

    if (!eventName || !eventDate) {
        alert("Please enter both an event name and date.");
        return;
    }

    const table = document.getElementById("timelineTable");
    const tbody = table.getElementsByTagName("TBODY")[0];
    const newRow = document.createElement("TR");
    newRow.innerHTML = `
        <td contenteditable="true">${eventName}</td>
        <td><input type="date" value="${eventDate}" onchange="updateDaysUntilSeparation()"></td>
        <td><button class="delete-btn" onclick="deleteTimelineEvent(this)">Delete</button></td>
    `;
    tbody.appendChild(newRow);

    document.getElementById("newEventName").value = "";
    document.getElementById("newEventDate").value = "";
    updateDaysUntilSeparation();
}

function deleteTimelineEvent(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateDaysUntilSeparation();
}

function saveTimeline() {
    const table = document.getElementById("timelineTable");
    const rows = table.getElementsByTagName("TR");
    const data = [];

    for (let i = 1; i < rows.length; i++) {
        const event = rows[i].getElementsByTagName("TD")[0].innerHTML;
        const date = rows[i].getElementsByTagName("TD")[1].querySelector("input").value;
        data.push({ event, date });
    }

    const user = getCurrentUser();
    localStorage.setItem(`timeline_${user}`, JSON.stringify(data));
    alert("Changes saved successfully!");
    updateDaysUntilSeparation();
}

function loadTimeline() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`timeline_${user}`);
    if (savedData) {
        const data = JSON.parse(savedData);
        const table = document.getElementById("timelineTable");
        const tbody = table.getElementsByTagName("TBODY")[0];
        tbody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("TR");
            row.innerHTML = `
                <td contenteditable="true">${item.event}</td>
                <td><input type="date" value="${item.date}" onchange="updateDaysUntilSeparation()"></td>
                <td><button class="delete-btn" onclick="deleteTimelineEvent(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
