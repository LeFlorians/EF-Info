import decode from "./action_decoder.js";

// Functions to write text or show an image by url as answer
import {write, show, ask, autoscroll} from "./responder.js"; 

// Utility functions to deal with strings
import {amountToWord, indexToWord} from "./string_utils.js";

const outputBox = document.getElementById("output-text");

// Does something based on an input message
// Returns a function that will be executed as answer
function perform(command){
    // decode a command to useful information. see action_decoder.js
    const info = decode(command);

    // Ask game what to do based on info
    const response = respond(info);

    return response;

}

// This defines -the game-
function respond(info){
    console.log(info);

    // - Here are global commands -

    // Global help command
    if(info.object == "help" && (!info.verb || info.verb == "give")){
        // TODO: implement help command
    }

    // Global save command
    if(info.verb == "save" || (info.verb == "make" && info.object == "savestate")){
        const past = outputBox.innerHTML;
        const savestate = {
            state,
            past,
        }
        download("savestate.txt", JSON.stringify(savestate));

        // Return empty function as this should not be logged
        return () => {
            write("Your game has been saved.", "yellow");
        };
    }

    // Global load command
    if(((info.verb == "load") && (!info.object || info.object == "savestate"))
        || info.verb == "continue" && info.object == "savestate"){
        return () => {
            write([
                "To load your saved game, drag the savefile into the chat.",
            ], "yellow");
        };
    }

    

    // Global move command
    if(info.verb == "move"){

        if(info.direction == "impossible")
        return () => {
            write([
                "You cannot go that way, " + state.userName + ".",
                "Your only choice is to move forward.",
                "You are unable to turn around.",
                "You know there is no going back.",
                "Really. Don't go back now.",
                "Going back is not an option, " + state.userName + ".",
            ], "pink");
        };
        if(state.canMove){
            // Change situation
            state.position++;

            state.situation = situations[
                state.situation_order[state.position % state.situation_order.length] % situations.length];

            return () => {
                write([
                    "The air gets thicker as you move ahead.",
                    "You strave along the gray concrete walls.",
                    "You squeeze yourself through the narrow gap between those high walls.",
                    "You slowly move ahead in the narrow corridor.",
                    "Your jurney through the gap continues, " + state.userName + ".",
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

                if(state.situation && state.situation.init)
                state.situation.init()
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
                    "You cannot progress, " + state.userName + ". Something is in your way.",
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
                for(var item in state.inventory){
                    const amount = state.inventory[item];
                    if(amount > 0){
                        var amountName = amountToWord(amount);
                        var itemName = item;
                        if(amountName == "one" && itemName.endsWith("s"))
                            itemName = itemName.slice(0, -1);

                        amountName = amountName.charAt(0).toUpperCase() + amountName.slice(1);
                        contents += amountName + " " + itemName + "<br>";
                    }
                }

                if(contents == "")
                    contents = "Nothing...";

                write(contents, "green");
            };
        }
    }

    // Global write command
    if(info.verb == "write"){
        if(info.object == "book" && state.inventory.notebooks >= 1){

            if(state.inventory.pens < 1)
            return () => {
                write([
                    "You need a pen to write into your notebook.",
                    "You are unable to write anything as you are not in posession of a pen.",
                ])
            }

            return () => {    
                const page = state.bookPage + 1;
                var pageName = indexToWord(page);

                if(pageName.endsWith(".")){
                    pageName = "the " + pageName + " page";
                } else {
                    pageName = "page " + pageName;
                }
                
                ask(() => {
                    write("Please type the text you want to write into the book.")
                }, (text) => {
                    text = text.trim();

                    if(text && text != ""){
                        state.bookText[state.bookPage] += text;
                        write("You write '"+text+"' onto " + pageName + " of the notebook.");
                    } else {
                        write("You decide not to write anything.");
                    }
                    return true;
                });
    
    
            };
        }

        return () => {
            write("Please specify something you want to write onto.");
        }
    }

    // If nothing was found to do, look at the current situation.
    if(state.situation && state.situation.decide){
        const ret = state.situation.decide(info);
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

// State of the game used for saves
var state = {
    coinAvailable: true,
    bookAvailable: true,
    bookPage: -1,
    bookText: [],

    // The things in the bag
    inventory: {
        coins: 0,
        notebooks: 0,
        pens: 0,
    },

    // These are the vending machine trades
    vending_offers: [
        {
            item: "pen",
            invName: "pens",
            price: 1,
            stock: 1,
        },
    ],

    situation_order: [],

    position: -1,
    userName: "",
    canMove: true,

    // a situation is an array pair of two functions
    // the first will be executed when the situation is encountered
    // the second will be called with actionInfo as parameter, returning a function
    situation: null,
}

// Define situations
const situations = [
    { // Situation 1: Coin
        init: () => { 
            write([
                "There is something shiny in front of you.",
                "Something golden lies in front of you.",
                "A coin lies on the floor in front of you.",
                "Something shiny lies on the gray concrete floor.",
            ]);
        },
        
        decide: (info) => {
            if(info.verb == "take"){
                if(state.coinAvailable){
                    state.coinAvailable = false;
                    state.inventory.coins++;
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
    },

    { // Situation 2: Notebook
        init: () => { 
            write([
                "A book with a leather cover lies in front of you.",
                "Your flashlight reveals a book lying next to you on the coldish floor.",
                "Something dusty lies on the gray concrete floor.",
            ]);
        },
        decide: (info) => {
            if(info.verb == "take"){
                if(state.bookAvailable){
                    state.bookAvailable = false;
                    state.bookPage = 0;
                    state.inventory.notebooks++;
                    return () => {
                        write([
                            "You take the book. It has scratches on all sides. You put it into your bag.",
                            "You take the old notebook. In the bag it goes.",
                            "You pick up the thing on the floor. The notebook is full of dust. You take it with you.",
                        ]);
                    }
                } else {
                    return () => { write("There is nothing there to take."); } 
                }
            } else if(info.verb == "look"){
                if(state.bookAvailable){
                    return () => { write("You take a closer look. It seems to be a notebook, scratched and dusty.") };
                } else {
                    return () => { write("There is nothing there to see."); } 
                }
            }
        },
    },

    { // Situation 3: Vending Machine
        init: () => { 
            write([
                "You encounter a vending machine. Cold light shines through the front glass.",
                "A vending machine. A selection of items are for sale.",
                "On your way you pass by a vending machine. Its display flickers.",
            ]);
        },
        decide: (info) => {
            if(info.verb == "look"){
                var offers = "";
                for(const offer of state.vending_offers){
                    console.log(offer);
                    if(offer.stock > 0){
                        const item = offer.item.charAt(0).toUpperCase() + offer.item.slice(1);
                        const price =  offer.price + " " + (offer.price == 1 ? "coin" : "coins");
                        offers += item + " for " + price + "<br>";
                    }
                }

                if(offers == "")
                    offers = "Nothing for sale.";

                return () => {
                    write([
                        "You inspect the vending machines offers...",
                        "You look for an applicable trade...",
                        "You look through the scratched glass of the vending machine...",
                    ]);
    
                    write(offers, "green");
                }
            }

            if(info.verb == "buy"){
                if(info.object){

                    for(const offer of state.vending_offers){
                        if(offer.item == info.object){
                            const item = offer.item.charAt(0).toUpperCase() + offer.item.slice(1);
                            const price =  offer.price + " " + (offer.price == 1 ? "coin" : "coins");

                            if(offer.stock < 1){
                                return () => {
                                    write([
                                        "This item is out of stock.",
                                        "There are no more of those.",
                                        "The item you'd like is not available."
                                    ]);
                                }
                            }

                            if(offer.price > state.inventory.coins){
                                return () => {
                                    write([
                                        "You do not have enough coins to purchase this item.",
                                        "You are unable to pay the required amount for this item.",
                                        "You are unable to buy this item as you don't have enough coins.",
                                    ]);
                                }
                            }

                            return () => {
                                ask(() => {
                                    write([
                                        "Are you certain to buy one " + offer.item + " for " + price + "?",
                                        "Are you sure you are willing to pay " + price + " for one " + offer.item + "?",
                                    ]);
                                },
                                (answer) => {
                                    const answerInfo = decode(answer);
                                    if(answerInfo.answer == "yes"){
                                        write("You decide to buy one " + offer.item + " for " + price + ".");
                                        state.inventory[offer.invName]++;
                                        offer.stock--;
                                        state.inventory.coins -= offer.price;
                                    } else if(answerInfo.answer == "no") {
                                        write("You decide not to buy anything.");
                                    } else {
                                        write("Please answer with yes or no.");
                                        return false;
                                    }
                                    return true;
                                });
                            }


                        }
                    }

                    return () => {
                        write([
                            "The item you'd like is not available.",
                            "This item is not for sale.",
                            "The vending machine does not have that item for sale.",
                        ]);
                    }

                } else {
                    return () => {
                        write([
                            "Please also specify what you want to buy.",
                            "Please also tell me what item you want to purchase",
                        ]);
                    }
                }
            }
        },
    },

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
            state.userName = name;

            // TODO: shuffle situations
            state.situation_order = [];
            for(var i = 0; i < situations.length; i++){
                state.situation_order.push(i);
            }

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

// Helper function to download save-file
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

// Function to resume savestate
window.addEventListener("drop", (e) => {
    e.preventDefault();
    var file = null;
    if(e.dataTransfer.items){
        if(e.dataTransfer.items.length >= 1){
            const item = e.dataTransfer.items[0];
            if(item.kind === "file")
                file = item.getAsFile();
        }
    } else {
        if(e.dataTransfer.files.length >= 1){
            file = e.dataTransfer.files[0];
        }
    }
    if(file) {
        file.text().then((text) => {
            const savestate = JSON.parse(text);
            console.log(savestate);
            outputBox.innerHTML = savestate.past;
            state = savestate.state;

            // Load situation seperately as it contains functions
            state.situation = situations[
                state.situation_order[state.position % state.situation_order.length] % situations.length];
        
            // Remove any askCallback
            ask(null, null);

            autoscroll();
        });
    }
}, false);

// Block default drop action
window.addEventListener("dragover", (e) => {
    e.preventDefault();
}, false);

export {perform, init};
