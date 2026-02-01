const radioAudio = document.getElementById('radio-audio');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('audio-progress');
const songTitle = document.getElementById('song-title');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');

function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Function to update the UI with song info
function updateSongInfo() {
    if (radioAudio.duration) {
        durationEl.textContent = formatTime(radioAudio.duration);
    }
    const fileName = radioAudio.src.split('/').pop();
    // Use decodeURIComponent in case there are spaces (%20) in the filename
    const cleanName = decodeURIComponent(fileName).replace('.mp3', '').toUpperCase();
    songTitle.textContent = cleanName || "UNKNOWN TRACK";
}

// 1. Listen for metadata loading
radioAudio.addEventListener('loadedmetadata', updateSongInfo);

// 2. IMMEDIATE CHECK: If browser cached the audio, metadata is already there
if (radioAudio.readyState >= 1) {
    updateSongInfo();
}

// Sync progress bar and time
radioAudio.addEventListener('timeupdate', () => {
    if (!radioAudio.duration) return;
    const progress = (radioAudio.currentTime / radioAudio.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(radioAudio.currentTime);
});

export function openRadioUI() {
    const wrapper = document.getElementById('radio-wrapper');
    if (!wrapper) return;

    wrapper.style.display = 'flex';
    setTimeout(() => {
        wrapper.classList.add('active');
    }, 10);

    const radioAudio = document.getElementById('radio-audio');
    radioAudio.play().then(() => {
        if (typeof window.targetOpacity !== 'undefined') {
            window.targetOpacity = 0.8;
        }
    }).catch(e => console.log("Playback blocked until interaction"));
}

export function toggleRadioPlay() {
    const radioAudio = document.getElementById('radio-audio');
    const playIcon = document.getElementById('play-icon');

    if (radioAudio.paused) {
        radioAudio.play();
        playIcon.className = 'fa-solid fa-pause';
        window.targetOpacity = 0.8;
    } else {
        radioAudio.pause();
        playIcon.className = 'fa-solid fa-play';
        window.targetOpacity = 0;
    }
}

// Fixed close function - Unified into one
window.closeRadioUI = () => {
    const wrapper = document.getElementById('radio-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('active');

    // Fade out hearts when closing
    if (typeof window.targetOpacity !== 'undefined') window.targetOpacity = 0;

    setTimeout(() => {
        wrapper.style.display = 'none';
    }, 500);
};

window.seekAudio = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    radioAudio.currentTime = (x / rect.width) * radioAudio.duration;
};

window.toggleRadioPlay = toggleRadioPlay;