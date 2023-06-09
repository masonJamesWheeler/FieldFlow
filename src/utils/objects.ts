// a file that defines the useful objects that we'll use in the program

// LIST OF OBJECTS:
// TEAM
// PLAYER
// FORMATION
// PLAY
// 

export class Team {
	players: Player[];
	formation: Formation;
	play: Play;
	constructor(players: Player[], formation: Formation, play: Play) {
		this.players = players;
		this.formation = formation;
		this.play = play;
	}
	numPlayers(): number {
		return this.players.length;
	}
	playersValid(): boolean {
		return this.numPlayers() == 11;
	}
	setFormation(formation: Formation) {
		this.formation = formation;
	}
	setPlay(play: Play) {
		this.play = play;
	}
	addPlayer(player: Player) {
		this.players.push(player);
	}

}

// class for the formation object
export class Formation {
	name: string;
	personnel: string;
	nxn: string;
	rightOrLeft: string;
	constructor(name: string, personnel: string, nxn: string, rightOrLeft: string) {
		this.name = name;
		this.personnel = personnel;
		this.nxn = nxn;
		this.rightOrLeft = rightOrLeft;
	}
}

// class for the player object
export class Player {
	position: string;
	job: string;
	route: Route;
	constructor(position: string, job: string, route: Route) {
		this.position = position;
		this.job = job;
		this.route = route;
	}
	setPosition(position: string) {
		if (position.length > 10) {
			throw new Error("Position name is too long");
		} else {
		this.position = position;
		}
	}
	setJob(job: string) {
		if (job.length > 48) {
			throw new Error("Job name is too long");
		} else {
		this.job = job;
		}
	}
	setRoute(route: Route) {
		this.route = route;
	}
}
	

// a class of route to represent the path of the player
export class Route {
	firstNode: Route_Node;
	lastNode: Route_Node;
	routeNodes : Route_Node[];
	constructor(firstNode: Route_Node, lastNode: Route_Node, routeNodes: Route_Node[]) {
		this.firstNode = firstNode;
		this.lastNode = lastNode;
		this.routeNodes = routeNodes;
	}
	getFirstNode(): Route_Node {
		return this.firstNode;
	}
	getLastNode(): Route_Node {
		return this.lastNode;
	}
	getRouteNodes(): Route_Node[] {
		return this.routeNodes;
	}
	setFirstNode(firstNode: Route_Node) {
		this.firstNode = firstNode;
	}
	setLastNode(lastNode: Route_Node) {
		this.lastNode = lastNode;
	}
	addNode(node: Route_Node) {
		this.routeNodes.push(node);
	}
}


export class Route_Node {
	x: number;
	y: number;
	parent: Route_Node;
	connectedNodes: Route_Node[];
	constructor(x: number, y: number, parent:Route_Node, connectedNodes: Route_Node[]) {
		this.x = x;
		this.y = y;
		this.parent = parent;
		this.connectedNodes = connectedNodes;
	}
	getParent(): Route_Node {
		return this.parent;
	}
	getConnectedNodes(): Route_Node[] {
		return this.connectedNodes;
	}
	
}

// class for the play object
export class Play {
	name: string;
	formation: Formation;
	description: string;
	notes: string[];
	constructor(name: string, formation: Formation, description: string, notes: string[]) {
		this.name = name;
		this.formation = formation;
		this.description = description;
		this.notes = notes;
	}
}

