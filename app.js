// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import AllRiddles from './riddles/index.js';
import Riddle from './classes/Riddle.js';
import r1 from './riddles/r1.js';
import r2 from './riddles/r2.js';

const prompt = PromptSync();

console.log("Welcome to the Riddle Game! ")
const playerName = prompt("What is your name? ")
const player = new Player(playerName)
const chosenLevel = prompt('Choose difficulty: easy / medium: ')
const activeRiddles = AllRiddles.filter(riddle => riddle.level === chosenLevel)

for (let i = 0; i < activeRiddles.length; i++){
    
    const riddleData = activeRiddles[i]
    const start = Date.now()
    const riddle = new Riddle(riddleData)
    riddle.ask(prompt)
    const end = Date.now()
    
    let durationInSeconds = (end - start) / 1000;
    
    if (durationInSeconds > riddleData.timeLimit) {
        console.log("Too slow! 5 seconds penalty applied.")
        durationInSeconds += 5
    }
    
    const adjustedEnd = start + (durationInSeconds * 1000);
    player.recordTime(start, adjustedEnd);
    
    console.log("-------------------")
}

console.log("🎉 Congratulations! You finished all the riddles!")
player.showStats()
player.saveScore()