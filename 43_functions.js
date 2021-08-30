//*******************************************************/
// Functions
//*******************************************************/


// Pythagoras
function getHypotenuse(a, b) {
	return (a*a + b*b) ** 0.5
}
const c = getHypotenuse(3, 4)  // c is now: 5



// convert to seconds
function getSeconds(hours, minutes, seconds) {
	//@TODO
	return 
}
const oneLesson = getSeconds(0, 45, 0) // should return 2700



//Create HTML heading tag
function createHeading(text) {
	//@TODO
	return 
}
const heading = createHeading("Welcome") // should return "<h1>Welcome</h1>"



//Create SVG rect
function createSvgRect(x, y, w, h) {
	//@TODO
	return 
}
const svgRect = createSvgRect(100, 200, 300, 400) // should return "<rect x='100' y='200' width='300' height='400'></rect>"



// Find median of 3 values
function medianOf3(a, b, c) {
	//@TODO
	return 
}
const m = medianOf3(8, 11, 9) // should return 9



// Find average of 3 values
function averageOf3(a, b, c) {
	//@TODO
	return 
}
const a = averageOf3(4, 11, 9) // should return 8



// Find average of array
function getAverage(array) {
	//@TODO
	return 
}
const b = getAverage([4, 11, 9, 2, 9]) // should return 7



// Solve ax^2 + bx + c = 0
function solveQuadratic(a, b, c) {
	//@TODO
	return 
}
const solutions = solveQuadratic(1, 0, -16) // should return [-4, 4]
const solution = solveQuadratic(1, -2, 1) // should return [1]
const empty = solveQuadratic(1, 0, 16) // should return []


