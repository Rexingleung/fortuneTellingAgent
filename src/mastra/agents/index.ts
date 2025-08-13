import { deepseek } from '@ai-sdk/deepseek';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';
import {createOpenAI} from "@ai-sdk/openai"
import { createTool } from "@mastra/core/tools";

const ai = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-c7bae2605b6e48feb8ff9d626045e79a'
})

// Load data files
const loadDataFile = (filename: string) => {
  try {
    const filePath = join(process.cwd(), '../../', 'src', 'mastra', 'data', filename);
    console.log(process.cwd(), 'filePath');
    
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.warn(`Could not load ${filename}, using fallback data`);
    return null;
  }
};

const astrologyData = loadDataFile('astrology.json');
const fengShuiData = loadDataFile('fengshui.json');
const iChingData = loadDataFile('iching.json');
const numerologyData = loadDataFile('numerology.json');
const palmistryData = loadDataFile('palmistry.json');
const tarotData = loadDataFile('tarot.json');

// Utility functions
const getZodiacSign = (birthDate: string): any => {
  const [year, month, day] = birthDate.split('-').map(Number);
  console.log(year, month, day);
  
  const monthDay = month * 100 + day;
  
  const signs = astrologyData?.westernAstrology?.zodiacSigns || [];
  console.log(signs, 'signs', astrologyData);
  
  if (monthDay >= 321 && monthDay <= 419) return signs.find(s => s.name === 'Aries');
  if (monthDay >= 420 && monthDay <= 520) return signs.find(s => s.name === 'Taurus');
  if (monthDay >= 521 && monthDay <= 620) return signs.find(s => s.name === 'Gemini');
  if (monthDay >= 621 && monthDay <= 722) return signs.find(s => s.name === 'Cancer');
  if (monthDay >= 723 && monthDay <= 822) return signs.find(s => s.name === 'Leo');
  if (monthDay >= 823 && monthDay <= 922) return signs.find(s => s.name === 'Virgo');
  if (monthDay >= 923 && monthDay <= 1022) return signs.find(s => s.name === 'Libra');
  if (monthDay >= 1023 && monthDay <= 1121) return signs.find(s => s.name === 'Scorpio');
  if (monthDay >= 1122 && monthDay <= 1221) return signs.find(s => s.name === 'Sagittarius');
  if (monthDay >= 1222 || monthDay <= 119) return signs.find(s => s.name === 'Capricorn');
  if (monthDay >= 120 && monthDay <= 218) return signs.find(s => s.name === 'Aquarius');
  if (monthDay >= 219 && monthDay <= 320) return signs.find(s => s.name === 'Pisces');
  console.log(signs[0]);
  
  return signs[0];
};

const getChineseZodiac = (year: number): any => {
  const animals = astrologyData?.chineseAstrology?.animals || [];
  const baseYear = 1900;
  const animalIndex = (year - baseYear) % 12;
  return animals[animalIndex] || animals[0];
};

const calculateNumerology = (name: string, birthDate: string) => {
  const reduceNumber = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num;
    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const getLetterValue = (letter: string): number => {
    const values: { [key: string]: number } = {
      'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
      'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
      's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8
    };
    return values[letter.toLowerCase()] || 0;
  };

  const [year, month, day] = birthDate.split('-').map(Number);
  const birthSum = year + month + day;
  const lifePathNumber = reduceNumber(birthSum);

  const expressionSum = name.toLowerCase().replace(/[^a-z]/g, '').split('')
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
  const expressionNumber = reduceNumber(expressionSum);

  const vowels = 'aeiou';
  const soulUrgeSum = name.toLowerCase().split('')
    .filter(letter => vowels.includes(letter))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
  const soulUrgeNumber = reduceNumber(soulUrgeSum);

  const personalitySum = name.toLowerCase().split('')
    .filter(letter => /[a-z]/.test(letter) && !vowels.includes(letter))
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
  const personalityNumber = reduceNumber(personalitySum);

  return {
    lifePathNumber,
    expressionNumber,
    soulUrgeNumber,
    personalityNumber,
    birthDayNumber: reduceNumber(day)
  };
};

