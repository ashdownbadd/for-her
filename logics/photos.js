export function openPhotosApp() {
    const app = document.getElementById('photos-app-overlay');
    if (app) {
        app.classList.add('active');
        renderLibrary();
    }
}

export function closePhotosApp() {
    const app = document.getElementById('photos-app-overlay');
    if (app) {
        app.classList.remove('active');
    }
}

export function openPhotoViewer(imageSrc) {
    const viewer = document.getElementById('photo-viewer');
    const fullImg = document.getElementById('full-photo');

    if (viewer && fullImg) {
        fullImg.src = imageSrc;
        viewer.classList.add('active');
    }
}

export function closePhotoViewer() {
    const viewer = document.getElementById('photo-viewer');
    if (viewer) {
        viewer.classList.remove('active');
    }
}

function renderLibrary() {
    const grid = document.getElementById('photos-grid');

    if (!grid || grid.children.length > 0) {
        return;
    }

    const images = [
        'assets/img/pfp.jpg',
        'assets/img/pfp.jpg',
        'assets/img/pfp.jpg'
    ];

    images.forEach(src => {
        const item = document.createElement('div');
        item.className = 'photos-app__item';
        item.onclick = () => openPhotoViewer(src);
        item.innerHTML = `<img src="${src}" loading="lazy">`;
        grid.appendChild(item);
    });
}