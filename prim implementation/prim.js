// Graph-Klasse definieren
class Graph {

    constructor(directed=false) {
        this.directed = directed;
        this.connections = {}
    }

    addNode(node) {
        this.connections[node] = {}
    }

    addEdge(from, to, weight){
        this.connections[from][to] = weight;
        if(!this.directed)
            this.connections[to][from] = weight;
    }

    getNeighbours(node) {
        return this.connections[node];
    }

}

// Graph-Instanz erstellen
const graph = new Graph(false)

const n_nodes = 1000, n_edges = 1000, max_edge_length = 10000;

// Nodes hinzufügen
console.log("Adding "+n_nodes+" nodes...")
for(var x = 0; x < n_nodes; x++)
    graph.addNode(x)


// Edges hinzufügen
console.log("Adding "+n_edges+" edges...")
for(var x = 0; x < n_edges; x++){
    const from = x % n_nodes;
    var to = from;

    const neighbours = graph.getNeighbours(from);

    // Doppelte Verbindungen und verbindungen zu sich selbst vermeiden
    while(to == from || to in neighbours)
        to = Math.floor(Math.random() * n_nodes)

    const length = Math.floor(Math.random() * max_edge_length);
    graph.addEdge(from, to, length);
}

// - Algorithmus von Prim -
console.log("Performing algorithm...")
var current_node = "0";
var total_length = 0;

const tree = [];
const done = [current_node];
const pending_neighbours = {};
var n_pending = 0;


while(true) {
    const neighbours = graph.getNeighbours(current_node);

    // Add not visited nodes no pending_neighbours
    for(to in neighbours){
        if(done.includes(to))
            continue;
        const weight = neighbours[to];
        const current = pending_neighbours[to];
        if(!current)
            n_pending++;
        if(!current || current.weight > weight)
            pending_neighbours[to] = {
                from: current_node,
                to,
                weight,
            };
    }

    // If pending neighbours is empty, finish
    if(n_pending == 0)
        break;

    // Get the shortest connection
    shortest = null;
    for(to in pending_neighbours){
        const neighbour = pending_neighbours[to];
        if(shortest == null || shortest.weight > neighbour.weight)
            shortest = neighbour;

    }

    // Remove shortest from pending
    delete pending_neighbours[shortest.to];
    n_pending--;

    // Add it to the tree
    tree.push(shortest);
    done.push(shortest.to);
    current_node = shortest.to;
    total_length+= shortest.weight;
}

console.log("Result: ", tree);

console.log("Number of edges in tree: " + tree.length)
console.log("Sum of all weights in tree: " +total_length)