const _amounts = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
]

const _indices = [
    "0.",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
]

function amountToWord(amount){
    if(amount > 0 && amount < _amounts.length)
        return _amounts[amount];
    return amount;
}

function indexToWord(index){
    if(index > 0 && index < _indices.length)
        return _amounts[index];
    return _indices + ".";
}

export {amountToWord, indexToWord}