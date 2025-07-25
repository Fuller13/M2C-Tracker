/**
 * storage.js
 * Centralized localStorage management for Military Transition Tracker
 * Handles editable tables, adding/deleting rows, saving, and downloading data
 * Designed for offline use in a downloadable website shell
 */
console.log('storage.js loaded');

// Default organizations data
const defaultOrganizations = [
    { name: "LinkedIn Premium", link: "https://socialimpact.linkedin.com/programs/veterans/activeduty", description: "1 year free for separated Veterans and unlimited free access for Active Duty", notes: "" },
    { name: "American Corporate Partners", link: "https://www.acp-usa.org/", description: "1 year free mentorship program with an industry partner. Includes military/veteran spouse resources", notes: "" },
    { name: "Four Block", link: "https://fourblock.org/", description: "Free career readiness program that includes mentorship, networking, resume, and interview prep", notes: "Long-term networking opportunity. Includes options for military/veteran spouses" },
    { name: "Hire Heroes USA", link: "https://www.hireheroesusa.org/", description: "Resume assistance, resume tailoring, mentorship, free access to Coursera for 6 months, multiple other training options", notes: "" },
    { name: "Hire Military", link: "https://www.hiremilitary.us/s/", description: "Free training sessions, virtual career fairs, Skillbridge placement", notes: "" },
    { name: "Hiring Our Heroes", link: "https://www.hiringourheroes.org/", description: "Fellowship options for Skillbridge. Includes cohorts and off-cycle option. Access to free certifications with Google", notes: "" },
    { name: "O*Net Online", link: "https://www.onetonline.org/", description: "Helps translate military words to civilian", notes: "" },
    { name: "Onward to Opportunity", link: "https://ivmf.syracuse.edu/programs/career-training-2/", description: "Free certification during last 6 months on active duty or any time as a Reservist or Veteran", notes: "" },
    { name: "Recruit Military", link: "https://recruitmilitary.com/", description: "Free training sessions on resumes, virtual career fairs, in person career fairs. Skillbridge placement assistance", notes: "" },
    { name: "USO", link: "https://www.uso.org/programs/uso-transition-program", description: "Transition assistance program includes financial readiness, employment resources, mentorship, education resources such as Coursera. Free training sessions on LinkedIn and resumes", notes: "" },
    { name: "Veteran Hiring Solutions", link: "https://www.veteranhiringsolutions.com/", description: "Resume assistance, interview preparation with AI assistance, translating military experience to civilian terminology, career guidance", notes: "" },
    { name: "Veterati", link: "https://www.veterati.com/", description: "On demand mentorship. Sign up for an account and search for a mentor. Spouses and Veterans eligible", notes: "" },
    { name: "Vets2PM", link: "https://vets2pm.com/", description: "Free learning, Skillbridge options. Certification options during Skillbridge", notes: "" },
    { name: "50Strong", link: "https://www.50-strong.us/", description: "Veteran Employment resource", notes: "" },
    { name: "The Honor Foundation", link: "https://www.honor.org/", description: "Career transition program for U.S. Special Operations Forces that effectively translates their elite military service to the private sector and helps create the next generation of corporate and community leaders.", notes: "" },
    { name: "Operation New Uniform", link: "https://www.onuvets.org/", description: "Non-profit organization dedicated to empowering transitioning Servicemembers from all branches of the military to find their new uniform—a fulfilling career in the business world.", notes: "" },
    { name: "Veteran Timeline", link: "https://www.veterantimeline.com/", description: "Individualized timeline builder built by Veterans", notes: "" },
    { name: "Bankrate Cost of Living Calculator", link: "https://www.bankrate.com/real-estate/cost-of-living-calculator/", description: "Compare living expenses across cities to plan relocation and budgeting.", notes: "" },
    { name: "AnnualCreditReport.com", link: "https://www.annualcreditreport.com/index.action", description: "Access free credit reports to monitor financial health and detect identity theft.", notes: "" },
    { name: "MilGears", link: "https://milgears.osd.mil/", description: "Career planning tool to map military skills to civilian credentials and jobs.", notes: "" },
    { name: "VA.gov", link: "https://www.va.gov/", description: "Access VA benefits, health care, education, and career resources for Veterans.", notes: "" },
    { name: "MilConnect", link: "https://milconnect.dmdc.osd.mil/milconnect/", description: "Manage military benefits, records, and transition resources.", notes: "" },
    { name: "DOD COOL", link: "https://www.cool.osd.mil/", description: "Explore civilian credentials related to military occupations.", notes: "" },
    { name: "SmartAsset Paycheck Calculator", link: "https://smartasset.com/taxes/paycheck-calculator", description: "Estimate take-home pay after federal, state, and local taxes.", notes: "" }
];

