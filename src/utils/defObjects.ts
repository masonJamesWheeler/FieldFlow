// this is a file that contains basic rules for how the defense should be alligned according to 
// the offensive formation, the offensive formation is held in a player's array Player[]
import { Player, Formation, Node } from '../utils/objects';
import { Graph } from './adjMatrix';
// we will determine the position of a player from two parameter's rules:
// 1.) the depth from the line of scrimmage
// 2.) a pre-determined width from a player on the offensive side of the ball or a predetermined ratio between players on offesnive side of the ball

// these parameters are determined by the user's selected formation and the user's selected play

// create a class for a formation
// the formation class will contain the name of the formation, the personnel and the rules for the defense

export let frontRules = {
    "42 Over G": {
        "E": {tech:"7", frontside:true, depth:100},
        "T": {tech:"3", frontside:true, depth:100},
        "N": {tech:"2i", frontside:false, depth:100},
        "$": {tech:"5", frontside:false, depth:100},
        "W": {tech:"3", frontside:false, depth:400},
        "M": {tech:"3", frontside:true, depth:400},
         
    }
}

export class DefensiveFormation {
    name: string;
    personnel: string;
    rules: {};
    constructor(name: string, personnel: string, rules: {}) {
        this.name = name;
        this.personnel = personnel;
        this.rules = rules;
    }
}

// a function to decide the strength of the offensive alignment
// the strength is defined as the side (left or right) that has the most players,
// we can do this by counting the number of skill players left and to the right of the Center
export function getOffensiveStrength(formation:Formation ) {
    let centerPosition = formation.c.x;
    let left = 0;
    let right = 0;
    let skillPlayers = [formation.skill1, formation.skill2, formation.skill3, formation.skill4, formation.skill5];
    for (let i = 0; i < skillPlayers.length; i++) {
        if (skillPlayers[i].x < centerPosition) {
            left++;
        } else if (skillPlayers[i].x > centerPosition) {
            right++;
        }
    }
    if (left > right) {
        return "left";
    }
    if (right > left) {
        return "right";
    }
    if (right === left) {
        return "balanced";
    }
}

export function getDefensivePlayers (defenseForm:DefensiveFormation, offenseForm:Formation) {
    let strength = getOffensiveStrength(offenseForm);
    let players = [];
    let rules = defenseForm.rules;
    let keys = Object.keys(rules);
    for (let i = 0; i < keys.length; i++) {
        let rule = rules[keys[i]];
        console.log(rule);
        console.log(keys[i]);
        let player = makeDefensePlayer(keys[i], rule, strength, offenseForm);
        players.push(player);
    }
    console.log(players)
    return players;
}

export function makeDefensePlayer (position:string, rule:any, strength:string, offenseForm:Formation) {
    let refPosition = null
    let tech = rule.tech;
    let frontside = rule.frontside;
    let depth = rule.depth;
    if (tech == "0" || tech == "1") {
        refPosition = offenseForm.c;
    } else if (tech == "2i" || tech == "2" || tech == "3") {
        if (strength == "left") {
            if (frontside) {
                refPosition = offenseForm.lg
            } else {
                refPosition = offenseForm.rg
            }
        } else if (strength == "right") {
            if (frontside) {
                refPosition = offenseForm.rg
            } else {
                refPosition = offenseForm.lg
            }
        }
    } else if (tech == "4" || tech == "4i" || tech == "5" || tech == "7") {
        if (strength == "left") {
            if (frontside) {
                refPosition = offenseForm.lt
            } else {
                refPosition = offenseForm.rt
            }
        } else if (strength == "right") {
            if (frontside) {
                refPosition = offenseForm.rt
            } else {
                refPosition = offenseForm.lt
            }
        }
    }
    // now we need to make the player based off deviaton from the reference position
    if (refPosition) {
        if (tech == "0") {
            let i = new Node(refPosition.x, refPosition.y, null, null, 'black', false, false, false, false);						
			let graph = new Graph<Node>(comparator, i);
            return new Player(refPosition.x, refPosition.y - rule.depth,"black", position, null,graph, null )
        } else if (tech == "1") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            }
        } else if (tech == 2) {
            let i = new Node(refPosition.x, refPosition.y-depth, null, null, 'black', false, false, false, false);
            let graph = new Graph<Node>(comparator, i);
            return new Player(refPosition.x, refPosition.y-depth,"black", position, null,graph, null )
        } else if (tech == "2i") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } else if (strength == "right") {
                if (frontside) {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } 
        } else if (tech == "3") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } else if (strength == "right") {
                if (frontside) {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } 
        } else if (tech == "4") {
            let i = new Node(refPosition.x, refPosition.y-depth, null, null, 'black', false, false, false, false);
            let graph = new Graph<Node>(comparator, i);
            return new Player(refPosition.x, refPosition.y-depth,"black", position, null,graph, null )
        } else if (tech == "4i") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } else if (strength == "right") {
                if (frontside) {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } 
        } else if (tech == "5") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } else if (strength == "right") {
                if (frontside) {
                    let i = new Node(refPosition.x+40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+40, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x-40, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-40, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } 
        } else if (tech == "7") {
            if (strength == "left") {
                if (frontside) {
                    let i = new Node(refPosition.x-100, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-80, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x+80, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+80, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } else if (strength == "right") {
                if (frontside) {
                    let i = new Node(refPosition.x+80, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x+80, refPosition.y-depth,"black", position, null,graph, null )
                } else {
                    let i = new Node(refPosition.x-80, refPosition.y-depth, null, null, 'black', false, false, false, false);
                    let graph = new Graph<Node>(comparator, i);
                    return new Player(refPosition.x-80, refPosition.y-depth,"black", position, null,graph, null )
                }   
            } 
        }

    }

}
export  {}




	// function to use as a comparator
	function comparator(a: Node, b: Node) {
		return null;
	}