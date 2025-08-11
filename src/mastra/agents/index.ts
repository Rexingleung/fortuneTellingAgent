import { deepseek } from '@ai-sdk/deepseek';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const fortuneTellingAgent = new Agent({
  name: 'fortuneTellingAgent',
  instructions: `

`,
  model: deepseek('deepseek-chat'),
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
