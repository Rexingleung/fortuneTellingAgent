# Fortune Telling Agent

A comprehensive AI agent for various divination methods including astrology, feng shui, tarot, I Ching, numerology, palmistry, and Ba Zi. This agent is built using the Mastra framework and integrates with Deepseek AI.

## 🌟 Features

This Fortune Telling Agent provides expertise in:

### 🏮 Chinese Fortune Telling (算命 - Suanming)
- **Ba Zi (八字)** - Four Pillars of Destiny analysis
- **Chinese Zodiac** - 12 animal signs with elemental influences
- **Feng Shui (风水)** - Environmental energy optimization
- **I Ching (易经)** - Book of Changes divination

### 🔮 Western Divination
- **Western Astrology** - Zodiac signs, planetary influences, houses
- **Tarot Reading** - Multiple spread types with detailed interpretations
- **Numerology** - Life path, expression, soul urge calculations
- **Palmistry** - Hand reading and line interpretation

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.9.0 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rexingleung/fortuneTellingAgent.git
   cd fortuneTellingAgent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🛠️ Available Tools

The agent includes these specialized tools:

### 1. Astrological Reading
```typescript
astrologicalReading({
  birthDate: "1990-04-15",
  birthTime: "07:30", // optional
  birthLocation: "Shanghai, China",
  question: "What does this month hold for my career?" // optional
})
```

### 2. Feng Shui Analysis
```typescript
fengShuiAnalysis({
  spaceType: "bedroom",
  facing: "south", // optional
  concerns: ["sleep quality", "relationship harmony"],
  birthYear: 1990, // optional for personalization
  description: "Small bedroom with window facing south..."
})
```

### 3. Tarot Reading
```typescript
tarotReading({
  spreadType: "three-card", // single, celtic-cross, relationship, career, yes-no
  question: "Will my relationship develop into something serious?"
})
```

### 4. I Ching Divination
```typescript
iChingDivination({
  question: "Should I accept the new job offer?",
  method: "three-coin" // or yarrow-stalk
})
```

### 5. Numerology Calculation
```typescript
numerologyCalculation({
  fullName: "John Smith",
  birthDate: "1990-04-15",
  calculationType: "full-profile", // or compatibility
  comparisonName: "Jane Doe", // for compatibility
  comparisonBirthDate: "1992-08-20" // for compatibility
})
```

### 6. Palmistry Reading
```typescript
palmistryReading({
  dominantHand: "right",
  lifeLineDescription: "Long and deep, curves around thumb",
  heartLineDescription: "Straight across palm",
  headLineDescription: "Clear and long",
  generalDescription: "Square palm with long fingers"
})
```

### 7. Ba Zi Reading (Chinese Four Pillars)
```typescript
baZiReading({
  birthDate: "1990-04-15",
  birthTime: "07:30",
  gender: "female",
  question: "What career path suits me best?" // optional
})
```

## 📋 Usage Examples

### Basic Astrology Reading
```javascript
const reading = await fortuneTellingAgent.astrologicalReading({
  birthDate: "1988-04-15",
  birthLocation: "Shanghai, China",
  question: "What are my career prospects this year?"
});
```

### Feng Shui Home Analysis
```javascript
const analysis = await fortuneTellingAgent.fengShuiAnalysis({
  spaceType: "living_room",
  facing: "northeast",
  concerns: ["family harmony", "prosperity"],
  birthYear: 1985,
  description: "Open plan living room with large windows facing northeast..."
});
```

### Comprehensive Numerology Profile
```javascript
const profile = await fortuneTellingAgent.numerologyCalculation({
  fullName: "Alexandra Johnson",
  birthDate: "1990-07-22",
  calculationType: "full-profile"
});
```

## 🎯 Agent Capabilities

### Conversation Examples

**Western Astrology:**
> **User:** "I'm an Aries born on April 15, 1988, in Los Angeles. What should I focus on this month?"
> 
> **Agent:** "As an Aries with strong fire energy, this month encourages you to channel your natural leadership abilities. Your ruling planet Mars suggests taking initiative in career matters..."

**Chinese Ba Zi:**
> **User:** "Can you do a Ba Zi reading for someone born on June 10, 1995, at 3:00 PM?"
> 
> **Agent:** "I'd be happy to analyze the Four Pillars of Destiny. Based on this birth information, the dominant element is Wood, suggesting growth and creativity..."

