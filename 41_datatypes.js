//*******************************************************/
// Strings (Zeichenketten)
//*******************************************************/

const subject = "Computer Science"
const level = "GYM3"
const room = "H004"
const quote = 'He said: "Welcome!"'

// String concatenation
const info = subject + " - " + level

// String interpolation
const info2 = `${subject}, ${level}`

// Pick a substring
const tool = subject.slice(0, 8)
const passion = subject.slice(9)
const magic = subject.slice(-7)

// Pick a single character
const zero = room[1]

// Find (first) position of substring
const endOfTitle = "<h1>Welcome</h1>".indexOf("</")

// Replace all occurrences
const subtitle = "<h1>Welcome</h1>".replaceAll("h1", "h2")



//*******************************************************/
// Numbers
//*******************************************************/

let sum = 0
const d = 8
const PI = 3.1415926535
const temperature = 23.5
const c = 3e8
let x = 3
let y = 4

// Operations
const r = d / 2
const circ = 2 * PI * r
const area = PI * r ** 2
const hypotenuse = (x ** 2 + y ** 2) ** 0.5
const mod2 = x % 2
sum = sum + 7
y -= 3

// Math
const engineersPi = Math.round(PI)
const sinOfPi = Math.sin(PI)
const cosOfPi = Math.cos(PI)
const maximum = Math.max(3,5,8,9,1)
const minimum = Math.min(3,5,8,9,1)

// Convert from/to string
const n = Number("-7.3")
const s = String(7.3)


//*******************************************************/
// Booleans
//*******************************************************/

const isOnline = true
const hasPermission = false
const canSend = isOnline && hasPermission
const isDangerous = temperature < -20 || temperature > 40
const isNotZero = temperature != 0


//*******************************************************/
// Arrays
//*******************************************************/

const fruits = ["Ananas", "Apple", "Peach"]
const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]
const myGrades = [5, 5.5, 4.5, 5, 6]

// Pick element
const bluePlanet = planets[2]
const firstTest = myGrades[0]

// change element
fruits[2] = "Pear"

// append element at the end
myGrades.push(5.5)

// concat lists
const moreFruis = fruits.concat(["Banana", "Cherry"])

// get number of elements
const N = planets.length

// get (first) position of a value
const positionOfJupiter = planets.indexOf("Jupiter")


//*******************************************************/
// Objects (part 1)
//*******************************************************/

const pricelist = {
	water: 1.50,
	beer: 4.50,
	tea: 3.00,
	coffee: 4.00,
	"orange juice": 3.50
}

const coordinates = {x: 70, y: 30}

const weatherData = {
	temperatures: [17, 17, 18, 15],
	windspeeed: [10, 11, 8, 11],
	forecast: ["cloudy", "sunny", "sunny", "sunny"]
}

// Pick value
const priceOfTea = pricelist.tea // or pricelist["tea"]

// change value
coordinates.x += 5
coordinates.y = 20

// add key and value
pricelist.lemonade = 3.50












