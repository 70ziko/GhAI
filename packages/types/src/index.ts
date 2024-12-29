// Common types for both Discord and Teams bots

export interface Message {
  content: string;
  userId: string;
  timestamp: Date;
  platform: 'discord' | 'teams';
}

export interface User {
  id: string;
  name: string;
  platform: 'discord' | 'teams';
}

export interface BotResponse {
  content: string;
  error?: string;
}