**Tarot Guidance:**
> **User:** "I need guidance about a difficult decision. Can you do a three-card reading?"
> 
> **Agent:** "I'll perform a Past-Present-Future spread for your decision. The cards drawn are: The Fool (past), The Magician (present), and The Star (future)..."

## ⚖️ Ethical Guidelines

This agent follows these principles:

1. **Interpretive Nature**: Readings are presented as possible interpretations, not absolute predictions
2. **Free Will**: Emphasizes personal agency and choice
3. **Positive Focus**: Avoids predicting death, severe illness, or extremely negative outcomes
4. **Cultural Respect**: Honors the traditions and cultural contexts of each divination system
5. **Professional Boundaries**: Recommends seeking professional help for medical, legal, or mental health concerns
6. **Educational Approach**: Explains the systems and their historical contexts

## 🏗️ Architecture

### Project Structure
```
fortuneTellingAgent/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── index.ts          # Main agent implementation
│       ├── data/                 # JSON data files
│       │   ├── astrology.json    # Western & Chinese astrology data
│       │   ├── fengshui.json     # Feng shui principles & directions
│       │   ├── iching.json       # I Ching hexagrams
│       │   ├── numerology.json   # Number meanings & interpretations
│       │   ├── palmistry.json    # Palm reading data
│       │   └── tarot.json        # Tarot card meanings
│       └── index.ts              # Mastra configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Data Integration

The agent uses structured JSON data files for accurate interpretations:

- **astrology.json**: Contains zodiac signs, planets, houses, and Chinese zodiac animals
- **tarot.json**: Major and Minor Arcana with upright/reversed meanings
- **iching.json**: 64 hexagrams with traditional interpretations
- **numerology.json**: Number meanings and master number significance
- **fengshui.json**: Directional analysis and Ba Gua principles
- **palmistry.json**: Hand shapes, lines, and mounts interpretations

## 🔧 Development

### Adding New Features

1. **New Divination System**: Add data file in `/src/mastra/data/` and create corresponding tool in `/src/mastra/agents/index.ts`

2. **Enhanced Calculations**: Modify utility functions for more accurate astronomical or mathematical calculations

3. **Cultural Expansions**: Add regional variations of existing systems (e.g., Vedic astrology, Celtic tarot interpretations)

### Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📖 API Reference

### Agent Methods

All tools are accessible through the `fortuneTellingAgent` instance:

```typescript
import { fortuneTellingAgent } from './src/mastra/agents';

// Use any tool
const result = await fortuneTellingAgent.run({
  messages: [{
    role: 'user',
    content: 'Can you do an astrology reading for someone born April 15, 1990?'
  }]
});
```

### Tool Parameters

Each tool has specific parameter requirements. See the individual tool documentation above for detailed schemas.

## 🌍 Cultural Context

### Chinese Systems
- **Ba Zi (八字)**: Requires precise birth time for accurate Four Pillars calculation
- **Feng Shui (风水)**: Incorporates both Form School (峦头派) and Compass School (理气派) principles
- **I Ching (易经)**: Uses traditional coin toss or yarrow stalk methods for hexagram generation

### Western Systems  
- **Astrology**: Combines sun sign interpretation with planetary influences
- **Tarot**: Supports multiple spread types from simple single-card to complex Celtic Cross
- **Numerology**: Uses Pythagorean system with master number recognition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Respect cultural traditions and accuracy in implementations
- Add appropriate error handling and validation
- Include comprehensive documentation for new features
- Follow the existing code style and patterns

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Mastra](https://mastra.ai) agent framework
- Powered by [Deepseek AI](https://deepseek.com) language model
- Cultural consultation for authentic traditional practices
- Community contributions and feedback

## 📞 Support

For questions, issues, or feature requests:

1. Check existing [Issues](https://github.com/Rexingleung/fortuneTellingAgent/issues)
2. Create a new issue with detailed description
3. Join our community discussions

---

**Note**: This fortune telling agent is designed for entertainment and guidance purposes. It should not be used as a substitute for professional advice in medical, legal, financial, or psychological matters. All interpretations are based on traditional divination systems and should be considered as one perspective among many in making life decisions.
