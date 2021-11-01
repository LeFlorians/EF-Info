
// Sentence structures that have to be understood: (Subject is always you)
// VO
// VO with O

// Step 1: filter words
const ignored_words = [
    "the", "of", "on", "with", "that"
];

// Step 2: map words to aliases
const aliases = {
    verb: {
        "move": ["walk", "run", "go", "sprint"],

    },
    
};

// Decodes a simple command into useful information
function decode(command){
    var words = command.split(" ");

    // filter words
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
                if(aliases[i][j].includes(word))
                    info[i] = j;

    });

    return info;
}

export default decode;