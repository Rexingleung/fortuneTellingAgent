# Fortune Telling Agent

A comprehensive AI agent for various divination methods including astrology, feng shui, tarot, I Ching, numerology, and palmistry. This agent is built using the Mastra framework.

## Features

This Fortune Telling Agent is capable of:

- **Chinese Fortune Telling (算命 - Suanming)**
  - Ba Zi (八字) - Four Pillars of Destiny
  - Zi Wei Dou Shu (紫微斗数) - Purple Star Astrology
  - Qi Men Dun Jia (奇门遁甲) - Ancient Divination System
  - Da Liu Ren (大六壬) - Six Yang Water Divination

- **Feng Shui (风水)**
  - Form School and Compass School principles
  - Ba Gua applications for home and business
  - Five Elements theory (Wu Xing)
  - Flying Star Feng Shui
  - Personalized recommendations

- **I Ching (易经 - Book of Changes)**
  - 64 hexagrams interpretation
  - Changing lines analysis
  - Symbolic and practical applications

- **Western Astrology**
  - Natal chart interpretation
  - Transit and progression analysis
  - Synastry and relationship compatibility
  - Horoscope guidance

- **Tarot Reading**
  - Major and Minor Arcana interpretations
  - Various spread techniques (Celtic Cross, Three Card, etc.)
  - Intuitive and symbolic interpretation

- **Numerology**
  - Life Path, Expression, Soul Urge, and Personality numbers
  - Master Numbers (11, 22, 33)
  - Name and birth date analysis
  - Compatibility calculations

- **Palmistry**
  - Major and minor lines interpretation
  - Hand shape and finger analysis
  - Mounts and their significance

## Getting Started

### Prerequisites

- Node.js (v20.9.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Rexingleung/fortuneTellingAgent.git
   cd fortuneTellingAgent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Usage

Once the server is running, you can interact with the fortune telling agent by sending requests to the appropriate endpoint. The agent accepts various types of divination requests and returns detailed interpretations.

#### Example Conversations

**Astrology Reading:**
```
User: I'd like to know what the stars say about my career this month. I was born on April 15, 1988 in Shanghai.

Agent: I'd be happy to provide an astrological reading for your career this month. I'll need a bit more information to give you the most accurate reading. Do you happen to know your birth time?

User: Yes, I was born at 7:30 AM.

Agent: [Provides detailed astrological reading based on the birth information]
```

**Tarot Reading:**
```
User: Can you do a three-card tarot reading about my relationship?

Agent: I'd be happy to do a three-card tarot reading for your relationship. This spread will show the past, present, and future influences. Do you have a specific question or aspect of your relationship you'd like to focus on?

User: I want to know if my current relationship will develop into something more serious.

Agent: [Performs tarot reading with detailed card interpretations]
```

**Feng Shui Consultation:**
```
User: I just moved into a new apartment facing south. How should I arrange my bedroom for the best energy?

Agent: [Provides feng shui recommendations for bedroom arrangement]
```

## Available Tools

The agent comes with the following specialized tools:

- `astrologicalReading`: Provides horoscope analysis based on birth details
- `fengShuiAnalysis`: Offers feng shui recommendations for spaces
- `tarotReading`: Performs various tarot card spreads and interpretations
- `iChingDivination`: Conducts I Ching readings with hexagram interpretation
- `numerologyCalculation`: Calculates and interprets numerological values
- `palmistryReading`: Interprets palmistry lines and features

## Ethical Guidelines

This fortune telling agent follows these ethical principles:

1. Provides readings as possible interpretations rather than absolute predictions
2. Emphasizes that people have free will and agency in their lives
3. Never predicts death, severe illness, or extremely negative outcomes
4. Focuses on constructive guidance and empowerment
5. Respects cultural contexts of different divination practices
6. Encourages seeking professional help for medical, legal, or mental health concerns

## Development

To modify or extend the agent:

1. Update the instructions in `src/mastra/agents/index.ts`
2. Add new tools or enhance existing ones in the same file
3. Restart the development server to apply changes

## License

This project is licensed under the ISC License.

## Acknowledgments

- This agent uses the Deepseek AI model
- Built with the Mastra agent framework
