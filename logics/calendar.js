export function initCalendar() {
    const dayEl = document.getElementById('calendar-day');
    const dateEl = document.getElementById('calendar-date');
    const eventTitle = document.getElementById('event-title');
    const eventLocation = document.getElementById('event-location');
    const eventTime = document.getElementById('event-time');
    const indicator = document.querySelector('.widget__event-indicator');
    const widget = document.querySelector('.widget--calendar');

    if (!dayEl || !dateEl) return;

    const updateCalendar = () => {
        const now = new Date();
        const month = now.getMonth();
        const date = now.getDate();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        dayEl.textContent = dayNames[now.getDay()];
        dateEl.textContent = date;

        if (month === 1 && date === 14) {
            widget.classList.remove('widget--no-event');
            eventTitle.textContent = "Valentine's Day";
            eventTitle.style.color = "#FF2D55";
            eventLocation.textContent = "Home";
            eventTime.textContent = "All Day";

            if (indicator) {
                indicator.style.opacity = "1";
                indicator.style.background = "#FF2D55";
            }
        } else {
            widget.classList.add('widget--no-event');
            eventTitle.textContent = "No more events today";
            eventTitle.style.color = "#8e8e93";
            eventLocation.textContent = "";
            eventTime.textContent = "";

            if (indicator) {
                indicator.style.opacity = "0";
            }
        }
    };

    updateCalendar();
    setInterval(updateCalendar, 60000);
}