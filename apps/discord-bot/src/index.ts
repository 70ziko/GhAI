import { Client, Events, GatewayIntentBits } from 'discord.js';
import { config } from '@ghai/config';
import { createMessageHandler } from '@ghai/core';
import type { Message as CommonMessage } from '@ghai/types';

if (!config.discord.token) {
  throw new Error('DISCORD_TOKEN is required');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const messageHandler = createMessageHandler();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  const commonMessage: CommonMessage = {
    content: message.content,
    userId: message.author.id,
    timestamp: message.createdAt,
    platform: 'discord',
  };

  const response = await messageHandler.processMessage(commonMessage);
  
  try {
    await message.reply(response.content);
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

client.login(config.discord.token);

// Handle process termination
process.on('SIGINT', () => {
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  client.destroy();
  process.exit(0);
});
