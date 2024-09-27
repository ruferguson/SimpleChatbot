document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('send-button').addEventListener('click', sendMessage);
});

var input = document.getElementById("user-input");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("send-button").click();
  }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();

    if (!userInput) {
        return; // Prevent sending empty messages
    }
    appendMessage('user', userInput);

    const apiKey = 'API_HERE'; // Replace with your actual API key

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const data = {
        contents: [
            {
                parts: [
                    { text: userInput }
                ]
            }
        ],
        safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
        ],
        generationConfig: {
            temperature: 0.5, // controls the randomness, higher = creative, lower = deterministic, range: [0.0, 2.0]
            maxOutputTokens: 200,
            topP: 0.8, // default is 0.95, tokens are selected from the most to least probable until the sum of their probabilities equals the topP value.
            topK: 10 // changes how the model selects tokens for output.
        }
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
        const parsedReply = marked.parse(botReply); // Parse bot's Markdown response
        appendMessage('bot', parsedReply, true);
    } else {
        appendMessage('bot', 'Error: Unable to fetch response from the server.');
    }
    document.getElementById('user-input').value = '';
    
}

function appendMessage(sender, message, isMarkdown = false) {
    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('chatBox element not found.');
        return;
    }
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    if (isMarkdown) {
        messageDiv.innerHTML = message; // Append parsed HTML (Markdown)
    } else {
        messageDiv.textContent = message; // Append plain text (for user)
    }
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
