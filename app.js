import promptSync from 'prompt-sync';
import Player from './classes/Player.js';
import Riddle from './classes/Riddle.js';

import {
    getAllRiddles,
    createRiddle,
    updateRiddle,
    deleteRiddle
} from './api/riddlesApi.js';

import {
    findPlayerByName,
    getAllPlayers
} from './api/playersApi.js';

const prompt = promptSync();

function showMenu() {
    console.log(`
1. Play game
2. Create riddle
3. Read riddles
4. Update riddle
5. Delete riddle
6. Leaderboard
0. Exit
`);
}

async function main() {
    let choice;

    do {
        showMenu();
        choice = prompt('Choose an option: ');

        switch (choice) {
            case '1': await startGame(); break;
            case '2': await addRiddle(); break;
            case '3': await readRiddles(); break;
            case '4': await editRiddle(); break;
            case '5': await removeRiddle(); break;
            case '6': await showLeaderboard(); break;
            case '0': console.log('Goodbye!'); break;
            default: console.log('Invalid choice.');
        }
    } while (choice !== '0');
}

async function startGame() {
    const name = prompt('Enter your name: ').trim();
    if (!name) return console.log('Name cannot be empty.');

    let player = await findPlayerByName(name);

    if (player) {
        const savedPlayer = player;
        player = new Player(savedPlayer.name);
        player.id = savedPlayer.id;
        player.lowestTime = savedPlayer.lowestTime;

        console.log(`Welcome back ${name}!`);
        if (player.lowestTime !== null) {
            console.log(`Your best time: ${player.lowestTime.toFixed(2)} seconds`);
        }
    } else {
        player = new Player(name);
        await player.savePlayer();
        if (player.id === null) return;
    }

    const level = prompt('Choose level (easy/medium): ').trim().toLowerCase();
    if (!['easy', 'medium'].includes(level)) {
        console.log('Invalid level.');
        return;
    }

    const riddles = (await getAllRiddles()).filter(r => r.level === level);
    if (!riddles.length) return console.log('No riddles available.');

    for (const data of riddles) {
        const riddle = new Riddle(data);
        const start = Date.now();

        riddle.ask(prompt);

        let duration = (Date.now() - start) / 1000;

        if (duration > riddle.timeLimit) {
            console.log('Time limit exceeded! 5 seconds penalty.');
            duration += 5;
        }

        player.times.push(duration);
    }

    player.showStats();
    await player.updateBestTime();
}

async function addRiddle() {
    const name = prompt('Riddle name: ').trim();
    const taskDescription = prompt('Task description: ').trim();
    const correctAnswer = prompt('Correct answer: ').trim();
    const level = prompt('Level (easy/medium): ').trim().toLowerCase();
    const timeLimit = Number(prompt('Time limit: '));
    const hint = prompt('Hint: ').trim();

    if (!name || !taskDescription || !correctAnswer || !hint ||
        !['easy', 'medium'].includes(level) ||
        !Number.isFinite(timeLimit) || timeLimit <= 0) {
        return console.log('Invalid riddle details.');
    }

    const result = await createRiddle({
        name, taskDescription, correctAnswer, level, timeLimit, hint
    });

    console.log(result ? 'Riddle created successfully!' : 'Failed to create riddle.');
}

function displayRiddles(riddles) {
    riddles.forEach(r => {
        console.log(`
ID: ${r.id}
Name: ${r.name}
Description: ${r.taskDescription}
Answer: ${r.correctAnswer}
Level: ${r.level}
Time limit: ${r.timeLimit}
Hint: ${r.hint}
--------------------`);
    });
}

async function readRiddles() {
    const riddles = await getAllRiddles();

    if (!riddles.length) return console.log('No riddles found.');

    displayRiddles(riddles);
}

async function editRiddle() {
    const riddles = await getAllRiddles();
    if (!riddles.length) return console.log('No riddles found.');

    displayRiddles(riddles);

    const id = Number(prompt('Enter riddle ID to update: '));
    const riddle = riddles.find(r => Number(r.id) === id);

    if (!riddle) return console.log('Riddle not found.');

    const updated = {
        ...riddle,
        name: prompt(`Name (${riddle.name}): `).trim() || riddle.name,
        taskDescription: prompt(`Description (${riddle.taskDescription}): `).trim() || riddle.taskDescription,
        correctAnswer: prompt(`Answer (${riddle.correctAnswer}): `).trim() || riddle.correctAnswer,
        level: prompt(`Level (${riddle.level}): `).trim().toLowerCase() || riddle.level,
        timeLimit: Number(prompt(`Time limit (${riddle.timeLimit}): `)) || riddle.timeLimit,
        hint: prompt(`Hint (${riddle.hint}): `).trim() || riddle.hint
    };

    if (!['easy', 'medium'].includes(updated.level)) {
        return console.log('Invalid level.');
    }

    const result = await updateRiddle(id, updated);
    console.log(result ? 'Riddle updated successfully!' : 'Failed to update riddle.');
}

async function removeRiddle() {
    const riddles = await getAllRiddles();
    if (!riddles.length) return console.log('No riddles found.');

    displayRiddles(riddles);

    const id = Number(prompt('Enter riddle ID to delete: '));
    if (!riddles.some(r => Number(r.id) === id)) {
        return console.log('Riddle not found.');
    }

    if (prompt('Are you sure? (yes/no): ').toLowerCase() !== 'yes') {
        return console.log('Deletion cancelled.');
    }

    const result = await deleteRiddle(id);
    console.log(result ? 'Riddle deleted successfully!' : 'Failed to delete riddle.');
}

async function showLeaderboard() {
    const players = (await getAllPlayers())
        .filter(p => p.lowestTime !== null && p.lowestTime !== undefined)
        .sort((a, b) => a.lowestTime - b.lowestTime);

    if (!players.length) return console.log('No records yet.');

    console.log('\nLeaderboard:');
    players.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} - ${p.lowestTime.toFixed(2)} seconds`);
    });
}

main();