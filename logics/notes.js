export function openNotesApp() {
    const app = document.getElementById('notes-app-overlay');
    if (app) {
        app.classList.add('active');
    }
}

export function closeNotesApp() {
    const app = document.getElementById('notes-app-overlay');
    if (app) {
        app.classList.remove('active');
    }
}

