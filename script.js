document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-button').addEventListener('click', sendMessage);
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    // if (userInput.trim() === '') return;

    appendMessage('user', userInput);

    const apiKey = 'MY_API_KEY'; // Replace with your actual API key

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const data = {
        contents: [
            {
                parts: [
                    { text: userInput }
                ]
            }
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (response.ok) { // check to see if the (response) fetch request was successful
        const responseData = await response.json();
        const botReply = responseData.candidates[0].content.parts[0].text;
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
