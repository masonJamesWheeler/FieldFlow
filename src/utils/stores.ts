// import firebase utilities
import { comparator, makeFormation } from './drawing';
import { Player, Formation, Node } from '../utils/objects';
import{ Player as playerType, type Formation as formationType} from "../utils/objects"
import { Graph } from './adjMatrix';
import { getDoc, getDocs, setDoc, doc, collection, query, where, onSnapshot, orderBy, limit, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
    let formation = makeFormation(players, name);
    await setDoc(doc(db, "Users", user, "Formations", name), {
        user: user,
        qb : {x:formation.qb.x, y:formation.qb.y},
        lt : {x:formation.lt.x, y:formation.lt.y},
        lg : {x:formation.lg.x, y:formation.lg.y},
        c : {x:formation.c.x, y:formation.c.y},
        rg : {x:formation.rg.x, y:formation.rg.y},
        rt : {x:formation.rt.x, y:formation.rt.y},
        skill1 : {x:formation.skill1.x, y:formation.skill1.y, position: formation.skill1.position},
        skill2 : {x:formation.skill2.x, y:formation.skill2.y, position: formation.skill2.position},
        skill3 : {x:formation.skill3.x, y:formation.skill3.y, position: formation.skill3.position},
        skill4 : {x:formation.skill4.x, y:formation.skill4.y, position: formation.skill4.position},
        skill5 : {x:formation.skill5.x, y:formation.skill5.y, position: formation.skill5.position},
        personnel: formation.personnel,
        formationName: name
      });

}

//a function to get the names of all the formations in a user's stored formations in the database
export async function getFormationNames(user:string, db) {
    let formations = await getDocs(collection(db,"Users", user, "Formations"));
    let names = [];
    formations.forEach((formation) => {
        names.push(formation.data().formationName);
    });
    return names;
}

//a function to get the formation of a certain name from a user's stored formations in the database
export async function getFormation(db, user:string, name:string) {
    let formations = await getDocs(collection(db,"Users",user, "Formations"));
    let formation;
    console.log(formations)
    formations.forEach((form) => {
        if (form.data().formationName === name) {
            formation = form.data();
        }
    });
    return  [createPlayer(formation.qb.x, formation.qb.y, "QB"), createPlayer(formation.lt.x, formation.lt.y, "LT"), createPlayer(formation.lg.x, formation.lg.y, "LG"), createPlayer(formation.c.x, formation.c.y, "C"), createPlayer(formation.rg.x, formation.rg.y, "RG"), createPlayer(formation.rt.x, formation.rt.y, "RT"), createPlayer(formation.skill1.x, formation.skill1.y, formation.skill1.position), createPlayer(formation.skill2.x, formation.skill2.y, formation.skill2.position), createPlayer(formation.skill3.x, formation.skill3.y, formation.skill3.position), createPlayer(formation.skill4.x, formation.skill4.y, formation.skill4.position), createPlayer(formation.skill5.x, formation.skill5.y, formation.skill5.position)];
}

// a function to convert the formation data from the database into a formation object
export function convertFormation(formation) {
    let qb = new playerType(formation.qb.x, formation.qb.y, "black", "Q",null, new Graph(comparator, new Node(formation.qb.x, formation.qb.y, null, null,"black", false, false, false,false)), null )
    let lt = new playerType(formation.lt.x, formation.lt.y, "black", "LT",null, new Graph(comparator, new Node(formation.lt.x, formation.lt.y, null, null,"black", false, false, false,false)), null )
    let lg = new playerType(formation.lg.x, formation.lg.y, "black", "LG",null, new Graph(comparator, new Node(formation.lg.x, formation.lg.y, null, null,"black", false, false, false,false)), null )
    let c = new playerType(formation.c.x, formation.c.y, "black", "C",null, new Graph(comparator, new Node(formation.c.x, formation.c.y, null, null,"black", false, false, false,false)), null )
    let rg = new playerType(formation.rg.x, formation.rg.y, "black", "RG",null, new Graph(comparator, new Node(formation.rg.x, formation.rg.y, null, null,"black", false, false, false,false)), null )
    let rt = new playerType(formation.rt.x, formation.rt.y, "black", "RT",null, new Graph(comparator, new Node(formation.rt.x, formation.rt.y, null, null,"black", false, false, false,false)), null )
    let skill1 = new playerType(formation.skill1.x, formation.skill1.y, "black", formation.skill1.position ,null, new Graph(comparator, new Node(formation.skill1.x, formation.skill1.y, null, null,"black", false, false, false,false)), null )
    let skill2 = new playerType(formation.skill2.x, formation.skill2.y, "black", formation.skill2.position,null, new Graph(comparator, new Node(formation.skill2.x, formation.skill2.y, null, null,"black", false, false, false,false)), null )
    let skill3 = new playerType(formation.skill3.x, formation.skill3.y, "black", formation.skill3.position,null, new Graph(comparator, new Node(formation.skill3.x, formation.skill3.y, null, null,"black", false, false, false,false)), null )
    let skill4 = new playerType(formation.skill4.x, formation.skill4.y, "black", formation.skill4.position,null, new Graph(comparator, new Node(formation.skill4.x, formation.skill4.y, null, null,"black", false, false, false,false)), null )
    let skill5 = new playerType(formation.skill5.x, formation.skill5.y, "black", formation.skill5.position,null, new Graph(comparator, new Node(formation.skill5.x, formation.skill5.y, null, null,"black", false, false, false,false)), null )
    let players = [qb, lt, lg, c, rg, rt, skill1, skill2, skill3, skill4, skill5];
    let newFormation = new Formation(qb, lt, lg, c, rg, rt, skill1, skill2, skill3, skill4, skill5, formation.formationName, formation.personnel, []);
    return newFormation;
}

