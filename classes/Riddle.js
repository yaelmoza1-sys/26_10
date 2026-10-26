// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct

export default class Riddle{
    constructor({id, name, taskDescription, correctAnswer, hint})
    {
        this.id=id
        this.name=name
        this.taskDescription = taskDescription
        this.correctAnswer = correctAnswer
    }

    ask(prompt) {
        console.log(`Riddle: ${this.name}`);

        let userAnswer = prompt(`${this.taskDescription} (Type 'hint' for a clue): `);
        let usedHint = false;
        while (userAnswer !== this.correctAnswer) {
            if (userAnswer.toLowerCase() === 'hint') {
                usedHint = true;
                if (this.hint) {
                    console.log(`💡 Hint: ${this.hint}`);
                } else {
                    console.log("Sorry, no hint available for this riddle.");
                }
            } else {
                console.log("Incorrect! Try again.");
            }
            userAnswer = prompt(`${this.taskDescription}: `);
        }

        console.log("Correct! Great job.");
  }
}
