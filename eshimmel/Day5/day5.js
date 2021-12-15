// Import express js file
const express = require('express');
// Create an expres application object
const app = express();

// Sets EJS as templating engine
app.set('view engine', 'ejs');


class GameMatch {
  constructor() {
    this.id = gameList.length + 1000;
    this.turn = 0; // This is the index of this.players whose turn it is
    this.players = [];
    this.round = 0;
  }
}


class Character {
  constructor(name, race, profession) {
    this.id = characterList.length + 1000
    this.name = name
    this.race = race
    this.profession = profession
    this.equipment = {
      head: {},
      chest: {},
      legs: {},
      arm_p: {},
      arm_s: {}
    }
    this.inventory = []
    this.abilities = []
    this.stats = {
      attack: 5,
      defense: 5,
      speed: 5,
      hp_current: 20,
      hp_max: 20
    }
    // searches for an item in the item list and
    // adds it to the characters inventory
    this.pickupItem = function(searchName) {
      for (var item of itemList) {
        console.log(item.name)
        if (item.name == searchName) {
          console.log("Found a match!");
          this.inventory.push(item);
          break;
        }
      }
    }
    // This method searches for a given slot and overwrites
    // it with an empty object
    this.unequipItem = function(slot) {
      for (var slotName in this.equipment) {
        console.log(slotName);
        if (slotName == slot) {
          console.log("Found item slot. Removing.");
          this.equipment.slotName = {};
          break;
        }
      }
    }
  }
}



// All possible items
var itemList = [{
    name: 'Rusty Pipe',
    slot: 'arm_p',
    bonuses: {
      attack: 5
    }
  },
  {
    name: 'Cardboard Shield',
    slot: 'arm_s',
    bonuses: {
      defense: 5
    }
  },
];

// Create a list with two default characters

var gameList = [];
var characterList = [];
characterList.push(new Character('Johny', 'Human', 'Homeless'))
characterList.push(new Character('Jimmy', 'Human', 'Prisoner'))

for (var character of characterList) {
  character.pickupItem("Rusty Pipe");
}

app.get('/game', (req, res) => {
  // Searh for the game in the gameList
  var foundGame = gameList.find(game => game.id == req.query.gameid)
  //If a game was found, we can manipulate it
  if (foundGame) {
    //Check to see if the user sent the addcharacter query param (&addcharacter=xxxx)
    if (req.query.addcharacter) {
      //Check to see if there is room in this game's player list to add a character
      if (foundGame.players.length < 2) {
        //Find the character with the given addcharacter id
        var foundProfile = characterList.find(character => character.id == req.query.addcharacter)
        //If the character exists, add its id to this game's character list
        if (foundProfile) {
          foundGame.players.push(foundProfile.id)
        }
      }
    }
    // Render a template called 'profile' from the 'views' folder
    // And send it a variable called "sendData"
    res.render('game', {
      sendData: foundGame
    });
  } else {
    res.redirect('/newgame');
  }
})

app.get('/newgame', (req, res) => {
  gameList.push(new GameMatch())
  res.redirect('/game/?gameid=' + gameList[gameList.length - 1].id)
})

// Start a GET endpoint
app.get('/profile', (req, res) => {
  var foundProfile = characterList.find(character => character.id == req.query.characterid)

  if (foundProfile) {
    // Render a template called 'profile' from the 'views' folder
    // And send it a variable called "sendData"
    res.render('profile', {
      sendData: foundProfile
    });
  } else {
    res.redirect('/newprofile');
  }
});


// This endpoint creates a new character
app.get('/newprofile', (req, res) => {
  characterList.push(new Character('Jeff', 'StickMan', 'Prisoner'))
  res.redirect('/profile/?characterid=' + characterList[characterList.length - 1].id)
})



// Start an HTTP listen server
app.listen(3000);
