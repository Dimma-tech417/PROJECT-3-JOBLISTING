
const container = document.getElementById("job-container");
const filterContainer = document.createElement("div");
// filterContainer.id = "filterContainer";
filterContainer.classList.add("filter-container");
document.body.insertBefore(filterContainer, container);
const clearFiltersButton = document.getElementById("clear-filters");

let allJobs = []; // Store all jobs for filtering
// let selectedCategories = []

async function fetchData() {
    try {
        const res = await fetch("data.json");
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        allJobs = data; // Save fetched jobs
        displayData(allJobs);
    } catch (error) {
        console.error(error);
    }
}

fetchData();

// Function to display jobs
function displayData(jobs) {
    container.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div class="job-header">
                 <div class="company-logo">
                     <img src="${job.logo}" alt="Company Logo">
                 </div>
                 <div class="job-info">
                     <span class="company-name">${job.company}</span>
                     ${job.new ? `<span class="new">NEW!</span>` : ""}
                     ${job.featured ? `<span class="featured">FEATURED</span>` : ""}
                     <h2>${job.position}</h2>
                     <p class="job-meta">${job.postedAt} • ${job.contract} • ${job.location}</p>
                 </div>
             </div>
             <div class="job-tags">
                 ${[...job.languages, ...job.tools].map(tag => `<span class="tag">${tag}</span>`).join("")}
             </div>
         </div>
    `).join("");

    attachTagEventListeners();}


// Function to filter jobs 
function filterJobs(selectedCategories) {
    if (selectedCategories.length === 0) {
        filterContainer.innerHTML = "";
        displayData(allJobs); 
        return;
    }

    const filteredJobs = allJobs.filter(job => {
        const jobTags = [...job.languages, ...job.tools];
        return selectedCategories.every(tag => jobTags.includes(tag));
    });

    displayData(filteredJobs);
}

// Attach event listeners to job tags
function attachTagEventListeners() {
    document.querySelectorAll(".tag").forEach(tagElement => {
        tagElement.addEventListener("click", function () {
            const tag = this.textContent;
            if (!selectedCategories.includes(tag)) {
                selectedCategories.push(tag);
                updateFilterUI();
                filterJobs(selectedCategories);
            }
        });
    });
}

// User interface for selected filters
let selectedCategories = []; 
function updateFilterUI() {
    filterContainer.innerHTML = selectedCategories.map(tag => `
        <div class="remove-filter">
            ${tag} <button onclick="removeFilter('${tag}')">X</button>
        </div>
    `).join("");
 
    // Active states for Clear-filters
    if (selectedCategories.length > 0) {
        const clearButton = document.createElement("button");
        clearButton.id = "clear-filters";
        clearButton.textContent = "Clear";
        clearButton.addEventListener("click", function () {
            selectedCategories = [];
            updateFilterUI();
            displayData (allJobs);
            // filterJobs();
        });

        filterContainer.appendChild(clearButton);
    }    else if(selectedCategories.length === 0) {
        filterContainer.innerHTML = "";
    
    }

} 

//Function for remove filters
function removeFilter(tag) {
    selectedCategories = selectedCategories.filter(item => item !== tag);
    updateFilterUI();
    filterJobs();
}

