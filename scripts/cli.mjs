#!/usr/bin/env node

/**
 * Fortune Telling Agent CLI Tool
 * Provides command-line access to the fortune telling agent
 */

import { fortuneTellingAgent } from '../src/mastra/agents/index.js';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(chalk.blue.bold('🔮 Fortune Telling Agent CLI'));
console.log(chalk.gray('Type "help" for available commands, "exit" to quit\n'));

const showHelp = () => {
  console.log(chalk.yellow.bold('Available Commands:'));
  console.log(chalk.cyan('astrology') + ' - Get an astrological reading');
  console.log(chalk.cyan('tarot') + ' - Perform a tarot card reading');
  console.log(chalk.cyan('numerology') + ' - Calculate numerological values');
  console.log(chalk.cyan('iching') + ' - Consult the I Ching');
  console.log(chalk.cyan('fengshui') + ' - Get feng shui analysis');
  console.log(chalk.cyan('palmistry') + ' - Palm reading interpretation');
  console.log(chalk.cyan('bazi') + ' - Chinese Ba Zi analysis');
  console.log(chalk.cyan('help') + ' - Show this help message');
  console.log(chalk.cyan('exit') + ' - Exit the program\n');
};

const promptForInput = (question) => {
  return new Promise((resolve) => {
    rl.question(chalk.green(question + ': '), resolve);
  });
};

const handleCommand = async (command) => {
  try {
    switch (command.toLowerCase()) {
      case 'help':
        showHelp();
        break;

      case 'astrology':
        console.log(chalk.magenta.bold('\n⭐ Astrological Reading'));
        const birthDate = await promptForInput('Birth date (YYYY-MM-DD)');
        const birthLocation = await promptForInput('Birth location (City, Country)');
        const birthTime = await promptForInput('Birth time (HH:MM, optional)');
        const question = await promptForInput('Specific question (optional)');

        const astroResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please perform an astrological reading for someone born on ${birthDate} in ${birthLocation}${birthTime ? ` at ${birthTime}` : ''}${question ? `. They want to know: ${question}` : ''}`
          }]
        });
        
        console.log(chalk.blue('\n📖 Reading:'));
        console.log(astroResult.messages[astroResult.messages.length - 1].content);
        break;

      case 'tarot':
        console.log(chalk.magenta.bold('\n🃏 Tarot Reading'));
        const spreadType = await promptForInput('Spread type (single/three-card/celtic-cross/relationship/career/yes-no)');
        const tarotQuestion = await promptForInput('Your question');

        const tarotResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please perform a ${spreadType} tarot reading for: "${tarotQuestion}"`
          }]
        });
        
        console.log(chalk.blue('\n🔮 Reading:'));
        console.log(tarotResult.messages[tarotResult.messages.length - 1].content);
        break;

      case 'numerology':
        console.log(chalk.magenta.bold('\n🔢 Numerology Analysis'));
        const fullName = await promptForInput('Full birth name');
        const numBirthDate = await promptForInput('Birth date (YYYY-MM-DD)');

        const numResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please calculate a numerology profile for ${fullName} born on ${numBirthDate}`
          }]
        });
        
        console.log(chalk.blue('\n📊 Analysis:'));
        console.log(numResult.messages[numResult.messages.length - 1].content);
        break;

      case 'iching':
        console.log(chalk.magenta.bold('\n☯️  I Ching Divination'));
        const ichingQuestion = await promptForInput('Your question for the oracle');

        const ichingResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please consult the I Ching about: "${ichingQuestion}"`
          }]
        });
        
        console.log(chalk.blue('\n📜 Oracle Says:'));
        console.log(ichingResult.messages[ichingResult.messages.length - 1].content);
        break;

      case 'fengshui':
        console.log(chalk.magenta.bold('\n🏠 Feng Shui Analysis'));
        const spaceType = await promptForInput('Space type (home/office/bedroom/kitchen/living_room)');
        const facing = await promptForInput('Facing direction (north/south/east/west, etc.)');
        const description = await promptForInput('Describe your space');

        const fengshuiResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please analyze the feng shui of my ${spaceType} facing ${facing}. ${description}`
          }]
        });
        
        console.log(chalk.blue('\n🌬️  Analysis:'));
        console.log(fengshuiResult.messages[fengshuiResult.messages.length - 1].content);
        break;

      case 'palmistry':
        console.log(chalk.magenta.bold('\n✋ Palmistry Reading'));
        const dominantHand = await promptForInput('Dominant hand (left/right)');
        const handDescription = await promptForInput('Describe your palm lines and hand shape');

        const palmResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please do a palmistry reading for my ${dominantHand} hand. ${handDescription}`
          }]
        });
        
        console.log(chalk.blue('\n👋 Reading:'));
        console.log(palmResult.messages[palmResult.messages.length - 1].content);
        break;

      case 'bazi':
        console.log(chalk.magenta.bold('\n🏮 Ba Zi (Four Pillars) Analysis'));
        const baziBirthDate = await promptForInput('Birth date (YYYY-MM-DD)');
        const baziBirthTime = await promptForInput('Birth time (HH:MM)');
        const gender = await promptForInput('Gender (male/female)');

        const baziResult = await fortuneTellingAgent.run({
          messages: [{
            role: 'user',
            content: `Please perform a Ba Zi analysis for a ${gender} born on ${baziBirthDate} at ${baziBirthTime}`
          }]
        });
        
        console.log(chalk.blue('\n🎋 Four Pillars Analysis:'));
        console.log(baziResult.messages[baziResult.messages.length - 1].content);
        break;

      case 'exit':
        console.log(chalk.yellow('Thank you for using Fortune Telling Agent! 🌟'));
        process.exit(0);
        break;

      default:
        console.log(chalk.red(`Unknown command: ${command}`));
        console.log(chalk.gray('Type "help" for available commands\n'));
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
  }

  console.log(); // Add spacing
  promptUser();
};

const promptUser = () => {
  rl.question(chalk.white.bold('🔮 Enter command: '), handleCommand);
};

// Start the CLI
promptUser();
