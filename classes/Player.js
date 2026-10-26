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

export default class Player{
    constructor(name){
        this.name=name
        this.times=[]
    }
    recordTime(start, end){
        const duration= end - start
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
}