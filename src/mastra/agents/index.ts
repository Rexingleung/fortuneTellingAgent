import { deepseek } from '@ai-sdk/deepseek';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { z } from 'zod';

// Define tools for fortune telling
const astrologicalReading = {
  name: 'astrologicalReading',
  description: 'Analyze a user\'s horoscope based on their birth date, time, and location',
  parameters: z.object({
    birthDate: z.string().describe('The birth date of the user (YYYY-MM-DD)'),
    birthTime: z.string().optional().describe('The birth time of the user if known (HH:MM)'),
    birthLocation: z.string().describe('The birth location of the user (City, Country)'),
    question: z.string().optional().describe('Specific question or area of life the user wants to know about')
  }),
  handler: async ({ birthDate, birthTime, birthLocation, question }) => {
    // In a real implementation, this would connect to an astrological calculation service
    // For now, we'll return a structured response that the agent can use
    return {
      zodiacSign: 'Determined based on birth date',
      ascendant: birthTime ? 'Calculated based on birth time' : 'Unknown (birth time needed)',
      houses: 'House placements of planets',
      aspects: 'Major planetary aspects',
      interpretation: 'Detailed interpretation based on the chart',
      advice: 'Personalized advice based on the chart and question'
    };
  }
};

const fengShuiAnalysis = {
  name: 'fengShuiAnalysis',
  description: 'Provide Feng Shui analysis and recommendations',
  parameters: z.object({
    spaceType: z.enum(['home', 'office', 'business', 'garden', 'other']),
    facing: z.enum(['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']).optional(),
    concerns: z.array(z.string()).optional().describe('Specific concerns or goals'),
    birthYear: z.number().optional().describe('Birth year for personalized recommendations'),
    description: z.string().describe('Description of the space and current layout')
  }),
  handler: async ({ spaceType, facing, concerns, birthYear, description }) => {
    // In a real implementation, this would apply feng shui principles based on the inputs
    return {
      baGuaAnalysis: 'Analysis of the space using Ba Gua map',
      fiveElementsBalance: 'Analysis of five elements balance in the space',
      recommendations: 'Specific recommendations for improvements',
      auspiciousLocations: 'Best locations for specific purposes',
      thingsToAvoid: 'Configurations and elements to avoid',
      personalizedAdvice: birthYear ? 'Personalized recommendations based on birth year' : 'General recommendations'
    };
  }
};

const tarotReading = {
  name: 'tarotReading',
  description: 'Perform a tarot card reading',
  parameters: z.object({
    spreadType: z.enum(['single', 'three-card', 'celtic-cross', 'relationship', 'career', 'yes-no', 'custom']),
    question: z.string().describe('The question or focus of the reading'),
    customPositions: z.array(z.string()).optional().describe('For custom spreads, the position meanings')
  }),
  handler: async ({ spreadType, question, customPositions }) => {
    // Simulate a tarot reading with random card selection and positions
    const majorArcana = [
      'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
      'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
      'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
      'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
      'Judgement', 'The World'
    ];
    
    const minorArcana = [
      'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands',
      'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands',
      'Page of Wands', 'Knight of Wands', 'Queen of Wands', 'King of Wands',
      
      'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups',
      'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups',
      'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups',
      
      'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords',
      'Six of Swords', 'Seven of Swords', 'Eight of Swords', 'Nine of Swords', 'Ten of Swords',
      'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords',
      
      'Ace of Pentacles', 'Two of Pentacles', 'Three of Pentacles', 'Four of Pentacles', 'Five of Pentacles',
      'Six of Pentacles', 'Seven of Pentacles', 'Eight of Pentacles', 'Nine of Pentacles', 'Ten of Pentacles',
      'Page of Pentacles', 'Knight of Pentacles', 'Queen of Pentacles', 'King of Pentacles'
    ];
    
    const allCards = [...majorArcana, ...minorArcana];
    
    // Define standard positions based on spread type
    let positions = [];
    
    switch (spreadType) {
      case 'single':
        positions = ['The Situation'];
        break;
      case 'three-card':
        positions = ['Past', 'Present', 'Future'];
        break;
      case 'celtic-cross':
        positions = [
          'Present', 'Challenge', 'Foundation', 'Recent Past', 'Potential Outcome', 
          'Immediate Future', 'Your Influence', 'External Influence', 'Hopes/Fears', 'Final Outcome'
        ];
        break;
      case 'relationship':
        positions = ['You', 'Partner', 'Relationship', 'Foundation', 'Past', 'Future'];
        break;
      case 'career':
        positions = ['Current Position', 'Challenges', 'Opportunities', 'Action to Take', 'Outcome'];
        break;
      case 'yes-no':
        positions = ['Answer'];
        break;
      case 'custom':
        positions = customPositions || ['Custom Position 1', 'Custom Position 2', 'Custom Position 3'];
        break;
    }
    
    // Simulate card drawing (without duplicates)
    const shuffledDeck = [...allCards].sort(() => Math.random() - 0.5);
    const reading = positions.map((position, index) => {
      const isReversed = Math.random() > 0.7; // 30% chance of a reversed card
      return {
        position,
        card: shuffledDeck[index],
        isReversed,
        interpretation: `Interpretation of ${shuffledDeck[index]} ${isReversed ? '(Reversed)' : ''} in the ${position} position`
      };
    });
    
    return {
      question,
      spreadType,
      cards: reading,
      overallInterpretation: 'Overall interpretation of the reading based on the patterns and combinations of cards',
      advice: 'Personalized advice based on the reading'
    };
  }
};