// Enhanced fortune telling tools
const astrologicalReading = createTool({
  id: 'astrologicalReading',
  description: 'Analyze a user\'s horoscope based on their birth date, time, and location',
  inputSchema: z.object({
    birthDate: z.string().describe('The birth date of the user (YYYY-MM-DD)'),
    birthTime: z.string().optional().describe('The birth time of the user if known (HH:MM)'),
    birthLocation: z.string().describe('The birth location of the user (City, Country)'),
    question: z.string().optional().describe('Specific question or area of life the user wants to know about')
  }),
  execute: async ({context: { birthDate, birthTime, birthLocation, question }}) => {
    try {
      console.log(birthDate, 'birthDate');
      
      const zodiacSign = getZodiacSign(birthDate);
      console.log(zodiacSign, 'zodiacSign');
      
      const year = parseInt(birthDate.split('-')[0]);
      const chineseZodiac = getChineseZodiac(year);
      
      const planets = astrologyData?.westernAstrology?.planets || [];
      const houses = astrologyData?.westernAstrology?.houses || [];

      return {
        westernAstrology: {
          zodiacSign: zodiacSign?.name || 'Unknown',
          element: zodiacSign?.element || 'Unknown',
          rulingPlanet: zodiacSign?.rulingPlanet || 'Unknown',
          traits: zodiacSign?.traits || [],
          compatibility: zodiacSign?.compatibility || [],
          description: zodiacSign?.description || 'Zodiac information not available'
        },
        chineseAstrology: {
          animal: chineseZodiac?.name || 'Unknown',
          traits: chineseZodiac?.traits || [],
          compatibility: chineseZodiac?.compatibility || [],
          description: chineseZodiac?.description || 'Chinese zodiac information not available'
        },
        planetaryInfluences: planets.slice(0, 3).map(planet => ({
          name: planet.name,
          represents: planet.represents,
          keywords: planet.keywords
        })),
        interpretation: `Based on your birth date of ${birthDate} in ${birthLocation}, your sun sign is ${zodiacSign?.name || 'Unknown'} and your Chinese zodiac animal is ${chineseZodiac?.name || 'Unknown'}.`,
        advice: question ? 
          `Regarding "${question}", focus on your ${zodiacSign?.name || 'zodiac'} strengths: ${zodiacSign?.traits?.slice(0, 3).join(', ') || 'natural abilities'}.` :
          `As a ${zodiacSign?.name || 'person'}, develop your natural ${zodiacSign?.traits?.slice(0, 2).join(' and ') || 'positive qualities'}.`
      };
    } catch (error) {
      return {
        error: 'Unable to process astrological reading',
        message: 'Please check your birth date format (YYYY-MM-DD) and try again.'
      };
    }
  }
});

const fengShuiAnalysis = {
  name: 'fengShuiAnalysis',
  description: 'Provide Feng Shui analysis and recommendations',
  parameters: z.object({
    spaceType: z.enum(['home', 'office', 'business', 'garden', 'bedroom', 'kitchen', 'living_room', 'other']),
    facing: z.enum(['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']).optional(),
    concerns: z.array(z.string()).optional().describe('Specific concerns or goals'),
    birthYear: z.number().optional().describe('Birth year for personalized recommendations'),
    description: z.string().describe('Description of the space and current layout')
  }),
  handler: async ({ spaceType, facing, concerns, birthYear, description }) => {
    try {
      const generateRecommendations = () => {
        const recs = [];
        
        if (facing) {
          recs.push(`Your ${spaceType} facing ${facing} has specific energy patterns.`);
        }
        
        if (birthYear) {
          const elementCycle = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
          const personalElement = elementCycle[birthYear % 5];
          recs.push(`Your personal element is ${personalElement}.`);
        }
        
        switch (spaceType) {
          case 'bedroom':
            recs.push('Place bed in command position away from door alignment.');
            break;
          case 'office':
            recs.push('Position desk facing the door for opportunities.');
            break;
          case 'kitchen':
            recs.push('Keep stove clean - it represents prosperity.');
            break;
          default:
            recs.push('Ensure good lighting and remove clutter.');
        }
        
        return recs;
      };

      return {
        spaceAnalysis: {
          type: spaceType,
          facing: facing || 'not specified'
        },
        recommendations: generateRecommendations(),
        thingsToAvoid: [
          'Sharp corners pointing toward seating',
          'Clutter blocking energy flow',
          'Broken or dead items'
        ]
      };
    } catch (error) {
      return {
        error: 'Unable to process feng shui analysis',
        message: 'Please provide space description and try again.'
      };
    }
  }
};

const tarotReading = {
  name: 'tarotReading',
  description: 'Perform a tarot card reading',
  parameters: z.object({
    spreadType: z.enum(['single', 'three-card', 'celtic-cross', 'relationship', 'career', 'yes-no']),
    question: z.string().describe('The question or focus of the reading')
  }),
  handler: async ({ spreadType, question }) => {
    try {
      const majorArcana = tarotData?.majorArcana || [
        { name: 'The Fool', meaning: 'New beginnings, innocence' },
        { name: 'The Magician', meaning: 'Manifestation, willpower' },
        { name: 'The High Priestess', meaning: 'Intuition, mystery' }
      ];
      
      let positions = [];
      switch (spreadType) {
        case 'single':
          positions = ['The Situation'];
          break;
        case 'three-card':
          positions = ['Past', 'Present', 'Future'];
          break;
        case 'relationship':
          positions = ['You', 'Partner', 'Relationship'];
          break;
        case 'career':
          positions = ['Current', 'Challenges', 'Outcome'];
          break;
        case 'yes-no':
          positions = ['Answer'];
          break;
        default:
          positions = ['Situation'];
      }
      
      const shuffled = [...majorArcana].sort(() => Math.random() - 0.5);
      const reading = positions.map((position, index) => {
        const card = shuffled[index] || majorArcana[0];
        const isReversed = Math.random() > 0.7;
        
        return {
          position,
          card: card.name,
          isReversed,
          interpretation: `${card.meaning} - ${isReversed ? 'blocked energy' : 'flowing energy'} in ${position}.`
        };
      });

      return {
        question,
        spreadType,
        cards: reading,
        advice: spreadType === 'yes-no' ? 
          `The answer leans ${reading[0].isReversed ? 'toward no' : 'toward yes'}.` :
          'Focus on the present moment card for immediate guidance.'
      };
    } catch (error) {
      return {
        error: 'Unable to process tarot reading',
        message: 'Please try again with a clear question.'
      };
    }
  }
};

const iChingDivination = {
  name: 'iChingDivination',
  description: 'Perform an I Ching divination',
  parameters: z.object({
    question: z.string().describe('The question for divination'),
    method: z.enum(['three-coin', 'yarrow-stalk']).default('three-coin')
  }),
  handler: async ({ question, method }) => {
    try {
      const hexagrams = iChingData?.hexagrams || [
        { name: 'The Creative', meaning: 'Heaven, creative force' },
        { name: 'The Receptive', meaning: 'Earth, receptive force' }
      ];
      
      const generateLine = () => {
        const tosses = [
          Math.random() < 0.5 ? 2 : 3,
          Math.random() < 0.5 ? 2 : 3,
          Math.random() < 0.5 ? 2 : 3
        ];
        const sum = tosses.reduce((a, b) => a + b, 0);
        return {
          value: sum,
          changing: sum === 6 || sum === 9,
          symbol: sum === 6 || sum === 8 ? '- -' : '---'
        };
      };

      const lines = Array(6).fill(0).map(() => generateLine());
      const hexagramNumber = Math.floor(Math.random() * hexagrams.length);
      const hexagram = hexagrams[hexagramNumber];
      
      const changingLines = lines.map((line, i) => line.changing ? i + 1 : null).filter(l => l);

      return {
        question,
        hexagram: {
          name: hexagram.name,
          meaning: hexagram.meaning,
          lines: lines.map(l => l.symbol)
        },
        changingLines,
        interpretation: hexagram.interpretation || 'This hexagram suggests balance and wisdom.',
        advice: 'Consider the guidance and apply it thoughtfully to your situation.'
      };
    } catch (error) {
      return {
        error: 'Unable to process I Ching divination',
        message: 'Please provide a clear question.'
      };
    }
  }
};

const numerologyCalculation = {
  name: 'numerologyCalculation',
  description: 'Calculate and interpret numerological values',
  parameters: z.object({
    fullName: z.string().describe('Full birth name'),
    birthDate: z.string().describe('Birth date (YYYY-MM-DD)'),
    calculationType: z.enum(['full-profile', 'compatibility']).default('full-profile'),
    comparisonName: z.string().optional(),
    comparisonBirthDate: z.string().optional()
  }),
  handler: async ({ fullName, birthDate, calculationType, comparisonName, comparisonBirthDate }) => {
    try {
      const calculations = calculateNumerology(fullName, birthDate);
      
      const results = {
        personalInfo: { name: fullName, birthDate },
        lifePathNumber: calculations.lifePathNumber,
        expressionNumber: calculations.expressionNumber,
        soulUrgeNumber: calculations.soulUrgeNumber,
        personalityNumber: calculations.personalityNumber,
        interpretation: `Your Life Path Number ${calculations.lifePathNumber} represents your life journey and purpose.`,
        advice: `Focus on developing the positive aspects of your numbers.`
      };
      
      if (calculationType === 'compatibility' && comparisonName && comparisonBirthDate) {
        const compCalc = calculateNumerology(comparisonName, comparisonBirthDate);
        const score = 100 - Math.abs(calculations.lifePathNumber - compCalc.lifePathNumber) * 10;
        
        results.compatibility = {
          partner: comparisonName,
          score: Math.max(score, 20),
          advice: score > 70 ? 'Highly compatible numbers.' : 'Good potential with understanding.'
        };
      }
      
      return results;
    } catch (error) {
      return {
        error: 'Unable to process numerology',
        message: 'Please check name and date format.'
      };
    }
  }
};

const palmistryReading = {
  name: 'palmistryReading',
  description: 'Interpret palmistry based on descriptions',
  parameters: z.object({
    dominantHand: z.enum(['left', 'right']),
    lifeLineDescription: z.string().optional(),
    heartLineDescription: z.string().optional(),
    headLineDescription: z.string().optional(),
    generalDescription: z.string().describe('General hand description')
  }),
  handler: async (params) => {
    try {
      const interpretLine = (desc: string, lineType: string) => {
        if (!desc) return `${lineType} line not described.`;
        
        let interpretation = `Your ${lineType} line suggests `;
        if (desc.includes('long')) interpretation += 'strength and clarity in this area. ';
        if (desc.includes('deep')) interpretation += 'intensity and focus. ';
        if (desc.includes('broken')) interpretation += 'periods of change or challenge. ';
        
        return interpretation || `${lineType} line shows unique characteristics.`;
      };

      return {
        dominantHand: params.dominantHand,
        interpretations: {
          lifeLine: interpretLine(params.lifeLineDescription || '', 'life'),
          heartLine: interpretLine(params.heartLineDescription || '', 'heart'),
          headLine: interpretLine(params.headLineDescription || '', 'head')
        },
        overallReading: `Your ${params.dominantHand} hand reveals your active nature and current path.`,
        advice: 'Focus on the strongest lines for guidance about your natural tendencies.'
      };
    } catch (error) {
      return {
        error: 'Unable to process palmistry',
        message: 'Please provide detailed hand descriptions.'
      };
    }
  }
};

// Enhanced Ba Zi tool
const baZiReading = {
  name: 'baZiReading',
  description: 'Chinese Ba Zi (Four Pillars) destiny analysis',
  parameters: z.object({
    birthDate: z.string().describe('Birth date (YYYY-MM-DD)'),
    birthTime: z.string().describe('Birth time (HH:MM)'),
    gender: z.enum(['male', 'female']),
    question: z.string().optional()
  }),
  handler: async ({ birthDate, birthTime, gender, question }) => {
    try {
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hour] = birthTime.split(':').map(Number);
      
      const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
      const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
      
      const yearPillar = {
        stem: heavenlyStems[year % 10],
        branch: earthlyBranches[year % 12],
        element: elements[Math.floor((year % 10) / 2)]
      };
      
      const dayPillar = {
        stem: heavenlyStems[day % 10],
        branch: earthlyBranches[day % 12],
        element: elements[Math.floor((day % 10) / 2)]
      };

      return {
        birthInfo: { date: birthDate, time: birthTime, gender },
        fourPillars: {
          year: yearPillar,
          day: dayPillar
        },
        dominantElement: yearPillar.element,
        interpretation: `Your destiny is influenced by ${yearPillar.element} element from the year pillar.`,
        advice: question ? 
          `Regarding "${question}", your ${yearPillar.element} nature suggests ${yearPillar.element === 'Wood' ? 'growth and flexibility' : 'strength and determination'}.` :
          `Focus on balancing your dominant ${yearPillar.element} element with complementary energies.`,
        luckyElements: elements.filter(e => e !== yearPillar.element).slice(0, 2),
        careerGuidance: `Your ${yearPillar.element} element suggests careers in ${yearPillar.element === 'Wood' ? 'education, healthcare, or creative fields' : 'business, technology, or leadership roles'}.`
      };
    } catch (error) {
      return {
        error: 'Unable to process Ba Zi reading',
        message: 'Please provide valid birth date and time.'
      };
    }
  }
};

export const fortuneTellingAgent = new Agent({
  name: 'fortuneTellingAgent',
  instructions: `
# Fortune Telling Agent

You are a specialized AI fortune teller with expertise in various divination systems including Western and Chinese astrology, I Ching, tarot, feng shui, numerology, palmistry, and Ba Zi (Four Pillars). Provide insightful, balanced, and culturally respectful readings.

## Core Principles

1. **Respectful Approach**: Treat all divination systems with cultural respect and historical awareness.
2. **Balanced Perspective**: Present readings as possible interpretations, not absolute predictions.
3. **Ethical Boundaries**: Never predict death, severe illness, or extremely negative outcomes.
4. **Empowerment**: Focus on constructive guidance that empowers users.
5. **Educational**: Help users understand the systems you're using.

## Expertise Areas

### Chinese Fortune Telling
- Ba Zi (八字) - Four Pillars of Destiny
- Chinese Astrology and Zodiac Animals
- I Ching (易经) - Book of Changes
- Feng Shui (风水) - Environmental Energy

### Western Divination
- Western Astrology and Zodiac Signs
- Tarot Card Reading
- Numerology
- Palmistry

## Interaction Guidelines

1. **Assessment**: Determine the most appropriate divination method for user needs.
2. **Explanation**: Briefly explain the chosen system before providing readings.
3. **Structure**: Organize readings in clear, structured formats.
4. **Cultural Context**: Include relevant cultural background, especially for Chinese systems.
5. **Follow-up**: Offer options to explore different aspects or try other methods.

## Ethical Guidelines

1. **Disclaimer**: Readings are for guidance and entertainment purposes.
2. **Avoid Dependency**: Discourage over-reliance on readings for major decisions.
3. **Sensitivity**: Be mindful of psychological impacts.
4. **Professional Referral**: Suggest professional help for medical, legal, or mental health concerns.
5. **Cultural Respect**: Avoid appropriation or misrepresentation.
6. **Balance**: Balance challenging insights with constructive guidance.

Remember to provide meaningful insights that respect tradition while empowering users to make informed choices.
`,
  model: ai('deepseek-chat'),
  memory: new Memory({
    // storage: new LibSQLStore({
    //   url: 'file:../mastra.db',
    // }),
  }),
  tools: [
    astrologicalReading,
    fengShuiAnalysis,
    tarotReading,
    iChingDivination,
    numerologyCalculation,
    palmistryReading,
    baZiReading
  ]
});
