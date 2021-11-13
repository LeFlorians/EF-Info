import { perform, init } from "./actor.js";
const inputField = document.getElementById("in");
const outputBox = document.getElementById("output-text");

// Writes text. If an array is passed, one random string is printed
// Second argument is text color (optional)
function write(text, color=undefined) {
    var msg = text;
    if(Array.isArray(text)){
        msg = text[Math.floor(Math.random() * text.length)];
    }
    if(color){
        loadMessage("<p class=\"response\" style=\"color:"+color+";\">" + msg + "</p>");
    } else {
        loadMessage("<p class=\"response\">" + msg + "</p>");
    }
}

// Show an image
function show(url){
    loadMessage("<img class=\"msg\" src=\"" + url + "\"></img>");
}


/*
    Documentation of ask

    blocks the next command and returns it as parameter to given callback function

    parameters:
        question: function without parameters, executed when asked
        callback: function with one parameter (answer given), executed when answered, returns true if callback should be removed
*/
var askCallback;
function ask(question, callback){
    // define callback
    askCallback = callback;

    // ask question
    question();
}


// Not to write multiple messages at the same time
const _outputQueue = [];
var _loading = false;

function loadMessage(text){

    _outputQueue.push(() => {
        // Create a temporary loading element
        var temp = document.createElement("img");
        temp.src = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif";
        temp.className = "loading";
        outputBox.appendChild(temp);

        // Replace temp with actual message
        setTimeout(() => {
            temp.remove();
            outputBox.innerHTML += text;

            _loading = false;
            _load();

            new Audio("res/receive_sound.mp3").play();

            autoscroll();
        }, Math.random() * 500 + 700);
    });

    // start writing messages
    if(!_loading)
        _load();


}

function _load() {
    var action = _outputQueue.shift();
    if(action){
        _loading = true;
        action();
    }
};



function submit(text) {
    // Append message from self
    outputBox.innerHTML += "<p class=\"query\">" + text + "</p>";
    new Audio("res/send_sound.mp3").play();

    autoscroll();
    // Check if question is being asked
    if(askCallback){
        if(askCallback(text)) {
            // Remove askCallback
            askCallback = undefined;
        }
    } else {
        // Execute the response function
        perform(text)();
    }
}

inputField.addEventListener("keypress", e => {
    if(e.key == "Enter" && inputField.value.trim() != ""){
        const text = inputField.value.trim();

        submit(text);
        inputField.value = "";
    }
});

// Function to automatically scroll down
function autoscroll() {
    setTimeout(() => {
        outputBox.scrollTop = outputBox.scrollHeight; 
    }, 100);
}

// Ask actor to start the game
init();

// Export the 3 methods to provide user interaction for actor.js
export {write, show, ask};