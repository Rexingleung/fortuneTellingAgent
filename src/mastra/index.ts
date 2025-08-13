
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { fortuneTellingAgent } from './agents';
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  agents: { fortuneTellingAgent },
  // storage: new LibSQLStore({
  //   // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
  //   url: ":memory:",
  // }),

  deployer: new CloudflareDeployer({
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
