// Constants for Pexels API
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.pexels.com/videos/search';

// DOM Elements
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const videoGrid = document.getElementById('video-grid');

// Fetch videos from Pexels API
async function fetchVideos(query = 'nature') {
    try {
        const response = await fetch(`${BASE_URL}?query=${query}&per_page=9`, {
            headers: {
                Authorization: API_KEY
            }
        });
        const data = await response.json();
        renderVideos(data.videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
}

// Render videos to the DOM
function renderVideos(videos) {
    videoGrid.innerHTML = ''; // Clear previous videos

    videos.forEach(video => {
        const thumbnail = video.video_pictures[0].picture;
        const title = video.user.name;
        const videoUrl = video.video_files[0].link;

        const videoCard = document.createElement('div');
        videoCard.className = 'video';
        videoCard.innerHTML = `
            <a href="${videoUrl}" target="_blank">
                <img src="${thumbnail}" alt="${title}">
                <div class="video-title">${title}</div>
                <div class="video-info">Pexels Video</div>
            </a>
        `;
        videoGrid.appendChild(videoCard);
    });
}

// Search functionality
searchBtn.addEventListener('click', () => {
    const query = searchBar.value.trim();
    if (query) {
        fetchVideos(query);
    }
});

// Initial load of videos
fetchVideos();
