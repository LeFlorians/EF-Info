
// Sentence structures that have to be understood: (Subject is always you)
// VO
// VO with O

// Step 1: Filter symbols and words
const ignored_words = [
    "the", "of", "on", "with", "that",
];
const ignored_symbols = [
    ".", ",", "?", "!",
];

// Step 2: map words to aliases
const aliases = {
    verb: {
        "move": ["walk", "run", "go", "sprint", "move"],
        "look": ["look", "gaze", "stare", "peek", "examine", "inspect", "view", "observe"],
        "take": ["pick", "take", "steal"],
    },

    object: {
        "bag": ["purse", "bag", "backpack"],
    },

    direction: {
        "impossible": ["west", "south", "east", "north", "backwards", "backward", "left", "right", "back"],
    },
    
};

// Decodes a simple command into useful information
function decode(command){

    // Filter symbols
    ignored_symbols.forEach(symbol => {
        command = command.replaceAll(symbol, "");
    });

    var words = command.split(" ");

    // Filter words
    words.filter(word => {
        return !ignored_words.includes(word);
    });

    // info will be filled with aliases from list
    var info = {};

    // map words to aliases and put into map
    words.forEach(word => {
        // TODO: This could be improved with hash-map like datastructure
        for(var i in aliases)
            for(var j in aliases[i])
                if(aliases[i][j].includes(word.toLowerCase()))
                    info[i] = j;

    });

    return info;
}

export default decode;