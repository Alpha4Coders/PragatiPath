var chatBubble = document.querySelector("#chat-bubble");
var chatWrapper = document.querySelector("#chat-wrapper");
var btn = document.querySelector("#btn");
var content = document.querySelector("#chat-container");
var messageInput = document.querySelector("#message-input");
var suggestionsContainer = document.querySelector("#suggestions");
// Toggle Chat Window (Show/Hide Chat)
chatBubble.addEventListener("click", function () {
    chatWrapper.style.display = chatWrapper.style.display === "none" ? "flex" : "none";
});