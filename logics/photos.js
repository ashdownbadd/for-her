let currentImages = ['assets/img/image-one.jpg', 'assets/img/image-two.jpg', 'assets/img/image-three.jpg'];
let currentIndex = 0;
let startX = 0;

export function openPhotosApp() {
    const app = document.getElementById('photos-app-overlay');
    if (app) {
        app.classList.add('active');
        renderLibrary();
    }
}

export function closePhotosApp() {
    const app = document.getElementById('photos-app-overlay');
    if (app) app.classList.remove('active');
}

function renderLibrary() {
    const grid = document.getElementById('photos-grid');
    if (!grid || grid.children.length > 0) return;

    currentImages.forEach(src => {
        const item = document.createElement('div');
        item.className = 'photos-app__item';
        item.onclick = () => openPhotoViewer(src);
        item.innerHTML = `<img src="${src}" loading="lazy">`;
        grid.appendChild(item);
    });
}

export function openPhotoViewer(imageSrc) {
    const viewer = document.getElementById('photo-viewer');
    const slider = document.getElementById('photo-slider');
    if (!viewer || !slider) return;

    // Generate slider images if not already there
    if (slider.children.length === 0) {
        slider.innerHTML = currentImages.map(src => `<img src="${src}" class="slider-img" />`).join('');
    }

    currentIndex = currentImages.indexOf(imageSrc);
    updateSlider(false); // Snap without animation
    viewer.classList.add('active');

    // Event Listeners
    window.addEventListener('keydown', handleKeyPress);
    viewer.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewer.addEventListener('touchend', handleTouchEnd);
}

export function closePhotoViewer() {
    const viewer = document.getElementById('photo-viewer');
    if (viewer) viewer.classList.remove('active');
    window.removeEventListener('keydown', handleKeyPress);
}

function updateSlider(animate = true) {
    const slider = document.getElementById('photo-slider');
    if (!slider) return;
    slider.style.transition = animate ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function handleKeyPress(e) {
    if (e.key === 'ArrowRight' && currentIndex < currentImages.length - 1) {
        currentIndex++;
        updateSlider();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        updateSlider();
    } else if (e.key === 'Escape') {
        closePhotoViewer();
    }
}

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < currentImages.length - 1) currentIndex++;
        else if (diff < 0 && currentIndex > 0) currentIndex--;
        updateSlider();
    }
}

// Global exposure for HTML buttons
window.openPhotoViewer = openPhotoViewer;
window.closePhotoViewer = closePhotoViewer;
window.openPhotosApp = openPhotosApp;
window.closePhotosApp = closePhotosApp;