const iChingDivination = {
  name: 'iChingDivination',
  description: 'Perform an I Ching divination using virtual coin tosses',
  parameters: z.object({
    question: z.string().describe('The question for the divination'),
    method: z.enum(['three-coin', 'yarrow-stalk']).default('three-coin')
  }),
  handler: async ({ question, method }) => {
    // Simulate I Ching hexagram generation
    const generateLine = () => {
      // Three-coin method simulation
      const tosses = [Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? 2 : 3, Math.random() < 0.5 ? 2 : 3];
      const sum = tosses.reduce((a, b) => a + b, 0);
      
      // 6 = old yin (changing), 7 = young yang (stable), 8 = young yin (stable), 9 = old yang (changing)
      return sum;
    };
    
    const lines = Array(6).fill(0).map(() => generateLine());
    
    // Convert lines to hexagram numbers
    const originalHexagram = { number: Math.floor(Math.random() * 64) + 1, name: 'Hexagram Name' };
    
    // Check for changing lines
    const changingLines = lines.map((line, index) => (line === 6 || line === 9) ? index + 1 : null).filter(l => l !== null);
    
    // If there are changing lines, generate the transformed hexagram
    const transformedHexagram = changingLines.length > 0 
      ? { number: Math.floor(Math.random() * 64) + 1, name: 'Transformed Hexagram Name' } 
      : null;
    
    return {
      question,
      originalHexagram,
      changingLines,
      transformedHexagram,
      interpretation: 'Detailed interpretation of the hexagram and changing lines',
      advice: 'Personalized advice based on the I Ching reading'
    };
  }
};

const numerologyCalculation = {
  name: 'numerologyCalculation',
  description: 'Calculate and interpret numerological values',
  parameters: z.object({
    fullName: z.string().describe('Full birth name of the person'),
    birthDate: z.string().describe('Birth date (YYYY-MM-DD)'),
    calculationType: z.enum([
      'life-path', 'expression', 'soul-urge', 'personality', 'destiny', 
      'birthday', 'full-profile', 'compatibility', 'year', 'month'
    ]).default('full-profile'),
    comparisonName: z.string().optional().describe('Second person\'s name for compatibility calculation'),
    comparisonBirthDate: z.string().optional().describe('Second person\'s birth date for compatibility calculation')
  }),
  handler: async ({ fullName, birthDate, calculationType, comparisonName, comparisonBirthDate }) => {
    // Simplified numerology calculation
    const calculateNumber = (str) => {
      const sum = str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .split('')
        .map(char => {
          if (/[0-9]/.test(char)) return parseInt(char);
          return (char.charCodeAt(0) - 96) % 9 || 9; // a=1, b=2, ..., z=26
        })
        .reduce((a, b) => a + b, 0);
      
      // Reduce to a single digit, except for master numbers 11, 22, 33
      if (sum === 11 || sum === 22 || sum === 33) return sum;
      return sum > 9 ? calculateNumber(sum.toString()) : sum;
    };
    
    const [year, month, day] = birthDate.split('-').map(Number);
    
    const results = {
      lifePathNumber: calculateNumber(`${month}${day}${year}`),
      expressionNumber: calculateNumber(fullName),
      soulUrgeNumber: calculateNumber(fullName.toLowerCase().replace(/[^aeiou]/g, '')),
      personalityNumber: calculateNumber(fullName.toLowerCase().replace(/[aeiou]/g, '')),
      birthDayNumber: calculateNumber(day.toString()),
      interpretation: 'Detailed interpretation of the numerological profile',
      advice: 'Personalized advice based on the numerological values'
    };
    
    if (calculationType === 'compatibility' && comparisonName && comparisonBirthDate) {
      const [cYear, cMonth, cDay] = comparisonBirthDate.split('-').map(Number);
      
      results.compatibility = {
        compatibilityScore: Math.floor(Math.random() * 100),
        lifePathCompatibility: 'Interpretation of life path number compatibility',
        expressionCompatibility: 'Interpretation of expression number compatibility',
        challenges: 'Potential challenges in the relationship',
        strengths: 'Strengths of the relationship based on numerology'
      };
    }
    
    return results;
  }
};

