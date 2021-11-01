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

function respond(actionInfo){


};

function init(){
    ask(() => {write("Please tell me your name.");}, (name) => {
        write("Welcome, " + name + ".");

        write("you are so hot");

        return true;
    });

}

export {perform, init};
