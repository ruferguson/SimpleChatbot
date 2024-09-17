document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-button').addEventListener('click', sendMessage);
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    appendMessage('user', userInput);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer API-KEY-HERE'
        },
        body: JSON.stringify({
            model: 'gpt3.5-turbo',
            messages: [
                { role: 'system', content: 'You are an unhelpful assistant.'},
                { role: 'user', content: userInput}
            ],
            max_tokens: 150
        })
    });
    
    if (response.ok) {
        const data = await response.json();
        const botReply = data.choices[0].text.trim();
        appendMessage('bot', botReply);
    } else {
        appendMessage('bot', 'Error: Unable to fetch response from the server.');
    }
    document.getElementById('user-input').value = '';
}

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('chatBox element not found.');
        return;
    }
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
