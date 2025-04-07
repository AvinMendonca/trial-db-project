let currentSection = "";
let currentId = null;

window.addEventListener("DOMContentLoaded", () => {
  // Event listeners for login and logout
  const loggedInUser = document.getElementById("logged-in-as");
  loggedInUser.textContent = `Logged in as: ${localStorage.getItem(
    "username"
  )}`;
});

// popup message
function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.innerHTML = message;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 3000);
}

// displays user profile
function toggleDropdown() {
  const dropdown = document.getElementById("profile-dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

// closes user profile
function closeDropdownOutside(event) {
  if (!event.target.closest(".user-profile")) {
    document.getElementById("profile-dropdown").style.display = "none";
  }
}

// option to edit profile
function showEditProfile() {
  document.getElementById("edit-profile-form").style.display = "block";
}

// option to close edit profile
function closeEditProfile() {
  document.getElementById("edit-profile-form").style.display = "none";
}

// save profile
function saveProfile() {
  showPopup("Profile updated successfully!");
  closeEditProfile();
}

// queries the databased based on search input
function searchData() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const table = document.querySelector("table tbody");

  if (!table) return;

  if (!searchTerm) {
    fetchAndDisplayData(
      `/api/${currentSection}`,
      getSectionTitle(currentSection)
    );
    return;
  }

  Array.from(table.querySelectorAll("tr")).forEach((row) => {
    const found = Array.from(row.querySelectorAll("td")).some((cell) =>
      cell.textContent.toLowerCase().includes(searchTerm)
    );
    row.style.display = found ? "" : "none";
  });
}

// function openAddForm(section) {
//   currentSection = section;
//   document.getElementById(
//     "form-title"
//   ).textContent = `Add New ${getSectionTitle(section)}`;
//   document.getElementById("add-form").style.display = "block";

//   const form = document.getElementById("data-form");
//   form.innerHTML = "";

//   const formFields = {
//     students: ["Name", "Roll Number", "Course", "Phone"],
//     routes: ["Route ID", "Start Point", "End Point", "Distance"],
//     buses: ["Bus ID", "Model", "Capacity", "Registration"],
//     drivers: ["Driver ID", "Name", "License Number", "Phone"],
//     maintenance: ["Log ID", "Bus ID", "Date", "Description"],
//     incidents: ["Incident ID", "Date", "Description", "Severity"],
//   };

//   formFields[section].forEach((field) => {
//     const formGroup = document.createElement("div");
//     formGroup.classList.add("form-group");

//     const label = document.createElement("label");
//     label.textContent = field;

//     const input = document.createElement("input");
//     input.type = "text";
//     input.name = field.toLowerCase().replace(/\s+/g, "_");
//     input.required = true;

//     formGroup.appendChild(label);
//     formGroup.appendChild(input);
//     form.appendChild(formGroup);
//   });
// }

// pushes data into the database
function saveData() {
  showPopup("Data saved successfully!");
  closeForm();
  fetchAndDisplayData(
    `/api/${currentSection}`,
    getSectionTitle(currentSection)
  );
}

// no idea what this does
function editData(id) {
  currentId = id;
  showPopup("Edit feature coming soon!");
}

// deletes the data from the database
function deleteData(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    showPopup("Data deleted successfully!");
    fetchAndDisplayData(
      `/api/${currentSection}`,
      getSectionTitle(currentSection)
    );
  }
}

// again no idea what this does
function exportData() {
  showPopup("Export feature coming soon!");
}

