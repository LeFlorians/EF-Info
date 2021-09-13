const inputField = document.getElementById("in");
const recommendationField = document.getElementById("rec");
const outputBox = document.getElementById("output-text");

const commands = {
    "sali": "Moin Meister!",

}

const autocomplete = Object.keys(commands);

function submit(text) {
    const answer = commands[text];
    if(answer){
        out(answer);
    } else {
        out("I did not understand your query.")
    }
}

function out(text) {
    outputBox.innerText += "\n" + text;
}

inputField.addEventListener("keydown", e => {
    const text = inputField.value;
    const recommend = autocomplete.filter(x => x.startsWith(text))[0];
    if(e.key == "Enter"){
        inputField.value = "";
        submit(text);
    } else if(e.key == "ArrowRight"){
        if(recommend) {
            inputField.value = recommend;
        }
    }
    
    if(recommend){
        recommendationField.value = recommend;
    } else {
        recommendationField.value = "";
    }

});