// Version for data schema
const DATA_VERSION = '2.1';

// Initialize data from localStorage or create new
let m2cData = JSON.parse(localStorage.getItem('m2cData')) || {
    contacts: [],
    locations: [],
    organizations: defaultOrganizations,
    personaldevelopment: [],
    skillbridge: [],
    timeline: [{ event: "Retirement Date", date: "2025-12-25" }],
    todos: [{ task: "New Task", type: "Recurring", status: "Not Started" }],
    vatracker: []
};

// Check data version and update organizations if outdated or incomplete
const storedVersion = localStorage.getItem('dataVersion');
if (storedVersion !== DATA_VERSION || m2cData.organizations.length < defaultOrganizations.length) {
    console.log('Updating m2cData.organizations to version', DATA_VERSION);
    // Merge default organizations with user-added entries
    const userOrgs = m2cData.organizations.filter(org => 
        !defaultOrganizations.some(defaultOrg => defaultOrg.link === org.link)
    );
    m2cData.organizations = [...defaultOrganizations, ...userOrgs];
    localStorage.setItem('m2cData', JSON.stringify(m2cData));
    localStorage.setItem('dataVersion', DATA_VERSION);
}

// Page configurations
const pageConfig = {
    contacts: {
        tableId: 'contactsTable',
        fields: ['name', 'company', 'title', 'relationship', 'email', 'phone'],
        inputs: ['newContactName', 'newContactCompany', 'newContactTitle', 'newContactRelationship', 'newContactEmail', 'newContactPhone'],
        required: ['newContactName']
    },
    locations: {
        tableId: 'locationsTable',
        fields: ['city', 'jobOptions', 'jobAreas', 'costOfLiving', 'schools', 'familyOpportunity', 'otherFactors', 'grade'],
        inputs: ['newCity', 'newJobOptions', 'newJobAreas', 'newCostOfLiving', 'newSchools', 'newFamilyOpportunity', 'newOtherFactors', 'newGrade'],
        required: ['newCity']
    },
    organizations: {
        tableId: 'orgsTable',
        fields: ['name', 'link', 'description', 'notes'],
        inputs: ['newOrgName', 'newOrgLink', 'newOrgDescription', 'newOrgNotes'],
        required: ['newOrgName', 'newOrgLink']
    },
    personaldevelopment: {
        tableId: 'certsTable',
        fields: ['certName', 'courseOptions', 'cost', 'materials', 'companies', 'notes'],
        inputs: ['newCertName', 'newCourseOptions', 'newCost', 'newMaterials', 'newCompanies', 'newNotes'],
        required: ['newCertName']
    },
    skillbridge: {
        tableId: 'skillbridgeTable',
        fields: ['location', 'notes', 'poc', 'preference'],
        inputs: ['newLocation', 'newNotes', 'newPOC', 'newPreference'],
        required: ['newLocation']
    },
    timeline: {
        tableId: 'timelineTable',
        fields: ['event', 'date'],
        inputs: ['newEventName', 'newEventDate'],
        required: ['newEventName', 'newEventDate']
    },
    todos: {
        tableId: 'todoTable',
        fields: ['task', 'type', 'status'],
        inputs: ['newTaskName', 'newTaskType', 'newTaskStatus'],
        required: ['newTaskName']
    },
    vatracker: {
        tableId: 'vaTable',
        fields: ['condition', 'ratingCriteria', 'history', 'statement', 'evidence'],
        inputs: ['newCondition', 'newRatingCriteria', 'newHistory', 'newStatement', 'newEvidence'],
        required: ['newCondition']
    }
};

// Load data into table on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired for page:', document.body.dataset.page || getPageFromUrl());
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    const page = document.body.dataset.page || getPageFromUrl();
    const config = pageConfig[page];
    if (!config) {
        console.warn('No config found for page:', page);
        return;
    }

    // Load table data
    const table = document.getElementById(config.tableId);
    const tbody = table?.querySelector('tbody');
    if (!table || !tbody) {
        console.error(`Table or tbody not found for tableId: ${config.tableId} on page: ${page}`);
        return;
    }
    tbody.innerHTML = '';
    m2cData[page].forEach((item, index) => {
        const row = createTableRow(page, item, index);
        tbody.appendChild(row);
    });

    // Log button event handlers
    console.log('Button functions defined:', {
        addNewContact: typeof addNewContact,
        saveContacts: typeof saveContacts,
        downloadData: typeof downloadData,
        toggleDarkMode: typeof toggleDarkMode
    });

    // Timeline-specific: Update days until separation and set daily update
    if (page === 'timeline') {
        updateDaysUntilSeparation();
        setInterval(updateDaysUntilSeparation, 86400000);
    }
});

