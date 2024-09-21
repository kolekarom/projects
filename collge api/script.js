// Form submission handler
document.getElementById('college-search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally

    // Get the country input value
    const country = document.getElementById('country-name').value;

    // Fetch data from the Universities API (no API key required)
    fetch(`http://universities.hipolabs.com/search?country=${country}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Function to display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No colleges found.</p>';
        return;
    }

    // Display each result
    results.forEach(college => {
        const collegeElement = document.createElement('div');
        collegeElement.classList.add('college');
        collegeElement.innerHTML = `
            <h3>${college.name}</h3>
            <p>Country: ${college.country}</p>
            <p>Website: <a href="${college.web_pages[0]}" target="_blank">${college.web_pages[0]}</a></p>
        `;
        resultsContainer.appendChild(collegeElement);
    });
}
