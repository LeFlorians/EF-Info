import decode from "./action_decoder.js";

// Functions to write text or show an image by url as answer
import {write, show, ask} from "./responder.js"; 

// Does something based on an input message
// Returns a function that will be executed as answer
function perform(command){
    // decode a command to useful information. see action_decoder.js
    const info = decode(command);

    // Ask game what to do based on info
    const response = respond(info);

    return response;

}

const inventory = [];
const position = {x: 0, y: 0};
var userName = "";

function respond(info){

    console.log(info);

    if(info.verb == "move"){
        if(info.direction == "impossible")
        return () => {
            write([
                "You cannot go that way, " + userName + ".",
                "Your only choice is to move forward.",
                "You are unable to turn around.",
            ]);
        };
        return () => {
            write("you move ahead")
        };
    }

};

// This is what starts the game
function init(){
    ask(() => { write("Please tell me your name."); }, (name) => {
        userName = name;
        write("Welcome, " + name + ".");

        write("You are in a narrow corridor. Your only choice is to move ahead.");
        return true;
    });

}

export {perform, init};

// Define map data:

