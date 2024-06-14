const SPOTIFY_CLIENT_ID = "67b411e20d594f30bf7a8d3bbde54285";
const SPOTIFY_CLIENT_SECRET = "161fc5e3df004b95af3ba8c62f3eaf54";
const PLAYLIST_ID = "4T8frEWNxfFW6X1Il3EJJ9?si=e93bb18f94d84a34";
const container = document.querySelector('div[data-js="tracks"]');

let currentTrackIndex = 0;
let tracks = [];
let lyricsData = [];
let audio = new Audio();

fetch('genius.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('json-container');
    container.textContent = JSON.stringify(data, null, 2); // Format with 2 spaces
  })
  .catch(error => console.error('Error fetching JSON:', error));


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
          <button id="play-btn"><i class="fas fa-play"></i></button>
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

    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', () => togglePlayback(item.track.preview_url));

    document.getElementById('prev-btn').addEventListener('click', () => {
      stopPlayback();
      if (currentTrackIndex > 0) {
        currentTrackIndex--;
        displayTrack(currentTrackIndex);
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      stopPlayback();
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

function togglePlayback(previewUrl) {
  if (audio.paused) {
    if (previewUrl) {
      audio.src = previewUrl;
      audio.play();
      document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
    }
  } else {
    audio.pause();
    document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
  }
}

function stopPlayback() {
  audio.pause();
  audio.currentTime = 0;
  document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
}

// Start the process by fetching the access token
fetchAccessToken();
