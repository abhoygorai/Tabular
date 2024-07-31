const selectElement = document.getElementById("platform");
const keywordString = document.getElementById("keyword");
const fromDateElement = document.getElementById("date-from");
const toDateElement = document.getElementById("date-to");

let pageNumber = 1;
let isSidebarVisible = true; // Variable to track sidebar state

// selectElement.addEventListener('change', (event) => {
//     const selectedValue = event.target.value;
//     handleSelectChange(selectedValue);
// });

fromDateElement.addEventListener("change", () => {
  // Set the minimum date of the "to date" input to the selected "from date"
  toDateElement.min = fromDateElement.value;
});

async function search() {
  pageNumber = 1;
  // console.log(selectedValue, keyWordValue, fromDateValue, toDateValue);
  await handleSelectChange(pageNumber);
}

async function next() {
  pageNumber++;
  // console.log(selectedValue, keyWordValue, fromDateValue, toDateValue);
  await handleSelectChange(pageNumber);
}

async function previous() {
  pageNumber--;
  // console.log(selectedValue, keyWordValue, fromDateValue, toDateValue);
  await handleSelectChange(pageNumber);
}

async function pageClick(i) {
  pageNumber = parseInt(i);
  await handleSelectChange(pageNumber);
}

async function handleSelectChange(pageNumber) {
  const platform = selectElement.value;
  const keyWord = keywordString.value;
  const fromDateValue = fromDateElement.value;
  const toDateValue = toDateElement.value;
  const data = await api(
    platform,
    keyWord,
    fromDateValue,
    toDateValue,
    pageNumber
  );
  // console.log(data);
  makePages(data[1], pageNumber);
  // console.log("------", data[0]);
  renderTable(data[0]);
}

async function api(platform, keyWord, fromDateValue, toDateValue, pageNumber) {
  try {
    const response = await fetch("http://localhost:8000/fetchdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        platform: platform,
        keyword: keyWord,
        fromDate: fromDateValue,
        toDate: toDateValue,
        pageNumber: pageNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    ``;

    const data = await response.json(); // Convert the response to JSON
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function makePages(rowCount, pageNumber) {
  let pageCount = Math.ceil(rowCount / 15);
  // console.log(pageCount)
  const paginationContainer = document.querySelector(".pagination-pages");
  paginationContainer.innerHTML = ""; // Clear existing buttons, if any

  const select = document.createElement("select");
  select.className = "pageDropdown";

  for (let i = 1; i <= pageCount; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = `Page ${i}`;
    select.appendChild(option);
  }

  select.addEventListener("change", (event) => {
    const selectedPage = event.target.value;
    console.log(`Page ${selectedPage} selected`);
    pageClick(selectedPage);
  });

  select.value = pageNumber;
  paginationContainer.appendChild(select);
}

function renderTable(data) {
  const table = document.getElementById("dataTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear previous content
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (data.length > 0) {
    // Define the headers
    const headers = ["Posted By", "Post", "Posted on", "Platform"];
    const headerRow = document.createElement("tr");

    // Create table headers
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table rows
    data.forEach((row) => {
      // console.log(row)
      const tr = document.createElement("tr");
      
      // Posted By
      const tdPostedBy = document.createElement("td");
      tdPostedBy.textContent = row[0];
      tr.appendChild(tdPostedBy);
      
      // Post (Clickable with URL)
      const tdPost = document.createElement("td");
      const a = document.createElement("a");
      a.href = row[2]; // Use the 'url' for the link
      a.textContent = row[1];
      a.target = "_blank"; // Open link in a new tab
      tdPost.appendChild(a);
      tr.appendChild(tdPost);
      
      // Posted on
      const tdPostedOn = document.createElement("td");
      tdPostedOn.textContent = row[3];
      tr.appendChild(tdPostedOn);
      
      // Platform
      const tdPlatform = document.createElement("td");
      tdPlatform.textContent = row[4];
      tr.appendChild(tdPlatform);

      tbody.appendChild(tr);
    });
  } else {
    // Handle empty data case
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4; // 4 columns in the table
    td.textContent = "No data available";
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}


function reset() {
  const table = document.getElementById("dataTable");
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");
  const paginationContainer = document.querySelector(".pagination-pages");

  // Clear previous content
  thead.innerHTML = "";
  tbody.innerHTML = "";
  paginationContainer.innerHTML = "";
}

function logout() {
  window.location.href = "index.html";
}

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const tableContainer = document.querySelector(".table-container");
  const toggleButton = document.querySelector(".toggle-sidebar");
  const collapseButton = document.querySelector(".collapse-button");

  isSidebarVisible = !isSidebarVisible; // Toggle sidebar visibility state

  if (isSidebarVisible) {
    // Show the sidebar and "X" button, hide the "Toggle Sidebar" button
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("collapsed");    
    tableContainer.classList.remove("collapsed");
    toggleButton.style.display = "none";
    collapseButton.style.display = "block";
  } else {
    // Hide the sidebar and "X" button, show the "Toggle Sidebar" button
    sidebar.classList.add("collapsed");
    mainContent.classList.add("collapsed");    
    tableContainer.classList.add("collapsed");
    toggleButton.style.display = "block";
    collapseButton.style.display = "none";
  }
}
