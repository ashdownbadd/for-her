const sassLines = [
    "Nov 21, 2023 was the start. I’m not letting you end this that easily! ✋",
    "Every second since 2023 counts. Why would you want to lose one? 🥺",
    "Error 404: 'Stop' button not found. Love is infinite. ❤️",
    "I've been running for 19,000+ hours. I’m a marathon runner, not a quitter! 🏃‍♂️",
    "Nice try! But this timer has a 'forever' clause in the contract. 📝"
];

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

    const randomLine = sassLines[Math.floor(Math.random() * sassLines.length)];
    toast.textContent = randomLine;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

export function initClockButtons() {
    const resetBtn = document.querySelector('.stopwatch__button--lap');
    const stopBtn = document.querySelector('.stopwatch__button--stop');

    if (resetBtn) resetBtn.onclick = showSassyToast;
    if (stopBtn) stopBtn.onclick = showSassyToast;
}