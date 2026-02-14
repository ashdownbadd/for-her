const sassLines = [
    "?",
    "??",
    "???",
    "ba't mo i-stop? tagal na natin oh.",
    "tsk tsk!"
];

let toastTimeout;
let currentSassIndex = 0;

export function openClockApp() {
    document.getElementById('clock-app-overlay').classList.add('active');
}

export function closeClockApp() {
    const clockApp = document.getElementById('clock-app-overlay');
    if (clockApp) {
        clockApp.classList.remove('active');
    }
}

export function updateStopwatch() {
    const startDate = new Date('2023-11-21T00:00:00').getTime();
    const display = document.getElementById('stopwatch-time');

    if (!display) return;

    setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startDate;

        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const h = totalHours;
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');

        display.textContent = `${h}:${m}:${s}`;
    }, 1000);
}

export function showSassyToast() {
    const toast = document.getElementById('reset-denial-toast');
    if (!toast) return;

    clearTimeout(toastTimeout);

    const line = sassLines[currentSassIndex];
    currentSassIndex = (currentSassIndex + 1) % sassLines.length;

    toast.textContent = line;
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

export function initClockButtons() {
    const stopBtn = document.querySelector('.stopwatch__button--stop');

    if (stopBtn) {
        stopBtn.onclick = showSassyToast;
    }
}