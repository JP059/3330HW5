import chalk from 'chalk';
import prompts from 'prompts';
import crypto from 'node:crypto';
import fs from 'node:fs';

const outputMessages = [];
const log = message => {
  console.log(message);
  outputMessages.push(String(message).replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, ''));
};

log(chalk.blue.bold('--NUMBER GUESSER--'));
log(chalk.blue('Instructions: Guess an integer from 1-10. You have 3 guesses; after each valid guess, you will be told if it is too low or too high.'));
const num = crypto.randomInt(1, 11);

(async () => {
  try {
    for (let i = 0; i < 3; i++) {
      try {
        const promptMessage = `Guess ${i + 1} of 3:`;
        outputMessages.push(promptMessage);
        const response = await prompts({
          type: 'text',
          name: 'guess',
          message: promptMessage,
          validate: guess => {
            try {
              const trimmedGuess = guess.trim();
              if (trimmedGuess.length === 0) {
                throw new Error('A guess is required.');
              }

              const numericGuess = Number(trimmedGuess);
              if (!Number.isInteger(numericGuess) || numericGuess < 1 || numericGuess > 10) {
                throw new Error('Guess an integer from 1 to 10.');
              }
              return true;
            } catch (error) {
              const validationMessage = error instanceof Error ? error.message : 'Invalid guess.';
              outputMessages.push(validationMessage);
              return chalk.red(validationMessage);
            }
          }
        });

        if (response.guess === undefined) {
          log(chalk.red('Game cancelled.'));
          return;
        }

        const guess = Number(response.guess.trim());
        if (guess === num) {
          log(chalk.green('Correct! You guessed the number.'));
          return;
        }

        log(chalk.yellow(guess < num ? 'Too low.' : 'Too high.'));
      } catch (error) {
        log(chalk.red(error instanceof Error ? error.message : 'Unable to read your guess.'));
        return;
      }
    }

    log(chalk.red(`Out of guesses! The number was ${num}.`));
  } finally {
    try {
      fs.writeFileSync('output.txt', `${outputMessages.join('\n')}\n`, 'utf8');
    } catch (error) {
      console.error(chalk.red(`Unable to write output.txt: ${error instanceof Error ? error.message : 'Unknown file error.'}`));
    }
  }
})();