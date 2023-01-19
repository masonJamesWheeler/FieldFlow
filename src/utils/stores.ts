// import firebase utilities
import { comparator, makeFormation } from './drawing';
import { Player, Formation, Node, Install } from '../utils/objects';
import { Node as NodeType } from '../routes/drawplay/adjMatrix';
import { Player as playerType, type Formation as formationType } from "../utils/objects"
import { Graph } from './adjMatrix';
import { getDoc, getDocs, setDoc, doc, collection, query, where, onSnapshot, orderBy, limit, addDoc, updateDoc, deleteDoc, type DocumentData } from "firebase/firestore";

// import firebase config
// a class converter to store data in firestore
// Firestore data converter
export const formationConverter = {
    toFirestore: (formation) => {
        return {
            qb: formation.qb,
            c: formation.c,
            lg: formation.lg,
            lt: formation.lt,
            rt: formation.rt,
            rg: formation.rg,
            skill1: formation.skill1,
            skill2: formation.skill2,
            skill3: formation.skill3,
            skill4: formation.skill4,
            skill5: formation.skill5,
            personnel: formation.persomnel,
            formationName: formation.formationName,
            players: [formation.qb, formation.lt, formation.lg, formation.c, formation.rg, formation.rt, formation.skill1, formation.skill2, formation.skill3, formation.skill4, formation.skill5],
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Formation(data.qb, data.lt, data.lg, data.c, data.rg, data.rt, data.skill1, data.skill2, data.skill3, data.skill4, data.skill5, data.formationName, data.personnel, []);
    }
};


// function to store a formation to the database
export async function storeFormation(players, name, user, db) {
    // if any of the players, name, user, or db are null, return
    if (players === null || name === null || user === null || db === null) {
        return;
    } else {
        let formation = makeFormation(players, name);
        await setDoc(doc(db, "Users", user, "Formations", name), {
            user: user,
            qb: { x: formation.qb.x, y: formation.qb.y },
            lt: { x: formation.lt.x, y: formation.lt.y },
            lg: { x: formation.lg.x, y: formation.lg.y },
            c: { x: formation.c.x, y: formation.c.y },
            rg: { x: formation.rg.x, y: formation.rg.y },
            rt: { x: formation.rt.x, y: formation.rt.y },
            skill1: { x: formation.skill1.x, y: formation.skill1.y, position: formation.skill1.position },
            skill2: { x: formation.skill2.x, y: formation.skill2.y, position: formation.skill2.position },
            skill3: { x: formation.skill3.x, y: formation.skill3.y, position: formation.skill3.position },
            skill4: { x: formation.skill4.x, y: formation.skill4.y, position: formation.skill4.position },
            skill5: { x: formation.skill5.x, y: formation.skill5.y, position: formation.skill5.position },
            personnel: formation.personnel,
            formationName: name
        });
    }
}

//a function to get the names of all the formations in a user's stored formations in the database
export async function getFormationNames(user: string, db) {
    let formations = await getDocs(collection(db, "Users", user, "Formations"));
    let names = [];
    formations.forEach((formation) => {
        names.push(formation.data().formationName);
    });
    return names;
}

//a function to get the formation of a certain name from a user's stored formations in the database
export async function getFormation(db, user: string, name: string) {
    let formations = await getDocs(collection(db, "Users", user, "Formations"));
    let formation;
    console.log(formations)
    formations.forEach((form) => {
        if (form.data().formationName === name) {
            formation = form.data();
        }
    });
    return [createPlayer(formation.qb.x, formation.qb.y, "QB"), createPlayer(formation.lt.x, formation.lt.y, "LT"), createPlayer(formation.lg.x, formation.lg.y, "LG"), createPlayer(formation.c.x, formation.c.y, "C"), createPlayer(formation.rg.x, formation.rg.y, "RG"), createPlayer(formation.rt.x, formation.rt.y, "RT"), createPlayer(formation.skill1.x, formation.skill1.y, formation.skill1.position), createPlayer(formation.skill2.x, formation.skill2.y, formation.skill2.position), createPlayer(formation.skill3.x, formation.skill3.y, formation.skill3.position), createPlayer(formation.skill4.x, formation.skill4.y, formation.skill4.position), createPlayer(formation.skill5.x, formation.skill5.y, formation.skill5.position)];
}

// a function to convert the formation data from the database into a formation object
export function convertFormation(formation) {
    let qb = new playerType(formation.qb.x, formation.qb.y, "black", "Q", null, new Graph(comparator, new Node(formation.qb.x, formation.qb.y, null, null, "black", false, false, false, false)), null, false)
    let lt = new playerType(formation.lt.x, formation.lt.y, "black", "LT", null, new Graph(comparator, new Node(formation.lt.x, formation.lt.y, null, null, "black", false, false, false, false)), null, false)
    let lg = new playerType(formation.lg.x, formation.lg.y, "black", "LG", null, new Graph(comparator, new Node(formation.lg.x, formation.lg.y, null, null, "black", false, false, false, false)), null, false)
    let c = new playerType(formation.c.x, formation.c.y, "black", "C", null, new Graph(comparator, new Node(formation.c.x, formation.c.y, null, null, "black", false, false, false, false)), null, false)
    let rg = new playerType(formation.rg.x, formation.rg.y, "black", "RG", null, new Graph(comparator, new Node(formation.rg.x, formation.rg.y, null, null, "black", false, false, false, false)), null, false)
    let rt = new playerType(formation.rt.x, formation.rt.y, "black", "RT", null, new Graph(comparator, new Node(formation.rt.x, formation.rt.y, null, null, "black", false, false, false, false)), null, false)
    let skill1 = new playerType(formation.skill1.x, formation.skill1.y, "black", formation.skill1.position, null, new Graph(comparator, new Node(formation.skill1.x, formation.skill1.y, null, null, "black", false, false, false, false)), null, false)
    let skill2 = new playerType(formation.skill2.x, formation.skill2.y, "black", formation.skill2.position, null, new Graph(comparator, new Node(formation.skill2.x, formation.skill2.y, null, null, "black", false, false, false, false)), null, false)
    let skill3 = new playerType(formation.skill3.x, formation.skill3.y, "black", formation.skill3.position, null, new Graph(comparator, new Node(formation.skill3.x, formation.skill3.y, null, null, "black", false, false, false, false)), null, false)
    let skill4 = new playerType(formation.skill4.x, formation.skill4.y, "black", formation.skill4.position, null, new Graph(comparator, new Node(formation.skill4.x, formation.skill4.y, null, null, "black", false, false, false, false)), null, false)
    let skill5 = new playerType(formation.skill5.x, formation.skill5.y, "black", formation.skill5.position, null, new Graph(comparator, new Node(formation.skill5.x, formation.skill5.y, null, null, "black", false, false, false, false)), null, false)
    let players = [qb, lt, lg, c, rg, rt, skill1, skill2, skill3, skill4, skill5];
    let newFormation = new Formation(qb, lt, lg, c, rg, rt, skill1, skill2, skill3, skill4, skill5, formation.formationName, formation.personnel, []);
    return newFormation;
}

// function to create players from nothing but their original positions
function createPlayer(x, y, position) {
    let player = new playerType(x, y, "black", position, null, new Graph(comparator, new Node(x, y, null, null, "black", false, false, false, false)), null, false);
    player.adjmatrix.addNewNode(new Node(x, y, null, null, "black", false, false, false, false));
    return player;
}


// function to store a entire play in the database
export async function storePlay(db, user: string, name: string, players: playerType[], formationName: string, run_or_pass: string, personnel: string, numXnum: string, down_dist: string) {
    // if any of the params are null then we want to throw an error
    if (db == null || user == null || name == null || players == null) {
        throw new Error("One of the params is null");
    } else
        // if the players array doesnt have enough players then we want to throw an error
        if (players.length < 11) {
            throw new Error("Not enough players to store a play");
        } else if (players.length > 11) {
            throw new Error("Too many players to store a play");
        } else {
            //create JSON objects to hold the values of the players.adjmatrix.nodes
            let playerOneNodes = {};
            let playerTwoNodes = {};
            let playerThreeNodes = {};
            let playerFourNodes = {};
            let playerFiveNodes = {};
            let playerSixNodes = {};
            let playerSevenNodes = {};
            let playerEightNodes = {};
            let playerNineNodes = {};
            let playerTenNodes = {};
            let playerElevenNodes = {};

            // iterate across the nodes of each player and store their values in the JSON objects
            for (let i = 0; i < players.length; i++) {
                let currPlayer = players[i];
                // iterate through the nodes of the current player
                currPlayer.adjmatrix.nodes.forEach((node) => {
                    // store the values of the current node in the JSON object
                    if (i == 0) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerOneNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 1) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerTwoNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 2) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerThreeNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 3) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerFourNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 4) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerFiveNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 5) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerSixNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 6) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerSevenNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 7) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerEightNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 8) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerNineNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 9) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerTenNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    } else if (i == 10) {
                        if (node.data.dashed == null) {
                            node.data.dashed = false;
                        }
                        playerElevenNodes[node.data.x + "," + node.data.y] = { x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => { return { x: node.data.x, y: node.data.y } }) };
                    }
                });

                // iterate through the players and store all of their data in all of their fields and include the playerNodes in their fields
                let playerOne = { position: players[0].position, color: players[0].color, nodes: playerOneNodes, x: players[0].x, y: players[0].y, job: players[0].job, progression: players[0].progression };
                let playerTwo = { position: players[1].position, color: players[1].color, nodes: playerTwoNodes, x: players[1].x, y: players[1].y, job: players[1].job, progression: players[1].progression };
                let playerThree = { position: players[2].position, color: players[2].color, nodes: playerThreeNodes, x: players[2].x, y: players[2].y, job: players[2].job, progression: players[2].progression };
                let playerFour = { position: players[3].position, color: players[3].color, nodes: playerFourNodes, x: players[3].x, y: players[3].y, job: players[3].job, progression: players[3].progression };
                let playerFive = { position: players[4].position, color: players[4].color, nodes: playerFiveNodes, x: players[4].x, y: players[4].y, job: players[4].job, progression: players[4].progression };
                let playerSix = { position: players[5].position, color: players[5].color, nodes: playerSixNodes, x: players[5].x, y: players[5].y, job: players[5].job, progression: players[5].progression };
                let playerSeven = { position: players[6].position, color: players[6].color, nodes: playerSevenNodes, x: players[6].x, y: players[6].y, job: players[6].job, progression: players[6].progression };
                let playerEight = { position: players[7].position, color: players[7].color, nodes: playerEightNodes, x: players[7].x, y: players[7].y, job: players[7].job, progression: players[7].progression };
                let playerNine = { position: players[8].position, color: players[8].color, nodes: playerNineNodes, x: players[8].x, y: players[8].y, job: players[8].job, progression: players[8].progression };
                let playerTen = { position: players[9].position, color: players[9].color, nodes: playerTenNodes, x: players[9].x, y: players[9].y, job: players[9].job, progression: players[9].progression };
                let playerEleven = { position: players[10].position, color: players[10].color, nodes: playerElevenNodes, x: players[10].x, y: players[10].y, job: players[10].job, progression: players[10].progression };


                await setDoc(doc(db, "Users", user, "Plays", name), { name: name, playerOne: playerOne, playerTwo: playerTwo, playerThree: playerThree, playerFour: playerFour, playerFive: playerFive, playerSix: playerSix, playerSeven: playerSeven, playerEight: playerEight, playerNine: playerNine, playerTen: playerTen, playerEleven: playerEleven, formation: formationName, run_pass: run_or_pass, personnel: personnel, numXnum: numXnum, down_dist: down_dist });
            }
        }
}