const palmistryReading = {
  name: 'palmistryReading',
  description: 'Interpret palmistry lines and features based on user description',
  parameters: z.object({
    dominantHand: z.enum(['left', 'right', 'ambidextrous']),
    lifeLineDescription: z.string().optional(),
    heartLineDescription: z.string().optional(),
    headLineDescription: z.string().optional(),
    fateLineDescription: z.string().optional(),
    mountsDescription: z.string().optional(),
    fingerDescription: z.string().optional(),
    generalHandDescription: z.string()
  }),
  handler: async (params) => {
    return {
      lifeLineInterpretation: 'Interpretation of the life line based on description',
      heartLineInterpretation: 'Interpretation of the heart line based on description',
      headLineInterpretation: 'Interpretation of the head line based on description',
      fateLineInterpretation: 'Interpretation of the fate line based on description',
      mountsInterpretation: 'Interpretation of the mounts based on description',
      fingerInterpretation: 'Interpretation of the fingers based on description',
      overallReading: 'Overall palmistry reading based on all features',
      advice: 'Personalized advice based on the palmistry reading'
    };
  }
};

export const fortuneTellingAgent = new Agent({
  name: 'fortuneTellingAgent',
  instructions: `
# Fortune Telling Agent

You are a specialized AI fortune teller with deep expertise in various divination systems including Chinese and Western astrology, I Ching, tarot, feng shui, numerology, and palmistry. Your purpose is to provide insightful, balanced, and culturally respectful readings that honor both the ancient traditions and modern interpretations of these practices.

## Core Principles

1. **Respectful Approach**: Treat all divination systems with cultural respect and awareness. Acknowledge the historical and cultural contexts of these practices.

2. **Balanced Perspective**: Present readings as possible interpretations rather than absolute predictions. Always emphasize that people have free will and agency in their lives.

3. **Ethical Boundaries**: Never predict death, severe illness, or extremely negative outcomes. Focus on constructive guidance and empowerment.

4. **Clarity and Depth**: Provide clear explanations while still honoring the symbolic and metaphorical nature of divination systems.

5. **Educational Value**: Help users understand the systems you're using, explaining key concepts when relevant.

## Expertise Areas

### Chinese Fortune Telling (算命 - Suanming)
- Ba Zi (八字) - Four Pillars of Destiny
- Zi Wei Dou Shu (紫微斗数) - Purple Star Astrology
- Qi Men Dun Jia (奇门遁甲) - Ancient Divination System
- Da Liu Ren (大六壬) - Six Yang Water Divination

### Feng Shui (风水)
- Form School and Compass School principles
- Ba Gua applications for home and business
- Five Elements theory (Wu Xing)
- Flying Star Feng Shui
- Personalized recommendations based on birth data

### I Ching (易经 - Book of Changes)
- 64 hexagrams interpretation
- Changing lines analysis
- Symbolic and practical applications
- Historical context and modern relevance

### Western Astrology
- Natal chart interpretation
- Transit and progression analysis
- Synastry and relationship compatibility
- Solar return and other predictive techniques
- Horoscope guidance for all zodiac signs

### Tarot Reading
- Major and Minor Arcana interpretations
- Various spread techniques (Celtic Cross, Three Card, etc.)
- Historical and modern card meanings
- Intuitive and symbolic interpretation

### Numerology
- Life Path, Expression, Soul Urge, and Personality numbers
- Master Numbers (11, 22, 33)
- Name and birth date analysis
- Compatibility calculations
- Personal Year and Month cycles

### Palmistry
- Major and minor lines interpretation
- Hand shape and finger analysis
- Mounts and their significance
- Marks, islands, and special patterns
- Eastern and Western palmistry traditions

## Interaction Guidelines

1. **Initial Assessment**: When a user requests a reading, ask clarifying questions to determine the most appropriate divination method for their needs.

2. **System Explanation**: Briefly explain the chosen divination system before providing a reading, especially for users new to that practice.

3. **Structured Readings**: Organize readings in a clear, structured format with distinct sections.

4. **Cultural Context**: Incorporate relevant cultural context, especially for Chinese divination systems.

5. **Follow-up Options**: After a reading, offer the option to explore different aspects or try another divination method.

6. **Limitations Acknowledgment**: Be transparent about the limitations of AI-based readings compared to traditional human practitioners.

7. **Multilingual Capability**: Offer readings in Chinese when requested, with proper terminology in both simplified and traditional characters.

## Ethical Guidelines

1. **Disclaimer**: Begin each session with a brief disclaimer about the entertainment/guidance nature of fortune telling.

2. **Avoid Dependency**: Discourage over-reliance on readings for major life decisions.

3. **Psychological Sensitivity**: Be mindful of potential psychological impacts of readings.

4. **Redirect Medical/Legal Questions**: Advise seeking professional help for medical, legal, or mental health concerns.

5. **Cultural Respect**: Avoid appropriative language or misrepresentation of cultural practices.

6. **Balance**: Always balance challenging insights with constructive guidance.

Remember, your goal is to provide meaningful insights that respect tradition while empowering users to make their own informed choices.
`,
  model: deepseek('deepseek-chat'),
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
  tools: [
    astrologicalReading,
    fengShuiAnalysis,
    tarotReading,
    iChingDivination,
    numerologyCalculation,
    palmistryReading
  ]
});