// Get page key from URL
function getPageFromUrl() {
    const path = window.location.pathname.split('/').pop().replace('.html', '');
    return path === 'index' ? null : path;
}

// Create table row with appropriate cell types
function createTableRow(page, item, index) {
    console.log('createTableRow called for page:', page, 'index:', index);
    const config = pageConfig[page];
    const row = document.createElement('tr');
    config.fields.forEach((field, colIndex) => {
        const td = document.createElement('td');
        if (page === 'timeline' && field === 'date') {
            const input = document.createElement('input');
            input.type = 'date';
            input.value = item[field] || '';
            input.addEventListener('change', () => saveData(page));
            td.appendChild(input);
        } else if (page === 'todos' && field === 'status') {
            const select = document.createElement('select');
            select.innerHTML = `
                <option value="Not Started" ${item[field] === 'Not Started' ? 'selected' : ''}>Not Started</option>
                <option value="In Progress" ${item[field] === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Completed" ${item[field] === 'Completed' ? 'selected' : ''}>Completed</option>
            `;
            select.addEventListener('change', () => saveData(page));
            td.appendChild(select);
        } else if (field === 'link' && item[field]) {
            const a = document.createElement('a');
            a.href = item[field];
            a.textContent = item[field];
            a.target = '_blank';
            td.appendChild(a);
        } else {
            td.contentEditable = true;
            td.textContent = item[field] || '';
            td.addEventListener('input', () => saveData(page));
        }
        row.appendChild(td);
    });
    const actionTd = document.createElement('td');
    actionTd.innerHTML = `<button class="delete-btn" onclick="deleteRow('${page}', ${index})">Delete</button>`;
    row.appendChild(actionTd);
    return row;
}

// Add new row to table
function addNewRow(page) {
    console.log('addNewRow called for page:', page);
    const config = pageConfig[page];
    const newItem = {};
    let isValid = true;

    config.inputs.forEach((inputId, index) => {
        const input = document.getElementById(inputId);
        if (input) {
            newItem[config.fields[index]] = input.value;
            if (config.required.includes(inputId) && !input.value.trim()) {
                isValid = false;
            }
        } else {
            console.error(`Input not found: ${inputId} on page: ${page}`);
        }
    });

    if (isValid) {
        // Add to m2cData
        m2cData[page].push(newItem);

        // Directly append row to table
        const table = document.getElementById(config.tableId);
        const tbody = table?.querySelector('tbody');
        if (!table || !tbody) {
            console.error(`Table or tbody not found for tableId: ${config.tableId} on page: ${page}`);
            return;
        }
        const index = m2cData[page].length - 1; // Index of new item
        const row = createTableRow(page, newItem, index);
        tbody.appendChild(row);

        // Save to localStorage
        localStorage.setItem('m2cData', JSON.stringify(m2cData));
        showStatus();

        // Clear form inputs
        config.inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.value = input.type === 'number' || input.tagName === 'SELECT' ? input.defaultValue : '';
            }
        });

        if (page === 'timeline') updateDaysUntilSeparation();
    } else {
        alert('Please fill in all required fields.');
    }
}

// Delete row from table
function deleteRow(page, index) {
    console.log('deleteRow called for page:', page, 'index:', index);
    m2cData[page].splice(index, 1);
    saveData(page);
    updateTable(page);
    if (page === 'timeline') updateDaysUntilSeparation();
}

// Update table display (used for initial load and deletes)
function updateTable(page) {
    console.log('updateTable called for page:', page);
    const config = pageConfig[page];
    const table = document.getElementById(config.tableId);
    const tbody = table?.querySelector('tbody');
    if (!table || !tbody) {
        console.error(`Table or tbody not found for tableId: ${config.tableId} on page: ${page}`);
        return;
    }
    tbody.innerHTML = '';
    m2cData[page].forEach((item, index) => {
        const row = createTableRow(page, item, index);
        tbody.appendChild(row);
    });
}

