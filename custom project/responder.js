const inputField = document.getElementById("in");
const recommendationField = document.getElementById("rec");
const outputBox = document.getElementById("output-text");

const messageId = 0;

const commands = {
    "sali": () => respond("Moin Meister!"),
    "show me that body": () => show("https://sun9-69.userapi.com/impf/c846019/v846019001/1056e3/-HXpleWy4Z0.jpg?size=604x604&quality=96&sign=da46ee75ea91b16d5feaeb13f143e2ec&type=album"),
    "show me that brazilian heat": () => respond("wanna see more?"),
    "absolutely!": () => show("https://larepublica.pe/resizer/5dZl09v_mc7tcMMew-HNXLFaiYA=/1250x735/top/smart/arc-anglerfish-arc2-prod-gruporepublica.s3.amazonaws.com/public/CZQUNKUF2ZG3FIBVDECWL6CORI.png"),

}

const autocomplete = Object.keys(commands);

function respond(text) {
    loadMessage("<p class=\"response\">" + text + "</p>");
}

function show(url){
    loadMessage("<img class=\"msg\" src=\"" + url + "\"></img>");
}

function loadMessage(text){

    var temp = document.createElement("img");
    temp.src = "https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif";
    temp.className = "loading";
    outputBox.appendChild(temp);

    setTimeout(() => {
        temp.remove();
        outputBox.innerHTML += text;

        // outputBox.scrollIntoView(false);

        setTimeout(() => {
            outputBox.scroll({ top: outputBox.scrollHeight, behavior: 'smooth' });
        }, 5000);

    }, 1000);

}

function submit(text) {
    outputBox.innerHTML += "<p class=\"query\">" + text + "</p>";
    const answer = commands[text];
    if(answer){
        answer();
    } else {
        respond("I did not understand your query.");
    }
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