// getting data from database and displays it
async function fetchAndDisplayData(endpoint, title) {
  try {
    // Mock data for demonstration
    const data = [];

    const contentDiv = document.getElementById("content");
    currentSection = endpoint.split("/")[2];

    contentDiv.innerHTML = `
      <div class="section-header">
        <h2>${title}</h2>
        <div class="section-actions">
          <button onclick="openAddForm('${currentSection}')">Add New</button>
          <button onclick="exportData()">Export</button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            ${
              data.length > 0
                ? Object.keys(data[0])
                    .map((key) => `<th>${key}</th>`)
                    .join("")
                : "<th>No data available</th>"
            }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${
            data.length > 0
              ? data
                  .map(
                    (item) => `
              <tr data-id="${item.id || item[Object.keys(item)[0]]}">
                ${Object.values(item)
                  .map((value) => `<td>${value}</td>`)
                  .join("")}
                <td>
                  <button onclick="editData('${item.id}')">Edit</button>
                  <button onclick="deleteData('${item.id}')">Delete</button>
                </td>
              </tr>
            `
                  )
                  .join("")
              : '<tr><td colspan="5">No data available</td></tr>'
          }
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error("Error fetching data:", error);
    showPopup("Failed to fetch data. Please try again later.");
  }
}

// displays the sections in frontend
function getSectionTitle(section) {
  const titles = {
    students: "Students",
    routes: "Routes",
    buses: "Buses",
    drivers: "Drivers",
    maintenance: "Maintenance Logs",
    incidents: "Incidents",
  };
  return titles[section] || section;
}

// button to close form
function closeForm() {
  document.getElementById("add-form").style.display = "none";
}

// button to edit form
function closeEditForm() {
  document.getElementById("edit-form").style.display = "none";
}

async function showStudents() {
  const response = await fetch("http://localhost:3000/api/students");
  const students = await response.json();
  console.log(students);

  const contentDiv = document.getElementById("content");

  if (students.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Student ID</th>
        <th>Name</th>
        <th>Grade</th>
        <th>Bus Route ID</th>
        <th>Boarding Point</th>
      </tr>
    </thead>
    <tbody>
      ${students
        .map(
          (student) => `
        <tr>
          <td>${student.StudentID}</td>
          <td>${student.Name}</td>
          <td>${student.Grade}</td>
          <td>${student.BusRouteID}</td>
          <td>${student.BoardingPoint}</td>
          <td>
            <button onclick="editData('${student.StudentID}')">Edit</button>
            <button onclick="deleteData('${student.StudentID}')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Students</h2>
      <div class="section-actions">
        <button onclick="openAddForm('students')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

async function showRoutes() {
  const response = await fetch("http://localhost:3000/api/routes");
  const routes = await response.json();
  console.log(routes);

  const contentDiv = document.getElementById("content");

  if (routes.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Route ID</th>
        <th>Starting Point</th>
        <th>End Point</th>
        <th>Distance</th>
        <th>Estimated Time</th>
      </tr>
    </thead>
    <tbody>
      ${routes
        .map(
          (route) => `
        <tr>
          <td>${route.RouteID}</td>
          <td>${route.StartPoint}</td>
          <td>${route.EndPoint}</td>
          <td>${route.Distance}</td>
          <td>${route.EstimatedTime}</td>
          <td>
            <button onclick="editData('${route.RouteID}')">Edit</button>
            <button onclick="deleteData('${route.RouteID}')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Routes</h2>
      <div class="section-actions">
        <button onclick="openAddForm('routes')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

async function showBuses() {
  const response = await fetch("http://localhost:3000/api/buses");
  const buses = await response.json();
  console.log(buses);
  const contentDiv = document.getElementById("content");

  if (buses.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Bus ID</th>
        <th>Model</th>
        <th>Capacity</th>
        <th>Registration Number</th>
        <th>Year</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${buses
        .map(
          (bus) => `
        <tr>
          <td>${bus.BusID}</td>
          <td>${bus.Model}</td>
          <td>${bus.Capacity}</td>
          <td>${bus.RegistrationNo}</td>
          <td>${bus.Year}</td>
          <td>${bus.Status}</td>
          <td>
            <button onclick="editData('${bus.BusID}')">Edit</button>
            <button onclick="deleteData('${bus.BusID}')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Buses</h2>
      <div class="section-actions">
        <button onclick="openAddForm('routes')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

async function showDrivers() {
  const response = await fetch("http://localhost:3000/api/drivers");
  const drivers = await response.json();
  console.log(drivers);

  const contentDiv = document.getElementById("content");

  if (drivers.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Driver ID</th>
        <th>Name</th>
        <th>License Number</th>
        <th>Contact</th>
        <th>Assigned Bus ID</th>
      </tr>
    </thead>
    <tbody>
      ${drivers
        .map(
          (driver) => `
        <tr>
          <td>${driver.DriverID}</td>
          <td>${driver.Name}</td>
          <td>${driver.LicenseNo}</td>
          <td>${driver.Contact}</td>
          <td>${driver.AssignedBusID}</td>
          <td>
            <button onclick="editData('${driver.DriverID}')">Edit</button>
            <button onclick="deleteData('${driver.DriverID}')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Drivers</h2>
      <div class="section-actions">
        <button onclick="openAddForm('routes')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

async function showMaintenanceLogs() {
  const response = await fetch("http://localhost:3000/api/maintenance");
  const logs = await response.json();
  console.log(logs);

  const contentDiv = document.getElementById("content");

  if (logs.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Log ID</th>
        <th>Bus ID</th>
        <th>Issue Date</th>
        <th>Resolution Date</th>
        <th>Cost</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      ${logs
        .map(
          (log) => `
        <tr>
          <td>${log.LogID}</td>
          <td>${log.BusID}</td>
          <td>${log.IssueDate.slice(0, 10)}</td>
          <td>${log.ResolutionDate.slice(0, 10)}</td>
          <td>${Math.round(Number(log.Cost))}</td>
          <td>${log.Description}</td>
          <td>
            <button onclick="editData('${log.LogID}')">Edit</button>
            <button onclick="deleteData('${log.LogID}')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Maintainence Logs</h2>
      <div class="section-actions">
        <button onclick="openAddForm('routes')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

async function showIncidents() {
  const response = await fetch("http://localhost:3000/api/incidents");
  const incidents = await response.json();
  console.log(incidents);

  const contentDiv = document.getElementById("content");

  if (incidents.length === 0) {
    contentDiv.innerHTML = "<p class='no-data'>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Incident ID</th>
        <th>Bus ID</th>
        <th>Date</th>
        <th>Type</th>
        <th>Description</th>
        <th>Reported By</th>
        </tr>
    </thead>
    <tbody>
      ${incidents
        .map(
          (incident) => `
        <tr>
          <td>${incident.IncidentID}</td>
          <td>${incident.BusID}</td>
          <td>${incident.Date.slice(0, 10)}</td>
          <td>${incident.Type}</td>
          <td>${incident.Description}</td>
          <td>${incident.ReportedBy}</td>
          <td>
            <button onclick="editData('${incident.IncidentID}')">Edit</button>
            <button onclick="deleteData('${
              incident.IncidentID
            }')">Delete</button>
          </td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  `;

  contentDiv.innerHTML = `
    <div class="section-header">
      <h2>Incidents</h2>
      <div class="section-actions">
        <button onclick="openAddForm('routes')">Add New</button>
        <button onclick="exportData()">Export</button>
      </div>
    </div>
  `;
  contentDiv.appendChild(table);
}

const logout = () => {
  localStorage.removeItem("username");
  window.location.href = "../login/login.html";
};

const addStudentForm = () => {
  document.getElementById("add-user-form").style.display = "block";
};

const addStudent = async () => {
  const name = document.getElementById("add-name").value;
  const grade = document.getElementById("add-grade").value;
  const busRouteId = document.getElementById("add-routeId").value;
  const boardingPoint = document.getElementById("add-boardingPoint").value;

  if (!name || !grade || !busRouteId || !boardingPoint) {
    showPopup("Please fill in all fields.");
    return;
  }
  try {
    const response = await fetch("http://localhost:3000/api/addstudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Grade: grade,
        BusRouteID: busRouteId,
        BoardingPoint: boardingPoint,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server Error:", errorData);
      showPopup(`Error: ${errorData.message || "Internal Server Error"}`);
      return;
    }
  } catch (error) {
    console.error("Network Error:", error);
    showPopup("Failed to connect to the server. Please try again later.");
  }

  showPopup("Student added successfully!");
  closeStudentForm();
  console.log(name, grade, busRouteId, boardingPoint);
};

const closeStudentForm = () => {
  document.getElementById("add-user-form").style.display = "none";
};
