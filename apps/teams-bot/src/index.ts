import {
  ActivityHandler,
  TurnContext,
  MessageFactory,
  BotFrameworkAdapter,
  WebRequest,
  WebResponse,
} from 'botbuilder';
import { config } from '@ghai/config';
import { createMessageHandler } from '@ghai/core';
import type { Message as CommonMessage } from '@ghai/types';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';

if (!config.teams.appId || !config.teams.appPassword) {
  throw new Error('TEAMS_APP_ID and TEAMS_APP_PASSWORD are required');
}

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: config.teams.appId,
  appPassword: config.teams.appPassword,
});

// Error handler with more detailed logging
adapter.onTurnError = async (context, error) => {
  console.error('Bot error:', {
    error: error.message,
    stack: error.stack,
    activity: context.activity
  });
  await context.sendActivity('Sorry, there was a problem processing your request. Please try again.');
};

class TeamsBot extends ActivityHandler {
  private messageHandler = createMessageHandler();

  constructor() {
    super();

    this.onMessage(async (context: TurnContext) => {
      const message = context.activity;
      
      if (message.text?.trim()) {
        const commonMessage: CommonMessage = {
          content: message.text,
          userId: message.from.id,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
          platform: 'teams',
        };

        try {
          const response = await this.messageHandler.processMessage(commonMessage);
          await context.sendActivity(MessageFactory.text(response.content));
        } catch (error) {
          console.error('Message processing error:', error);
          await context.sendActivity(MessageFactory.text('Sorry, I encountered an error processing your message.'));
        }
      }
    });
  }
}

const bot = new TeamsBot();

// Helper function to read the request body
const getRequestBody = async (req: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks).toString('utf8');
};

// Create HTTP server with improved error handling
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== 'POST') {
    res.writeHead(200);
    res.end('Teams bot is running!');
    return;
  }

  try {
    // Convert the Node.js request/response to Bot Framework Web types
    const body = await getRequestBody(req);
    
    const webRequest: WebRequest = {
      body,
      headers: req.headers,
      method: req.method,
    };

    const webResponse: WebResponse = {
      status: (code: number) => {
        res.statusCode = code;
        return webResponse;
      },
      send: (body: string) => {
        res.end(body);
        return Promise.resolve();
      },
      end: () => {
        res.end();
        return Promise.resolve();
      },
    };

    await adapter.processActivity(webRequest, webResponse, async (context) => {
      await bot.run(context);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end('Internal server error');
  }
});

const port = process.env.PORT || 3978;
server.listen(port, () => {
  console.log(`Teams bot is running on port ${port}`);
});

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
