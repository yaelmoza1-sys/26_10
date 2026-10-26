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
import fs from 'fs';

export default class Player{
    constructor(name){
        this.name=name
        this.times=[]
    }
    recordTime(start, end){
        const duration= (end - start) / 1000
        this.times.push(duration)
    }
    showStats(){
        if(this.times.length === 0){
            console.log("No riddles solved yet!")
            return;
        }
        let totalTime = 0
        for (let i = 0; i < this.times.length; i++) {
            totalTime += this.times[i]
        }
        let averageTime = totalTime/this.times.length

        console.log(`Player: ${this.name}`);
        console.log(`Total time: ${totalTime} ms`);
        console.log(`Average time per riddle: ${averageTime} ms`);
    }

    saveScore() {
        const scoreData = {
            name: this.name,
            totalTime: this.getTotalTime(),
            averageTime: this.getAverageTime(),
            date: new Date().toISOString()
        };

        let scores = []
        if (fs.existsSync('scores.json')) {
            const fileData = fs.readFileSync('scores.json', 'utf8');
            scores = JSON.parse(fileData)
        }

        scores.push(scoreData)
        
        fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));
        console.log("Score saved to leaderboard!")
    }

}