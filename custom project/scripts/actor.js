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

var position = 0;
var userName = "";
var canMove = true;

// a situation is an array pair of two functions
// the first will be executed when the situation is encountered
// the second will be called with actionInfo as parameter, returning a function
var situation = null;

// This defines -the game-
function respond(info){
    console.log(info);

    // - Here are global commands -

    // Global move command
    if(info.verb == "move"){

        if(info.direction == "impossible")
        return () => {
            write([
                "You cannot go that way, " + userName + ".",
                "Your only choice is to move forward.",
                "You are unable to turn around.",
                "You know there is no going back.",
                "Really. Don't go back now.",
                "Going back is not an option, " + userName + ".",
            ], "pink");
        };
        if(canMove){
            // Change situation
            situation = situations[position % situations.length];

            position++;

            return () => {
                write([
                    "The air gets thicker as you move ahead.",
                    "You strave along the gray concrete walls.",
                    "You squeeze yourself through the narrow gap between those high walls.",
                    "You slowly move ahead in the narrow corridor.",
                    "Your jurney through the gap continues, " + userName + ".",
                    "You progress on your way through this tunnel.",
                    "You move ahead. One step closer. No end in sight.",
                    "As your flashlight flickers, you move on, one step.",
                    "Deep echoes reflect your movement. Your heart beats at normal pace.",
                    "This walk is going on forever now. You must be determined as you take one more step.",
                    "Nothing seems to hold you back as you sneak forward.",
                    "You tell yourself that you can make it. You move on. One step.",
                    "You don't remember how you landed here. But it doesn't matter. You go on.",
                    "No sunlight is shining through the gap above you as you take one more step.",
                ], "pink");

                if(situation)
                    situation[0]();
            };
        } else {
            return () => {
                write([
                    "You struggle to progress, as there is something in your way.",
                    "Seems like you can't move on now. Your way is blocked.",
                    "Impossible. You won't fit through this.",
                    "There is no way to progress. Climbing is not an option.",
                    "An obstacle blocks your path. There is no way to move around it.",
                    "Something stops you from moving on. Try something different.",
                    "You cannot progress, " + userName + ". Something is in your way.",
                ], "pink");
            };
        }
    }
    
    // Global look command
    if(info.verb == "look") {
        if(info.object == "bag"){
            return () => {
                write([
                    "You take a look at the contents of your bag:",
                    "You glance at the interior of your bag:",
                    "You open your bag to see what's inside:",
                    "You observe what's in your bag:",
                ]);

                // Convert inventory to readable string
                var contents = "";
                for(var item in inventory){
                    const itemName = item.charAt(0).toUpperCase() + item.slice(1);
                    contents += itemName + ": " + inventory[item] + "<br>";
                }

                write(contents, "green");
            };
        }
    }

    // Global write command
    if(info.verb == "write"){
        if(info.object == "book"){
            return () => {    
                var page = "page " + (state.bookPage + 1);
                switch(state.bookPage + 1){
                    case 1: page = "first"; break;
                    case 2: page = "second"; break;
                    case 3: page = "third"; break;
                    case 4: page = "fourth"; break;
                    case 5: page = "fifth"; break;
                }
                if(state.bookPage < 5)
                    page = "the " + page + " page";
                
                ask(() => {
                    write("Please type the text you want to write into the book.")
                }, (text) => {
                    text = text.trim();

                    if(text && text != ""){
                        state.bookText[state.bookPage] += text;
                        write("You write '"+text+"' onto " + page + " of the notebook.");
                    } else {
                        write("You decide not to write anything.");
                    }
                    return true;
                });
    
    
            };
        }
        if(!info.object){
            return () => {
                write("Please also specify what you would want to write to.");
            }
        }
    }

    // If nothing was found to do, look at the current situation.
    if(situation){
        const ret = situation[1](info);
        if(ret) {
            return ret;
        }
    }

    // The command did not result in any consequence
    return () => {
        write([
            "I do only understand very simple sentences. Please try again.",
            "I can only understand the simplest of phrases. Try again.",
            "Your demands seem unclear.", 
            "Say that again, but slowly.", 
            "You may have to rephrase that.",
            "I cannot understand your request.",
            "Pick something else to do. Like... anything.",
            "Please try something else. I do not understand what you mean.",
            "Whatever you demand may not be applicable in your current situation.",
        ]);
    };

};

// Your inventory
const inventory = {};

// Define an active state for situations that require it
const state = {
    coinAvailable: true,
    bookAvailable: true,
    bookPage: -1,
    bookText: [],
}

// Define situations
const situations = [
    [ // Situation 1: Coin
        () => { 
            write([
                "There is something shiny in front of you.",
                "Something golden lies in front of you.",
                "A coin lies on the floor in front of you.",
                "Something shiny lies on the gray concrete floor.",
            ]);
        },
        (info) => {
            if(info.verb == "take"){
                if(state.coinAvailable){
                    state.coinAvailable = false;
                    inventory.coins++;
                    return () => {
                        write([
                            "You take it. It's a golden coin. You store it in your bag.",
                            "You take the gold coin and keep it.",
                            "You pick it up. It's a real gold coin. You put it into your bag.",
                        ]);
                    }
                } else {
                    return () => { write("There is nothing there to take."); } 
                }
            } else if(info.verb == "look"){
                if(state.coinAvailable){
                    return () => { write("You take a closer look. It seems to be a golden coin.") };
                } else {
                    return () => { write("There is nothing there to see."); } 
                }
            }
        },
    ],

    [ // Situation 2: Notebook
        () => { 
            write([
                "A book with a leather cover lies in front of you.",
                "Your flashlight reveals a book lying next to you on the coldish floor.",
                "Something dusty lies on the gray concrete floor.",
            ]);
        },
        (info) => {
            if(info.verb == "take"){
                if(state.bookAvailable){
                    state.bookAvailable = false;
                    state.bookPage = 0;
                    inventory.notebooks++;
                    return () => {
                        write([
                            "You take the two items. A notebook and a pen. You put them into your bag.",
                            "You take the notebook. With it the pen that was lying next to it. In the bag it goes.",
                            "You pick up the things on the floor. The notebook is full of dust and the pen is rusty. You take them with you.",
                        ]);
                    }
                } else {
                    return () => { write("There is nothing there to take."); } 
                }
            } else if(info.verb == "look"){
                if(state.bookAvailable){
                    return () => { write("You take a closer look. It seems to be a notebook and a pen.") };
                } else {
                    return () => { write("There is nothing there to see."); } 
                }
            }
        },
    ],


];

// This defines what happens at the start of the game
function init(){
    ask(() => {
            write([
                "Please tell me your name.", 
                "Hey. What's your name?",
                "Hello. Please tell me what you want to be called.",
                "Hey. Tell me your name, please.",
            ]); 
        }, (name) => {
            name = name.charAt(0).toUpperCase() + name.slice(1);
            userName = name;

            // TODO: shuffle situations

            write([
                "Welcome, " + name + ".",
                "Greetings, " + name + ".",
                "Hello " + name + ".",
            ]);

            write([
                "You are in a narrow corridor. You may move ahead.",
                "You are pressed against two walls. Try pushing yourself ahead.",
                "Your flashlight enlightens your way through an enclosed corridor.",
            ], "pink");
            return true;
        }
    );

}

export {perform, init};