// a function to retrieve a play from the database
export async function retrievePlay(user, name, db) {
    let plays = await getDocs(collection(db, "Users", user, "Plays"));
    let play = plays.docs.find((play) => { return play.data().name == name });
    if (play) {
        return play.data();
    } else {
        return null;
    }
}

// a function to get all of a given user's play names
export async function getPlayNames(user, db) {
    let plays = await getDocs(collection(db, "Users", user, "Plays"));
    return plays.docs.map((play) => { return play.data().name });
}

// a function to get a play from the database and return it as a Player[] array
export async function getPlay(user, name, db) {
    let play;
    if (name == "DISPLAY_PAGE_REFERENCE") {
        name = "DisplayPlay"
        let plays = await getDocs(collection(db, "FrontPage"));
        console.log(plays)
        play = plays.docs.find((play) => { return play.data().name == name })
        play = play.data();
    } else {
        play = await retrievePlay(user, name, db);
    }
    if (play) {
        // create an object to store information and players
        let playInfo = { name: play.name, formation: play.formation, personnel: play.personnel, numXnum: play.numXnum, down_dist: play.down_dist, run_pass: play.run_pass, players: [], qbNotes: "",
                            rbNotes: "", wrNotes: "", teNotes: "", olNotes: "", dlNotes: "", lbNotes: "", cbNotes: "", sNotes: ""};
        if (play.qbNotes != undefined) {
            playInfo.qbNotes = play.qbNotes;
        }
        if (play.rbNotes != undefined) {
            playInfo.rbNotes = play.rbNotes;
        }
        if (play.wrNotes != undefined) {
            playInfo.wrNotes = play.wrNotes;
        }
        if (play.teNotes != undefined) {
            playInfo.teNotes = play.teNotes;
        }
        if (play.olNotes != undefined) {
            playInfo.olNotes = play.olNotes;
        }
        if (play.dlNotes != undefined) {
            playInfo.dlNotes = play.dlNotes;
        }
        if (play.lbNotes != undefined) {
            playInfo.lbNotes = play.lbNotes;
        }
        if (play.cbNotes != undefined) {
            playInfo.cbNotes = play.cbNotes;
        }
        if (play.sNotes != undefined) {
            playInfo.sNotes = play.sNotes;
        }
        let players = [];
        console.log(play)
        // create the first player
        let playerOne = play.playerOne;
        let playerOneFirstNodeData = playerOne.nodes[playerOne.x + "," + playerOne.y]
        playerOneFirstNodeData = new Node(playerOne.x, playerOne.y, playerOneFirstNodeData.cpx, playerOneFirstNodeData.cpy, playerOneFirstNodeData.color, playerOneFirstNodeData.dashed, playerOneFirstNodeData.cp, playerOneFirstNodeData.blocking, playerOneFirstNodeData.arrow)
        let playerOneGraph = new Graph<Node>(comparator, playerOneFirstNodeData);
        let player1 = new Player(playerOne.x, playerOne.y, playerOne.color, playerOne.position, playerOne.job, playerOneGraph, playerOne.progression, playerOne.defense);
        player1.adjmatrix.addNewNode(playerOneFirstNodeData)
        addNodesToPlayer(player1, player1.adjmatrix.lastAdded, playerOne.position, playerOne);
        players.push(player1);
        // create the second player
        let playerTwo = play.playerTwo;
        let playerTwoFirstNodeData = playerTwo.nodes[playerTwo.x + "," + playerTwo.y]
        playerTwoFirstNodeData = new Node(playerTwo.x, playerTwo.y, playerTwoFirstNodeData.cpx, playerTwoFirstNodeData.cpy, playerTwoFirstNodeData.color, playerTwoFirstNodeData.dashed, playerTwoFirstNodeData.cp, playerTwoFirstNodeData.blocking, playerTwoFirstNodeData.arrow)
        let playerTwoGraph = new Graph<Node>(comparator, playerTwoFirstNodeData);
        let player2 = new Player(playerTwo.x, playerTwo.y, playerTwo.color, playerTwo.position, playerTwo.job, playerTwoGraph, playerTwo.progression, playerTwo.defense);
        player2.adjmatrix.addNewNode(playerTwoFirstNodeData)
        addNodesToPlayer(player2, player2.adjmatrix.lastAdded, playerTwo.position, playerTwo);
        players.push(player2);
        // create the third player
        let playerThree = play.playerThree;
        let playerThreeFirstNodeData = playerThree.nodes[playerThree.x + "," + playerThree.y]
        playerThreeFirstNodeData = new Node(playerThree.x, playerThree.y, playerThreeFirstNodeData.cpx, playerThreeFirstNodeData.cpy, playerThreeFirstNodeData.color, playerThreeFirstNodeData.dashed, playerThreeFirstNodeData.cp, playerThreeFirstNodeData.blocking, playerThreeFirstNodeData.arrow)
        let playerThreeGraph = new Graph<Node>(comparator, playerThreeFirstNodeData);
        let player3 = new Player(playerThree.x, playerThree.y, playerThree.color, playerThree.position, playerThree.job, playerThreeGraph, playerThree.progression, playerThree.defense);
        player3.adjmatrix.addNewNode(playerThreeFirstNodeData)
        addNodesToPlayer(player3, player3.adjmatrix.lastAdded, playerThree.position, playerThree);
        players.push(player3);
        // create the fourth player
        let playerFour = play.playerFour;
        let playerFourFirstNodeData = playerFour.nodes[playerFour.x + "," + playerFour.y]
        playerFourFirstNodeData = new Node(playerFour.x, playerFour.y, playerFourFirstNodeData.cpx, playerFourFirstNodeData.cpy, playerFourFirstNodeData.color, playerFourFirstNodeData.dashed, playerFourFirstNodeData.cp, playerFourFirstNodeData.blocking, playerFourFirstNodeData.arrow)
        let playerFourGraph = new Graph<Node>(comparator, playerFourFirstNodeData);
        let player4 = new Player(playerFour.x, playerFour.y, playerFour.color, playerFour.position, playerFour.job, playerFourGraph, playerFour.progression, playerFour.defense);
        player4.adjmatrix.addNewNode(playerFourFirstNodeData)
        addNodesToPlayer(player4, player4.adjmatrix.lastAdded, playerFour.position, playerFour);
        players.push(player4);
        // create the fifth player
        let playerFive = play.playerFive;
        let playerFiveFirstNodeData = playerFive.nodes[playerFive.x + "," + playerFive.y]
        playerFiveFirstNodeData = new Node(playerFive.x, playerFive.y, playerFiveFirstNodeData.cpx, playerFiveFirstNodeData.cpy, playerFiveFirstNodeData.color, playerFiveFirstNodeData.dashed, playerFiveFirstNodeData.cp, playerFiveFirstNodeData.blocking, playerFiveFirstNodeData.arrow)
        let playerFiveGraph = new Graph<Node>(comparator, playerFiveFirstNodeData);
        let player5 = new Player(playerFive.x, playerFive.y, playerFive.color, playerFive.position, playerFive.job, playerFiveGraph, playerFive.progression, playerFive.defense);
        player5.adjmatrix.addNewNode(playerFiveFirstNodeData)
        addNodesToPlayer(player5, player5.adjmatrix.lastAdded, playerFive.position, playerFive);
        players.push(player5);
        console.log(players)
        // create the sixth player
        let playerSix = play.playerSix;
        let playerSixFirstNodeData = playerSix.nodes[playerSix.x + "," + playerSix.y]
        playerSixFirstNodeData = new Node(playerSix.x, playerSix.y, playerSixFirstNodeData.cpx, playerSixFirstNodeData.cpy, playerSixFirstNodeData.color, playerSixFirstNodeData.dashed, playerSixFirstNodeData.cp, playerSixFirstNodeData.blocking, playerSixFirstNodeData.arrow)
        let playerSixGraph = new Graph<Node>(comparator, playerSixFirstNodeData);
        let player6 = new Player(playerSix.x, playerSix.y, playerSix.color, playerSix.position, playerSix.job, playerSixGraph, playerSix.progression, playerSix.defense);
        player6.adjmatrix.addNewNode(playerSixFirstNodeData)
        addNodesToPlayer(player6, player6.adjmatrix.lastAdded, playerSix.position, playerSix);
        players.push(player6);
        // create the seventh player
        let playerSeven = play.playerSeven;
        let playerSevenFirstNodeData = playerSeven.nodes[playerSeven.x + "," + playerSeven.y]
        console.log(playerSeven)
        console.log(playerSevenFirstNodeData)
        playerSevenFirstNodeData = new Node(playerSeven.x, playerSeven.y, playerSevenFirstNodeData.cpx, playerSevenFirstNodeData.cpy, playerSevenFirstNodeData.color, playerSevenFirstNodeData.dashed, playerSevenFirstNodeData.cp, playerSevenFirstNodeData.blocking, playerSevenFirstNodeData.arrow)
        let playerSevenGraph = new Graph<Node>(comparator, playerSevenFirstNodeData);
        let player7 = new Player(playerSeven.x, playerSeven.y, playerSeven.color, playerSeven.position, playerSeven.job, playerSevenGraph, playerSeven.progression, playerSeven.defense);
        player7.adjmatrix.addNewNode(playerSevenFirstNodeData)
        addNodesToPlayer(player7, player7.adjmatrix.lastAdded, playerSeven.position, playerSeven);
        players.push(player7);
        // create the eighth player
        let playerEight = play.playerEight;
        let playerEightFirstNodeData = playerEight.nodes[playerEight.x + "," + playerEight.y]
        playerEightFirstNodeData = new Node(playerEight.x, playerEight.y, playerEightFirstNodeData.cpx, playerEightFirstNodeData.cpy, playerEightFirstNodeData.color, playerEightFirstNodeData.dashed, playerEightFirstNodeData.cp, playerEightFirstNodeData.blocking, playerEightFirstNodeData.arrow)
        let playerEightGraph = new Graph<Node>(comparator, playerEightFirstNodeData);
        let player8 = new Player(playerEight.x, playerEight.y, playerEight.color, playerEight.position, playerEight.job, playerEightGraph, playerEight.progression, playerEight.defense);
        player8.adjmatrix.addNewNode(playerEightFirstNodeData)
        addNodesToPlayer(player8, player8.adjmatrix.lastAdded, playerEight.position, playerEight);
        players.push(player8);
        // create the ninth player
        let playerNine = play.playerNine;
        let playerNineFirstNodeData = playerNine.nodes[playerNine.x + "," + playerNine.y]
        playerNineFirstNodeData = new Node(playerNine.x, playerNine.y, playerNineFirstNodeData.cpx, playerNineFirstNodeData.cpy, playerNineFirstNodeData.color, playerNineFirstNodeData.dashed, playerNineFirstNodeData.cp, playerNineFirstNodeData.blocking, playerNineFirstNodeData.arrow)
        let playerNineGraph = new Graph<Node>(comparator, playerNineFirstNodeData);
        let player9 = new Player(playerNine.x, playerNine.y, playerNine.color, playerNine.position, playerNine.job, playerNineGraph, playerNine.progression, playerNine.defense);
        player9.adjmatrix.addNewNode(playerNineFirstNodeData)
        addNodesToPlayer(player9, player9.adjmatrix.lastAdded, playerNine.position, playerNine);
        players.push(player9);
        // create the tenth player
        let playerTen = play.playerTen;
        let playerTenFirstNodeData = playerTen.nodes[playerTen.x + "," + playerTen.y]
        playerTenFirstNodeData = new Node(playerTen.x, playerTen.y, playerTenFirstNodeData.cpx, playerTenFirstNodeData.cpy, playerTenFirstNodeData.color, playerTenFirstNodeData.dashed, playerTenFirstNodeData.cp, playerTenFirstNodeData.blocking, playerTenFirstNodeData.arrow)
        let playerTenGraph = new Graph<Node>(comparator, playerTenFirstNodeData);
        let player10 = new Player(playerTen.x, playerTen.y, playerTen.color, playerTen.position, playerTen.job, playerTenGraph, playerTen.progression, playerTen.defense);
        player10.adjmatrix.addNewNode(playerTenFirstNodeData)
        addNodesToPlayer(player10, player10.adjmatrix.lastAdded, playerTen.position, playerTen);
        players.push(player10);
        // create the eleventh player
        let playerEleven = play.playerEleven;
        let playerElevenFirstNodeData = playerEleven.nodes[playerEleven.x + "," + playerEleven.y]
        playerElevenFirstNodeData = new Node(playerEleven.x, playerEleven.y, playerElevenFirstNodeData.cpx, playerElevenFirstNodeData.cpy, playerElevenFirstNodeData.color, playerElevenFirstNodeData.dashed, playerElevenFirstNodeData.cp, playerElevenFirstNodeData.blocking, playerElevenFirstNodeData.arrow)
        let playerElevenGraph = new Graph<Node>(comparator, playerElevenFirstNodeData);
        let player11 = new Player(playerEleven.x, playerEleven.y, playerEleven.color, playerEleven.position, playerEleven.job, playerElevenGraph, playerEleven.progression, playerEleven.defense);
        player11.adjmatrix.addNewNode(playerElevenFirstNodeData)
        addNodesToPlayer(player11, player11.adjmatrix.lastAdded, playerEleven.position, playerEleven);
        players.push(player11);
        console.log(players)
        playInfo.players = players;
        return playInfo;
    }
}

