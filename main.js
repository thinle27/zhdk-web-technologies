const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "4T8frEWNxfFW6X1Il3EJJ9?si=e93bb18f94d84a34";
const container = document.querySelector('div[data-js="tracks"]');

let currentTrackIndex = 0;
let tracks = [];
let lyricsData = [];

fetch('genius.json')
  .then(response => response.json())
  .then(data => {
    lyricsData = data.lyrics;
    fetchAccessToken();
  })
  .catch(error => console.error('Error fetching lyrics:', error));

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
    trackDiv.classList.add('track-container');

    const trackDetailsDiv = document.createElement('div');
    trackDetailsDiv.classList.add('track-details');
    trackDetailsDiv.innerHTML = `
      <div class="containerLeft">
        <div class="track-details">
          <h1>${item.track.name}</h1>
          <p>by ${item.track.artists.map(artist => artist.name).join(", ")}</p>
        </div>
        <div class="navigation-buttons">
          <button id="prev-btn"><i class="fas fa-chevron-left"></i></button>
          ${item.track.preview_url ? `<audio controls src="${item.track.preview_url}"></audio>` : "<p>No preview available</p>"}
          <button id="next-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
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

    const containerLeft = document.querySelector('.containerLeft');
    if (containerLeft) {
      // Display lyrics for the current track in the background of containerLeft
      const lyricsIndex = index;
      if (lyricsData[lyricsIndex]) {
        containerLeft.style.backgroundImage = `url(data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px;color:gray;">${lyricsData[lyricsIndex]}</div></foreignObject></svg>`)})`;
        containerLeft.style.backgroundSize = "cover";
      } else {
        containerLeft.style.backgroundImage = '';
      }
    } else {
      console.error('Error: .containerLeft element not found.');
    }

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

// Start the process by fetching the access token
fetchAccessToken();