// function to create players from nothing but their original positions
    function createPlayer(x, y, position) {
        let player = new playerType(x, y, "black", position, null, new Graph(comparator, new Node(x, y, null, null, "black", false, false, false, false)), null);
        player.adjmatrix.addNewNode(new Node(x, y, null, null, "black", false, false, false, false));
        return player;
    }


// function to store a entire play in the database
export async function storePlay(db, user:string, name:string, players: playerType[]) {
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
                    playerOneNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 1) {
                    playerTwoNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 2) {
                    playerThreeNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 3) {
                    playerFourNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 4) {
                    playerFiveNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 5) {
                    playerSixNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 6) {
                    playerSevenNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 7) {
                    playerEightNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 8) {
                    playerNineNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 9) {
                    playerTenNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                } else if (i == 10) {
                    playerElevenNodes[node.data.x + "," + node.data.y] = {x: node.data.x, y: node.data.y, color: node.data.color, dashed: node.data.dashed, blocking: node.data.blocking, arrow: node.data.arrow, cp: node.data.cp, cpx: node.data.cpx, cpy: node.data.cpy, adjNodes: node.adjNodes.map((node) => {return {x: node.data.x, y: node.data.y}})};
                }
            });

    // iterate through the players and store all of their data in all of their fields and include the playerNodes in their fields
    let playerOne = {position: players[0].position, color: players[0].color, nodes: playerOneNodes, x: players[0].x, y: players[0].y,job: players[0].job, progression: players[0].progression};
    let playerTwo = {position: players[1].position, color: players[1].color, nodes: playerTwoNodes, x: players[1].x, y: players[1].y,job: players[1].job, progression: players[1].progression};
    let playerThree = {position: players[2].position, color: players[2].color, nodes: playerThreeNodes, x: players[2].x, y: players[2].y,job: players[2].job, progression: players[2].progression};
    let playerFour = {position: players[3].position, color: players[3].color, nodes: playerFourNodes, x: players[3].x, y: players[3].y,job: players[3].job, progression: players[3].progression};
    let playerFive = {position: players[4].position, color: players[4].color, nodes: playerFiveNodes, x: players[4].x, y: players[4].y,job: players[4].job, progression: players[4].progression};
    let playerSix = {position: players[5].position, color: players[5].color, nodes: playerSixNodes, x: players[5].x, y: players[5].y,job: players[5].job, progression: players[5].progression};
    let playerSeven = {position: players[6].position, color: players[6].color, nodes: playerSevenNodes, x: players[6].x, y: players[6].y,job: players[6].job, progression: players[6].progression};
    let playerEight = {position: players[7].position, color: players[7].color, nodes: playerEightNodes, x: players[7].x, y: players[7].y,job: players[7].job, progression: players[7].progression};
    let playerNine = {position: players[8].position, color: players[8].color, nodes: playerNineNodes, x: players[8].x, y: players[8].y,job: players[8].job, progression: players[8].progression};
    let playerTen = {position: players[9].position, color: players[9].color, nodes: playerTenNodes, x: players[9].x, y: players[9].y,job: players[9].job, progression: players[9].progression};
    let playerEleven = {position: players[10].position, color: players[10].color, nodes: playerElevenNodes, x: players[10].x, y: players[10].y,job: players[10].job, progression: players[10].progression};
    

    await setDoc(doc(db, "Users", user, "Plays", name), {name: name, playerOne: playerOne, playerTwo: playerTwo, playerThree: playerThree, playerFour: playerFour, playerFive: playerFive, playerSix: playerSix, playerSeven: playerSeven, playerEight: playerEight, playerNine: playerNine, playerTen: playerTen, playerEleven: playerEleven});
    }
}
}

// a function to retrieve a play from the database
export async function retrievePlay(user, name, db) {
    let plays = await getDocs(collection(db, "Users", user, "Plays"));
    let play = plays.docs.find((play) => {return play.data().name == name});
    if (play) {
        return play.data();
    } else {
        return null;
    }
}

// a function to get all of a given user's play names
export async function getPlayNames(user, db) {
    let plays = await getDocs(collection(db, "Users", user, "Plays"));
    return plays.docs.map((play) => {return play.data().name});
}
