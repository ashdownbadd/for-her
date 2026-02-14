let messageAnimationTimeouts = [];
let firstOpenTime = null;

const wait = (ms) => new Promise(resolve => {
    const timeoutId = setTimeout(resolve, ms);
    messageAnimationTimeouts.push(timeoutId);
});

function updateMessageTimestamp(appElement, timeToUse) {
    const dateElement = appElement.querySelector('.messages-app__date');
    if (!dateElement) return;

    let hours = timeToUse.getHours();
    const minutes = timeToUse.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    dateElement.textContent = `Today ${hours}:${minutes} ${ampm}`;
}

export function closeMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (app) app.classList.remove('active');

    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];

    const typingUI = document.querySelector('.bubble--typing');
    if (typingUI) typingUI.remove();
}

export async function openMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (!app) return;

    app.classList.add('active');

    if (!firstOpenTime) {
        firstOpenTime = new Date();
    }

    updateMessageTimestamp(app, firstOpenTime);

    const backButton = app.querySelector('.messages-app__back');
    if (backButton) {
        backButton.onclick = () => closeMessagesApp();
    }

    const bubblesContainer = app.querySelector('.messages-app__bubbles');
    const dateElement = app.querySelector('.messages-app__date');
    const bubbles = Array.from(bubblesContainer.querySelectorAll('.bubble'));

    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'bubble bubble--incoming bubble--typing active';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    for (const bubble of bubbles) {
        if (!app.classList.contains('active')) return;

        if (bubble.classList.contains('bubble--visible')) {
            bubble.style.display = 'block';
            dateElement?.classList.add('messages-app__date--visible');
            continue;
        }

        if (bubble.classList.contains('bubble--incoming')) {
            bubble.style.display = 'block';
            bubblesContainer.insertBefore(typingIndicator, bubble);

            await wait(1800);
            typingIndicator.remove();

            if (!dateElement?.classList.contains('messages-app__date--visible')) {
                dateElement?.classList.add('messages-app__date--visible');
            }
        } else {
            await wait(600);
            bubble.style.display = 'block';
        }

        if (!app.classList.contains('active')) return;

        bubble.classList.add('bubble--visible');
        await wait(1200);
    }
}