import type { Message, BotResponse} from '@ghai/types';
import { config } from '@ghai/config';

export class MessageHandler {
  async processMessage(message: Message): Promise<BotResponse> {
    try {
      if (!message.content.trim()) {
        return {
          content: 'Message content cannot be empty',
          error: 'EMPTY_CONTENT'
        };
      }
      
      console.log('Received message:', message);

      return {
        content: `Received message from ${message.platform}: ${message.content}`
      };
    } catch (error) {
      console.error('Error processing message:', error); 
      return {
        content: 'An error occurred while processing your message',
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
      };
    }
  }
}

export const createMessageHandler = (): MessageHandler => {
  return new MessageHandler();
};

export { config };
