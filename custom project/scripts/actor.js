import decode from "./action_decoder.js";

// Functions to write text or show an image by url as answer
import {write, show, ask} from "./responder.js"; 

// Position on 2D Map
const position = {x: 0, y: 0};

// Inventory contents
const inventory = {};

const commands = {
    "sali": () => write("Moin Meister!"),
    "ask me": () => ask(() => write("How old are you?"), (res) => {write(res+" years old?"); return true;}),
    "show me that body": () => show("https://sun9-69.userapi.com/impf/c846019/v846019001/1056e3/-HXpleWy4Z0.jpg?size=604x604&quality=96&sign=da46ee75ea91b16d5feaeb13f143e2ec&type=album"),
    "show me that brazilian heat": () => write("wanna see more?"),
    "absolutely!": () => show("https://larepublica.pe/resizer/5dZl09v_mc7tcMMew-HNXLFaiYA=/1250x735/top/smart/arc-anglerfish-arc2-prod-gruporepublica.s3.amazonaws.com/public/CZQUNKUF2ZG3FIBVDECWL6CORI.png"),

}

// Does something based on an input message
// Returns a function that will be executed as answer
function perform(command){
    // decode a command to useful information. see action_decoder.js
    const info = decode(command);

    const response = commands[command];
    return response;

}

export default perform;
