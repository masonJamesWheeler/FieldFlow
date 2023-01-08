// a utility file that contains definitions of different classes 
// that we use as objects in the rest of the program
import { Graph } from './adjMatrix';
import type { Graph as GraphType } from './adjMatrix';
// x, y, color, name, path, adjaency matrix
	// the objects or stored in the player's arrays and used to draw the path of the players
	class Player {
		x: number;
		y: number;
		color: string;
		position: string;
		job: string;
		adjmatrix: GraphType<Node>;
		progression: string
		defense: boolean;
		constructor(
			x: number,
			y: number,
			color: string,
			position: string,
			job: string,
			adjmatrix: GraphType<Node>,
			progression: string,
			defense: boolean
		) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.position = position;
			this.job = job;
			this.adjmatrix = adjmatrix;
			this.progression = progression;
			this.defense = defense;
		}
	}

	// create a node object to store the nodes of the adjacency matrix
	class Node {
		x: number;
		y: number;
		cpx: number;
		cpy: number;
		color: string;
		dashed: boolean;
		cp: boolean;
		arrow: boolean;
		blocking: boolean;
		constructor(
			x: number,
			y: number,
			cpx: number,
			cpy: number,
			color: string,
			dashed: boolean,
			cp: boolean,
			arrow: boolean,
			blocking: boolean
		) {
			this.x = x;
			this.y = y;
			this.cpx = cpx;
			this.cpy = cpy;
			this.color = color;
			this.dashed = dashed;
			this.cp = cp;
			this.arrow = arrow;
			this.blocking = blocking;
			
		}
	}
	class Formation {
		qb:Player;
		lt:Player;
		lg:Player;
		c:Player;
		rg:Player;
		rt:Player;
		skill1:Player;
		skill2:Player;
		skill3:Player;
		skill4:Player;
		skill5:Player;
		formationName: string;
		personnel:string;
		players:Player[]
		constructor(
			qb:Player,
			lt:Player,
			lg:Player,
			c:Player,
			rg:Player,
			rt:Player,
			skill1:Player,
			skill2:Player,
			skill3:Player,
			skill4:Player,
			skill5:Player,
			formationName: string,
			personnel: string,
			players: Player[]
		) {
			this.qb = qb;
			this.lt = lt;
			this.lg = lg;
			this.c = c;
			this.rg = rg;
			this.rt = rt;
			this.skill1 = skill1;
			this.skill2 = skill2;
			this.skill3 = skill3;
			this.skill4 = skill4;
			this.skill5 = skill5;
			this.formationName = formationName;
			this.personnel = personnel;
			this.players = [qb, lt, lg, c, rg, rt, skill1, skill2, skill3, skill4, skill5]
			
		}
	}

	// a class for a Install Object, the Install Object has the following properties
	// Name, Plays, Formations, TimeStamp
	class Install {
		name: string;
		plays: Array<any>;
		formations: Array<any>;
		timeStamp: string;
		constructor(name: string, plays: Array<any>, formations: Array<any>, timeStamp: string) {
			this.name = name;
			this.plays = plays;
			this.formations = formations;
			this.timeStamp = timeStamp;
		}
	}


    export { Player, Node, Formation, Install}