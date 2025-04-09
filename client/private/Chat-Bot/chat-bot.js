let chatBubble = document.getElementById("chat-bubble");
let chatContainer = document.getElementById("chat-container");
let chatWrapper = document.getElementById("chat-wrapper");
let btn = document.getElementById("btn");
let content = document.getElementById("chat-container");
let messageInput = document.getElementById("message-input");
let suggestionsContainer = document.getElementById("suggestions");

// Toggle Chat Window 
chatBubble.addEventListener("click", function () {
    chatWrapper.style.display = chatWrapper.style.display === "none" ? "flex" : "none";
});

btn.addEventListener("click", async function () {
    if (messageInput.value === "") {
        return;
    }

    const div = document.createElement("div");
    div.classList.add("user-message");
    div.innerHTML = messageInput.value;
    chatContainer.appendChild(div);

    const div2 = document.createElement("div");
    div2.classList.add("bot-message");
    div2.innerHTML = "Loading...";
    chatContainer.appendChild(div2);

    const res = await fetch(window.location.origin + "/private/api/gemini/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: messageInput.value })
    });

    const data = await res.json();
    div2.innerHTML = data.response;

    chatWrapper.scrollTop = chatWrapper.scrollHeight;
    messageInput.value = "";
    fetchResponse(message);
});