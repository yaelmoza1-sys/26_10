// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
import { createPlayer, updatePlayer } from '../api/playersApi.js';

export default class Player {
    constructor(name) {
        this.id = null;
        this.name = name;
        this.times = [];
        this.lowestTime = null;
    }

    recordTime(start, end) {
        const duration = (end - start) / 1000
        this.times.push(duration)
    }

    getTotalTime() {
        let totalTime = 0

        for (let i = 0; i < this.times.length; i++) {
            totalTime += this.times[i];
        }
        return totalTime
    }

    getAverageTime() {
        if (this.times.length === 0) {
            return 0;
        }
        return this.getTotalTime() / this.times.length;
    }


    showStats() {
        if (this.times.length === 0) {
            console.log("No riddles solved yet!")
            return;
        }
        const totalTime = this.getTotalTime();
        const averageTime = this.getAverageTime();

        console.log(`Player: ${this.name}`);
        console.log(`Total time: ${totalTime.toFixed(2)} seconds`);
        console.log(`Average time per riddle: ${averageTime.toFixed(2)} seconds`);
    }

    async savePlayer() {
        const savedPlayer = await createPlayer(this.name)

        if (savedPlayer === null) {
            console.log("Failed to save player");
            return;
        }
        this.id = savedPlayer.id;
        this.lowestTime = savedPlayer.lowestTime;

        console.log(`Player ${this.name} saved successfully!`);
    }

    async updateBestTime() {
    if (this.id === null) {
        console.log("Player has not been saved yet.");
        return;
    }

    const currentTime = this.getTotalTime();

    if (this.lowestTime !== null && currentTime >= this.lowestTime) {
        console.log("Your previous record is still the best!");
        return;
    }

    const previousBest = this.lowestTime;
    this.lowestTime = currentTime;

    const updatedPlayer = await updatePlayer({
        id: this.id,
        name: this.name,
        lowestTime: this.lowestTime
    });

    if (updatedPlayer === null) {
        this.lowestTime = previousBest;
        console.log("Failed to update player time");
        return;
    }

    console.log("New record! Time updated.");
}
}