export function makePlayFromData(play) {
    if (play) {
        let players = [];
        // create the first player
        let playerOne = play.playerOne;
        let playerOneFirstNodeData = playerOne.nodes[playerOne.x + "," + playerOne.y]
        playerOneFirstNodeData = new Node(playerOne.x, playerOne.y, playerOneFirstNodeData.cpx, playerOneFirstNodeData.cpy, playerOneFirstNodeData.color, playerOneFirstNodeData.dashed, playerOneFirstNodeData.cp, playerOneFirstNodeData.blocking, playerOneFirstNodeData.arrow)
        let playerOneGraph = new Graph<Node>(comparator, playerOneFirstNodeData);
        let player1 = new Player(playerOne.x, playerOne.y, playerOne.color, playerOne.position, playerOne.job, playerOneGraph, playerOne.progression, playerOne.defense);
        player1.adjmatrix.addNewNode(playerOneFirstNodeData)
        addNodesToPlayer(player1, player1.adjmatrix.lastAdded, playerOne.position, playerOne);
        players.push(player1);
        // create the second player
        let playerTwo = play.playerTwo;
        let playerTwoFirstNodeData = playerTwo.nodes[playerTwo.x + "," + playerTwo.y]
        playerTwoFirstNodeData = new Node(playerTwo.x, playerTwo.y, playerTwoFirstNodeData.cpx, playerTwoFirstNodeData.cpy, playerTwoFirstNodeData.color, playerTwoFirstNodeData.dashed, playerTwoFirstNodeData.cp, playerTwoFirstNodeData.blocking, playerTwoFirstNodeData.arrow)
        let playerTwoGraph = new Graph<Node>(comparator, playerTwoFirstNodeData);
        let player2 = new Player(playerTwo.x, playerTwo.y, playerTwo.color, playerTwo.position, playerTwo.job, playerTwoGraph, playerTwo.progression, playerTwo.defense);
        player2.adjmatrix.addNewNode(playerTwoFirstNodeData)
        addNodesToPlayer(player2, player2.adjmatrix.lastAdded, playerTwo.position, playerTwo);
        players.push(player2);
        // create the third player
        let playerThree = play.playerThree;
        let playerThreeFirstNodeData = playerThree.nodes[playerThree.x + "," + playerThree.y]
        playerThreeFirstNodeData = new Node(playerThree.x, playerThree.y, playerThreeFirstNodeData.cpx, playerThreeFirstNodeData.cpy, playerThreeFirstNodeData.color, playerThreeFirstNodeData.dashed, playerThreeFirstNodeData.cp, playerThreeFirstNodeData.blocking, playerThreeFirstNodeData.arrow)
        let playerThreeGraph = new Graph<Node>(comparator, playerThreeFirstNodeData);
        let player3 = new Player(playerThree.x, playerThree.y, playerThree.color, playerThree.position, playerThree.job, playerThreeGraph, playerThree.progression, playerThree.defense);
        player3.adjmatrix.addNewNode(playerThreeFirstNodeData)
        addNodesToPlayer(player3, player3.adjmatrix.lastAdded, playerThree.position, playerThree);
        players.push(player3);
        // create the fourth player
        let playerFour = play.playerFour;
        let playerFourFirstNodeData = playerFour.nodes[playerFour.x + "," + playerFour.y]
        playerFourFirstNodeData = new Node(playerFour.x, playerFour.y, playerFourFirstNodeData.cpx, playerFourFirstNodeData.cpy, playerFourFirstNodeData.color, playerFourFirstNodeData.dashed, playerFourFirstNodeData.cp, playerFourFirstNodeData.blocking, playerFourFirstNodeData.arrow)
        let playerFourGraph = new Graph<Node>(comparator, playerFourFirstNodeData);
        let player4 = new Player(playerFour.x, playerFour.y, playerFour.color, playerFour.position, playerFour.job, playerFourGraph, playerFour.progression, playerFour.defense);
        player4.adjmatrix.addNewNode(playerFourFirstNodeData)
        addNodesToPlayer(player4, player4.adjmatrix.lastAdded, playerFour.position, playerFour);
        players.push(player4);
        // create the fifth player
        let playerFive = play.playerFive;
        let playerFiveFirstNodeData = playerFive.nodes[playerFive.x + "," + playerFive.y]
        playerFiveFirstNodeData = new Node(playerFive.x, playerFive.y, playerFiveFirstNodeData.cpx, playerFiveFirstNodeData.cpy, playerFiveFirstNodeData.color, playerFiveFirstNodeData.dashed, playerFiveFirstNodeData.cp, playerFiveFirstNodeData.blocking, playerFiveFirstNodeData.arrow)
        let playerFiveGraph = new Graph<Node>(comparator, playerFiveFirstNodeData);
        let player5 = new Player(playerFive.x, playerFive.y, playerFive.color, playerFive.position, playerFive.job, playerFiveGraph, playerFive.progression, playerFive.defense);
        player5.adjmatrix.addNewNode(playerFiveFirstNodeData)
        addNodesToPlayer(player5, player5.adjmatrix.lastAdded, playerFive.position, playerFive);
        players.push(player5);
        console.log(players)
        // create the sixth player
        let playerSix = play.playerSix;
        let playerSixFirstNodeData = playerSix.nodes[playerSix.x + "," + playerSix.y]
        playerSixFirstNodeData = new Node(playerSix.x, playerSix.y, playerSixFirstNodeData.cpx, playerSixFirstNodeData.cpy, playerSixFirstNodeData.color, playerSixFirstNodeData.dashed, playerSixFirstNodeData.cp, playerSixFirstNodeData.blocking, playerSixFirstNodeData.arrow)
        let playerSixGraph = new Graph<Node>(comparator, playerSixFirstNodeData);
        let player6 = new Player(playerSix.x, playerSix.y, playerSix.color, playerSix.position, playerSix.job, playerSixGraph, playerSix.progression, playerSix.defense);
        player6.adjmatrix.addNewNode(playerSixFirstNodeData)
        addNodesToPlayer(player6, player6.adjmatrix.lastAdded, playerSix.position, playerSix);
        players.push(player6);
        // create the seventh player
        let playerSeven = play.playerSeven;
        let playerSevenFirstNodeData = playerSeven.nodes[playerSeven.x + "," + playerSeven.y]
        console.log(playerSeven)
        console.log(playerSevenFirstNodeData)
        playerSevenFirstNodeData = new Node(playerSeven.x, playerSeven.y, playerSevenFirstNodeData.cpx, playerSevenFirstNodeData.cpy, playerSevenFirstNodeData.color, playerSevenFirstNodeData.dashed, playerSevenFirstNodeData.cp, playerSevenFirstNodeData.blocking, playerSevenFirstNodeData.arrow)
        let playerSevenGraph = new Graph<Node>(comparator, playerSevenFirstNodeData);
        let player7 = new Player(playerSeven.x, playerSeven.y, playerSeven.color, playerSeven.position, playerSeven.job, playerSevenGraph, playerSeven.progression, playerSeven.defense);
        player7.adjmatrix.addNewNode(playerSevenFirstNodeData)
        addNodesToPlayer(player7, player7.adjmatrix.lastAdded, playerSeven.position, playerSeven);
        players.push(player7);
        // create the eighth player
        let playerEight = play.playerEight;
        let playerEightFirstNodeData = playerEight.nodes[playerEight.x + "," + playerEight.y]
        playerEightFirstNodeData = new Node(playerEight.x, playerEight.y, playerEightFirstNodeData.cpx, playerEightFirstNodeData.cpy, playerEightFirstNodeData.color, playerEightFirstNodeData.dashed, playerEightFirstNodeData.cp, playerEightFirstNodeData.blocking, playerEightFirstNodeData.arrow)
        let playerEightGraph = new Graph<Node>(comparator, playerEightFirstNodeData);
        let player8 = new Player(playerEight.x, playerEight.y, playerEight.color, playerEight.position, playerEight.job, playerEightGraph, playerEight.progression, playerEight.defense);
        player8.adjmatrix.addNewNode(playerEightFirstNodeData)
        addNodesToPlayer(player8, player8.adjmatrix.lastAdded, playerEight.position, playerEight);
        players.push(player8);
        // create the ninth player
        let playerNine = play.playerNine;
        let playerNineFirstNodeData = playerNine.nodes[playerNine.x + "," + playerNine.y]
        playerNineFirstNodeData = new Node(playerNine.x, playerNine.y, playerNineFirstNodeData.cpx, playerNineFirstNodeData.cpy, playerNineFirstNodeData.color, playerNineFirstNodeData.dashed, playerNineFirstNodeData.cp, playerNineFirstNodeData.blocking, playerNineFirstNodeData.arrow)
        let playerNineGraph = new Graph<Node>(comparator, playerNineFirstNodeData);
        let player9 = new Player(playerNine.x, playerNine.y, playerNine.color, playerNine.position, playerNine.job, playerNineGraph, playerNine.progression, playerNine.defense);
        player9.adjmatrix.addNewNode(playerNineFirstNodeData)
        addNodesToPlayer(player9, player9.adjmatrix.lastAdded, playerNine.position, playerNine);
        players.push(player9);
        // create the tenth player
        let playerTen = play.playerTen;
        let playerTenFirstNodeData = playerTen.nodes[playerTen.x + "," + playerTen.y]
        playerTenFirstNodeData = new Node(playerTen.x, playerTen.y, playerTenFirstNodeData.cpx, playerTenFirstNodeData.cpy, playerTenFirstNodeData.color, playerTenFirstNodeData.dashed, playerTenFirstNodeData.cp, playerTenFirstNodeData.blocking, playerTenFirstNodeData.arrow)
        let playerTenGraph = new Graph<Node>(comparator, playerTenFirstNodeData);
        let player10 = new Player(playerTen.x, playerTen.y, playerTen.color, playerTen.position, playerTen.job, playerTenGraph, playerTen.progression, playerTen.defense);
        player10.adjmatrix.addNewNode(playerTenFirstNodeData)
        addNodesToPlayer(player10, player10.adjmatrix.lastAdded, playerTen.position, playerTen);
        players.push(player10);
        // create the eleventh player
        let playerEleven = play.playerEleven;
        let playerElevenFirstNodeData = playerEleven.nodes[playerEleven.x + "," + playerEleven.y]
        playerElevenFirstNodeData = new Node(playerEleven.x, playerEleven.y, playerElevenFirstNodeData.cpx, playerElevenFirstNodeData.cpy, playerElevenFirstNodeData.color, playerElevenFirstNodeData.dashed, playerElevenFirstNodeData.cp, playerElevenFirstNodeData.blocking, playerElevenFirstNodeData.arrow)
        let playerElevenGraph = new Graph<Node>(comparator, playerElevenFirstNodeData);
        let player11 = new Player(playerEleven.x, playerEleven.y, playerEleven.color, playerEleven.position, playerEleven.job, playerElevenGraph, playerEleven.progression, playerEleven.defense);
        player11.adjmatrix.addNewNode(playerElevenFirstNodeData)
        addNodesToPlayer(player11, player11.adjmatrix.lastAdded, playerEleven.position, playerEleven);
        players.push(player11);
        console.log(players)
        play.players = players;
        return play;
    }
}
// function to recursively add the nodes in order to the graph
function addNodesToPlayer(player: Player, node, playerName: string, play: DocumentData) {
    // to get the json information from the doc we have to search through nodes for the node
    // by the x and y values
    let adjNodes = [];
    console.log(node)
    console.log(play)
    let nodeData = play.nodes[node.data.x + "," + node.data.y];
    // get the adjNodes of the node
    let adjNodeData = nodeData.adjNodes;
    // if the adjNodes are empty then return

    // iterate through the adjNodes and create node objects
    adjNodeData.forEach((adjNode) => {
        let adjNodeData = play.nodes[adjNode.x + "," + adjNode.y];
        let newNode = new Node(adjNode.x, adjNode.y, adjNodeData.cpx, adjNodeData.cpy, adjNodeData.color, adjNodeData.dashed, adjNodeData.cp, adjNodeData.arrow, adjNodeData.blocking,);
        adjNodes.push(newNode);
    })

    for (let i = 0; i < adjNodes.length; i++) {
        // add the adjNodes to the graph
        player.adjmatrix.addNewNode(adjNodes[i]);
        player.adjmatrix.addEdge(node.data, adjNodes[i]);
        // add the adjNodes to the adjNodes of the previous node
        node.adjNodes.push(player.adjmatrix.lastAdded);
    }
    // iterate through the adjNodes and call the function again
    for (let i = 0; i < adjNodes.length; i++) {
        addNodesToPlayer(player, player.adjmatrix.lastAdded, playerName, play);
    }
}

