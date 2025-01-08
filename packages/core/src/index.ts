import type { Message, BotResponse, User } from '@ghai/types';
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

      // TODO: Implement actual message processing logic
      // This is a placeholder that will be replaced with actual AI/processing logic
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

  async validateUser(_user: User): Promise<boolean> {
    // TODO: Implement user validation logic
    // This is a placeholder for future user validation/permissions
    return true;
  }
}

export const createMessageHandler = (): MessageHandler => {
  return new MessageHandler();
};

// Export configuration for convenience
export { config };