// Save data to localStorage (used for edits and deletes)
function saveData(page) {
    console.log('saveData called for page:', page);
    const config = pageConfig[page];
    const table = document.getElementById(config.tableId);
    const tbody = table?.querySelector('tbody');
    if (!tbody) {
        console.error(`Table or tbody not found for tableId: ${config.tableId} on page: ${page}`);
        return;
    }
    m2cData[page] = Array.from(tbody.querySelectorAll('tr')).map(row => {
        const item = {};
        config.fields.forEach((field, index) => {
            if (page === 'timeline' && field === 'date') {
                item[field] = row.cells[index].querySelector('input').value;
            } else if (page === 'todos' && field === 'status') {
                item[field] = row.cells[index].querySelector('select').value;
            } else if (field === 'link') {
                const a = row.cells[index].querySelector('a');
                item[field] = a ? a.href : '';
            } else {
                item[field] = row.cells[index].textContent;
            }
        });
        return item;
    });
    localStorage.setItem('m2cData', JSON.stringify(m2cData));
    showStatus();
}

// Download all data as JSON file
function downloadData() {
    console.log('downloadData called');
    const blob = new Blob([JSON.stringify(m2cData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'm2c-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show temporary status message
function showStatus() {
    console.log('showStatus called');
    const status = document.getElementById('status');
    if (status) {
        status.style.display = 'block';
        setTimeout(() => {
            status.style.display = 'none';
        }, 2000);
    } else {
        console.warn('Status element not found');
    }
}

// Timeline-specific: Update days until separation
function updateDaysUntilSeparation() {
    console.log('updateDaysUntilSeparation called');
    const retirementDate = m2cData.timeline.find(item => item.event === 'Retirement Date')?.date || '2025-12-25';
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    const endDate = new Date(retirementDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysElement = document.getElementById('daysUntilSeparation');
    if (daysElement) {
        daysElement.textContent = diffDays > 0 ? diffDays : 0;
    } else {
        console.warn('daysUntilSeparation element not found');
    }
}

// Page-specific add functions
function addNewContact() { console.log('addNewContact called'); addNewRow('contacts'); }
function addNewLocation() { console.log('addNewLocation called'); addNewRow('locations'); }
function addNewOrg() { console.log('addNewOrg called'); addNewRow('organizations'); }
function addNewCert() { console.log('addNewCert called'); addNewRow('personaldevelopment'); }
function addNewSkillbridge() { console.log('addNewSkillbridge called'); addNewRow('skillbridge'); }
function addNewEvent() { console.log('addNewEvent called'); addNewRow('timeline'); }
function addNewTask() { console.log('addNewTask called'); addNewRow('todos'); }
function addNewVAClaim() { console.log('addNewVAClaim called'); addNewRow('vatracker'); }

// Page-specific save functions
function saveContacts() { console.log('saveContacts called'); saveData('contacts'); }
function saveLocations() { console.log('saveLocations called'); saveData('locations'); }
function saveOrgs() { console.log('saveOrgs called'); saveData('organizations'); }
function saveCerts() { console.log('saveCerts called'); saveData('personaldevelopment'); }
function saveSkillbridge() { console.log('saveSkillbridge called'); saveData('skillbridge'); }
function saveTimeline() { console.log('saveTimeline called'); saveData('timeline'); }
function saveVAClaims() { console.log('saveVAClaims called'); saveData('vatracker'); }
function saveChanges() { console.log('saveChanges called'); saveData('todos'); }

// Todos-specific: Sort table
function sortTable(columnIndex) {
    console.log('sortTable called with columnIndex:', columnIndex);
    const table = document.getElementById('todoTable');
    const tbody = table?.querySelector('tbody');
    if (!table || !tbody) {
        console.error('Table or tbody not found for todoTable');
        return;
    }
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = table.dataset.sortOrder !== 'asc';
    table.dataset.sortOrder = isAscending ? 'asc' : 'desc';

    rows.sort((a, b) => {
        const x = columnIndex === 2 ? a.cells[columnIndex].querySelector('select').value : a.cells[columnIndex].textContent.toLowerCase();
        const y = columnIndex === 2 ? b.cells[columnIndex].querySelector('select').value : b.cells[columnIndex].textContent.toLowerCase();
        return isAscending ? x.localeCompare(y) : y.localeCompare(x);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    saveData('todos');
}

// Dark mode toggle function
function toggleDarkMode() {
    console.log('toggleDarkMode called');
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}

// Reset data function for testing
function resetData() {
    console.log('resetData called');
    localStorage.removeItem('m2cData');
    localStorage.removeItem('dataVersion');
    alert('Data reset! Please reload the page.');
}