// a general searching function that takes in an array of objects and searches through every single field
// and returns a new array containing the objects which contain search term.
export function search(searchTerm: string, array: any[]) {
    let results = [];
    let name = ""
    for (let i = 0; i < array.length; i++) {
        console.log(array[i])
        if (array[i].name == null) {
            name = array[i]
        } else {
            name = array[i].name;
        }
        console.log(name)
        // check if the search term is in the name
        if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push(array[i]);
        }
        // then return the results
    }
    return results;
}

// function to store a Install of plays into the database
export async function storeInstall(install: Install, user: string, db) {
    if (install == null || user == null || db == null) {
        return;
    } else {
        // create an array of the play names to store
        let playNames = [];
        let formationNames = [];
        // iterate through the plays and add the names to the array
        for (let i = 0; i < install.plays.length; i++) {
            playNames.push(install.plays[i].name);
        }
        for (let i = 0; i < install.formations.length; i++) {
            formationNames.push(install.formations[i].name);
        }

        console.log(playNames)
        console.log(install)
        console.log(user)
        await setDoc(doc(db, "Users", user, "Installs", install.name), {
            name: install.name,
            plays: playNames,
            formations: formationNames,
            date: install.timeStamp,
        })
    }
}

// function to get the names of all a user's installs
export async function getInstallNames(user: string, db) {
    if (user == null || db == null) {
        return;
    } else {
        let installNames = [];
        const installRef = collection(db, "Users", user, "Installs");
        const installSnapshot = await getDocs(installRef);
        installSnapshot.forEach((doc) => {
            installNames.push(doc.data().name);
        })
        return installNames;
    }
}

