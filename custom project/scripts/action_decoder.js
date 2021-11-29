
// Sentence structures that have to be understood: (Subject is always you)
// VO
// VO with O

// Step 1: Filter symbols and words
const ignored_words = [
    "the", "of", "on", "with", "that",
];
const ignored_symbols = [
    ".", ",", "?", "!", ";", ":",
];

// Step 2: map words to aliases
const aliases = {
    verb: {
        "move": ["walk", "run", "go", "sprint", "move"],
        "look": ["look", "see", "gaze", "stare", "peek", "examine", "inspect", "view", "observe"],
        "take": ["pick", "take", "steal", "keep"],
        "put": ["put", "place"],
        "write": ["write"],
        "erase": ["delete", "erase"],
        "read": ["read"],
        "buy": ["purchase", "buy", "trade"],
        "save": ["save"],
        "make": ["make", "create"],
        "load": ["load"],
        "continue": ["continue", "resume"],
        "give": ["give"],
        "clean": ["clean", "wipe"],
        "flip": ["flip"],
        "repeat": ["repeat"],
        "turn": ["turn", "rotate"],
    },

    object: {
        "bag": ["purse", "bag", "backpack", "inventory"],
        "page": ["page", "paper"],
        "book": ["notebook", "book"],
        "coin": ["coin"],
        "pen": ["marker", "pen", "pencil"],
        "savestate": ["savefile", "savestate"],
        "help": ["help", "advice", "aid"],
    },

    direction: {
        "other": ["west", "south", "east", "north",  "left", "right", "up", "down"],
        "back": ["backwards", "backward", "back"],
    },
    
    answer: {
        "yes": ["yes", "yep", "yeah", "sure", "y", "indeed"],
        "no": ["no", "nope", "nah", "n"],
    },

    // More specific aliases
    bookAlias: {
        "changePage": ["go", "change", "switch"],
    }

};

// Decodes a simple command into useful information
function decode(command){
    var cmd = command;

    // Filter symbols
    ignored_symbols.forEach(symbol => {
        cmd = cmd.replaceAll(symbol, "");
    });

    var words = cmd.split(" ");

    // Filter words
    words.filter(word => {
        return !ignored_words.includes(word);
    });

    // info will be filled with aliases from list
    var info = {
        numbers: [],
    };

    // map words to aliases and put into map
    words.forEach(word => {
        // TODO: This could be improved with hash-map like datastructure
        for(var i in aliases){
            for(var j in aliases[i])
                if(aliases[i][j].includes(word.toLowerCase())
                || (i == "verb" && word.endsWith("ing") && 
                aliases[i][j].includes(word.substring(0, word.length-3))))
                    info[i] = j;
        }

        if(!isNaN(word))
            info.numbers.push(+word);

    });

    info.command = command;

    return info;
}

export default decode;