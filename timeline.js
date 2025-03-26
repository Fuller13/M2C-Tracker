document.addEventListener("DOMContentLoaded", function() {
    loadTimeline();
    updateDaysUntilSeparation();
});

function updateDaysUntilSeparation() {
    const user = getCurrentUser();
    const savedData = localStorage.getItem(`timeline_${user}`);
    let separationDate = "2026-04-15"; // Default
    if (savedData) {
        const data = JSON.parse(savedData);
        const retirementEvent = data.find(item => item.event === "Retirement Date");
        if (retirementEvent) {
            separationDate = retirementEvent.date;
        }
    }

    const today = new Date();
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
        <td contenteditable="true">${eventDate}</td>
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
        const date = rows[i].getElementsByTagName("TD")[1].innerHTML;
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
                <td contenteditable="true">${item.date}</td>
                <td><button class="delete-btn" onclick="deleteTimelineEvent(this)">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}
