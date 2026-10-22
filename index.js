import chalk from 'chalk';
import prompts from 'prompts';
import crypto from 'node:crypto';

const log = console.log;

log(chalk.blue.bold('--NUMBER GUESSER--'));
log(chalk.blue('Instructions: Guess a number 1-10, no numbers lower or higher, you have 4 chances to get it right and will be told if the number is lower or higher than your guess.'))
const num = crypto.randomInt(10);


(async () => {
  const response = await prompts({
    type: 'number',
    name: 'guess',
    message: 'What is your guess?',
    validate: guess => guess > 10 ? `Guess 10 or lower.` : true
  });
  log(response);
})();