// function to get the names of all a user's installs
export async function getInstall(user: string, name:string, db) {
    if (user == null || db == null) {
        return;
    } else {
        let InstallData;
        const installRef = collection(db, "Users", user, "Installs");
        const installSnapshot = await getDocs(installRef);
        installSnapshot.forEach((doc) => {
            console.log(doc.data().name)
            console.log(name)
            if (doc.data().name == name) {
                InstallData = doc.data();
            }
        })
        return InstallData;
    }
}

// a function to get navigate to a play in the database and then update the doc
// qb, rb, oline, te, wr notes
export async function addNotesToPlay(play: string, user: string, db, qbNotes, rbNotes, olineNotes, teNotes, wrNotes) {
    if (play == null || user == null || db == null) {
        return;
    } else {
        // get the doc and update the notes
        const playRef = doc(db, "Users", user, "Plays", play);
        await updateDoc(playRef, {
            qbNotes: qbNotes,
            rbNotes: rbNotes,
            olineNotes: olineNotes,
            teNotes: teNotes,
            wrNotes: wrNotes,
        })
        
    }
}

// a function to load the filter plays from the database
export async function loadFilterPlays(db) {
    let filterPlayData = [];
    const filterPlayRef = await collection(db, "FrontPage", "FilterPlays", "Plays");
    const filterPlaySnapshot = await getDocs(filterPlayRef);
    filterPlaySnapshot.forEach((doc) => {
        filterPlayData.push(doc.data());
    })
    // for each piece of data convert the data to objects to return to the client
    let filterPlays = [];
    for (let i = 0; i < filterPlayData.length; i++) {
        filterPlays.push(makePlayFromData(filterPlayData[i]));
    }
    return filterPlays;
}




