const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "4T8frEWNxfFW6X1Il3EJJ9?si=e93bb18f94d84a34";
const container = document.querySelector('div[data-js="tracks"]');

const GENIUS_API_TOKEN = 'tA_GEr3psVjp8HxJ0Q6UQ7kzLFHQbZ_wgrMIGYhfPcGB94VBTCBlsOkrE8XXn5jW';

let currentTrackIndex = 0;
let tracks = [];

async function fetchLyrics(songTitle, artistName) {
  // Fetch lyrics implementation
}

function fetchPlaylist(token, playlistId) {
  fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tracks && data.tracks.items) {
        tracks = data.tracks.items;
        displayTrack(currentTrackIndex);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayTrack(index) {
  container.innerHTML = '';

  if (index >= 0 && index < tracks.length) {
    const item = tracks[index];
    const trackDiv = document.createElement('div');
    trackDiv.classList.add('track-container'); // Updated to track-container

    const trackDetailsDiv = document.createElement('div');
    trackDetailsDiv.classList.add('track-details');
    trackDetailsDiv.innerHTML = `
      <p>${item.track.name} by ${item.track.artists.map(artist => artist.name).join(", ")}</p>
      ${item.track.preview_url ? `<audio controls src="${item.track.preview_url}"></audio>` : "<p>No preview available</p>"}
      <div class="navigation-buttons">
        <button id="prev-btn">Previous</button>
        <button id="next-btn">Next</button>
      </div>
    `;

    trackDiv.appendChild(trackDetailsDiv);

    if (item.track.album.images[0]) {
      const img = document.createElement('img');
      img.classList.add('albumImage');
      img.src = item.track.album.images[0].url;
      trackDiv.appendChild(img);
    } else {
      trackDiv.innerHTML += "<p>No Image available</p>";
    }

    container.appendChild(trackDiv);

    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentTrackIndex > 0) {
        currentTrackIndex--;
        displayTrack(currentTrackIndex);
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
        displayTrack(currentTrackIndex);
      }
    });
  }
}

function fetchAccessToken() {
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.access_token) {
        fetchPlaylist(data.access_token, PLAYLIST_ID);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

fetchAccessToken();
