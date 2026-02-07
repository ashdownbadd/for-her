let messageAnimationTimeouts = [];

export function openMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (!app) return;

    app.classList.add('active');

    const bubblesContainer = app.querySelector('.messages-app__bubbles');
    if (!bubblesContainer) return;

    const bubbles = Array.from(bubblesContainer.querySelectorAll('.bubble'));

    // Clear previous animation state
    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];
    bubbles.forEach(b => b.classList.remove('bubble--visible'));

    if (!bubbles.length) return;

    // Animate conversation in, slower so it feels like received messages
    const baseDelay = 800;
    const stepDelay = 900;
    const lastExtraDelay = 800;

    bubbles.forEach((bubble, index) => {
        const isLast = index === bubbles.length - 1;
        const delay = baseDelay + index * stepDelay + (isLast ? lastExtraDelay : 0);

        const timeoutId = setTimeout(() => {
            // Only apply if the messages app is still open
            if (app.classList.contains('active')) {
                bubble.classList.add('bubble--visible');
            }
        }, delay);

        messageAnimationTimeouts.push(timeoutId);
    });
}

export function closeMessagesApp() {
    const app = document.getElementById('messages-app-overlay');
    if (app) {
        app.classList.remove('active');

        const bubbles = app.querySelectorAll('.bubble');
        bubbles.forEach(b => b.classList.remove('bubble--visible'));
    }

    messageAnimationTimeouts.forEach(clearTimeout);
    messageAnimationTimeouts = [];
}

