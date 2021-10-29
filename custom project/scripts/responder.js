import perform from "./actor.js";

const inputField = document.getElementById("in");
const recommendationField = document.getElementById("rec");
const outputBox = document.getElementById("output-text");

// Writes text. If an array is passed, one random string is printed
function write(text) {
    var msg = text;
    if(Array.isArray(text)){
        msg = text[Math.floor(Math.random() * text.length)];
    }
    loadMessage("<p class=\"response\">" + msg + "</p>");
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

function loadMessage(text){

    // Create a temporary loading element
    var temp = document.createElement("img");
    temp.src = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif";
    temp.className = "loading";
    outputBox.appendChild(temp);

    // Replace temp with actual message
    setTimeout(() => {
        temp.remove();
        outputBox.innerHTML += text;

    }, Math.random() * 500 + 700);

}



function submit(text) {
    // Append message from self
    outputBox.innerHTML += "<p class=\"query\">" + text + "</p>";

    // Check if question is being asked
    if(askCallback){
        if(askCallback(text)) {
            // Remove askCallback
            askCallback = undefined;
        }
    } else {
        // Execute the response function
        const res = perform(text);

        if(res) {
            res();
        } else {
            // Provide default answer
            write([
                "Your demands seem unclear.", 
                "Say that again, but slowly.", 
                "You may have to rephrase that."
            ]);
        }
    }
}

inputField.addEventListener("keypress", e => {
    if(e.key == "Enter"){
        const text = inputField.value;

        submit(text);
        inputField.value = "";
    }
});

// Export the 3 methods to provide user interaction for actor.js
export {write, show, ask};