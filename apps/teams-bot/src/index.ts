import {
  ActivityHandler,
  TurnContext,
  MessageFactory,
  BotFrameworkAdapter,
} from 'botbuilder';
import { config } from '@ghai/config';
import { createMessageHandler } from '@ghai/core';
import type { Message as CommonMessage } from '@ghai/types';

if (!config.teams.appId || !config.teams.appPassword) {
  throw new Error('TEAMS_APP_ID and TEAMS_APP_PASSWORD are required');
}

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: config.teams.appId,
  appPassword: config.teams.appPassword,
});

// Error handler
adapter.onTurnError = async (context, error) => {
  console.error(`Error processing request: ${error}`);
  await context.sendActivity('An error occurred processing your request.');
};

class TeamsBot extends ActivityHandler {
  private messageHandler = createMessageHandler();

  constructor() {
    super();

    this.onMessage(async (context: TurnContext) => {
      const message = context.activity;
      
      if (message.text) {
        const commonMessage: CommonMessage = {
          content: message.text,
          userId: message.from.id,
          timestamp: new Date(message.timestamp),
          platform: 'teams',
        };

        const response = await this.messageHandler.processMessage(commonMessage);
        await context.sendActivity(MessageFactory.text(response.content));
      }
    });
  }
}

const bot = new TeamsBot();

// Start server
import * as http from 'http';

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks).toString();
      try {
        await adapter.processActivity(req, res, async (context) => {
          await bot.run(context);
        });
      } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end();
      }
    });
  } else {
    res.writeHead(200);
    res.end('Teams bot is running!');
  }
});

const port = process.env.PORT || 3978;
server.listen(port, () => {
  console.log(`Teams bot is running on port ${port}`);
});

// Handle process termination
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.close();
  process.exit(0);
});
