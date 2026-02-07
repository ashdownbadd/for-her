let messageAnimationTimeouts = [];

const wait = (ms) => new Promise(resolve => {
    const timeoutId = setTimeout(resolve, ms);
    messageAnimationTimeouts.push(timeoutId);
});

function updateMessageTimestamp(appElement) {
    const dateElement = appElement.querySelector('.messages-app__date');
    if (!dateElement) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    dateElement.textContent = `Today ${hours}:${minutes} ${ampm}`;
}

export async function openMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (!app) return;

    app.classList.add('active');
    updateMessageTimestamp(app);

    const bubblesContainer = app.querySelector('.messages-app__bubbles');
    const dateElement = app.querySelector('.messages-app__date');

    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];

    dateElement?.classList.remove('messages-app__date--visible');

    const bubbles = Array.from(bubblesContainer.querySelectorAll('.bubble'));
    bubbles.forEach(b => {
        b.classList.remove('bubble--visible');
        b.style.display = 'none';
    });

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'bubble bubble--incoming bubble--typing active';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;

    let isFirstMessage = true;

    for (const bubble of bubbles) {
        if (!app.classList.contains('active')) break;

        if (bubble.classList.contains('bubble--incoming')) {
            bubble.style.display = 'block';
            bubblesContainer.insertBefore(typingIndicator, bubble);

            await wait(1800);
            typingIndicator.remove();

            if (isFirstMessage) {
                dateElement?.classList.add('messages-app__date--visible');
                isFirstMessage = false;
            }
        } else {
            await wait(600);
            bubble.style.display = 'block';
        }

        bubble.classList.add('bubble--visible');
        await wait(1200);
    }
}

export function closeMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (app) {
        app.classList.remove('active');

        const bubbles = app.querySelectorAll('.bubble');
        bubbles.forEach(b => {
            b.classList.remove('bubble--visible');
            b.style.display = 'none';
        });

        const typing = app.querySelector('.bubble--typing');
        if (typing) typing.remove();

        const dateElement = app.querySelector('.messages-app__date');
        dateElement?.classList.remove('messages-app__date--visible');
    }

    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];
}