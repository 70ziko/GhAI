export * from "./api";
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


export interface ModelInfo {
  name: string;
  maxTokens?: number;
  contextWindow?: number;
  supportsImages?: boolean;
  supportsComputerUse?: boolean;
  supportsPromptCache: boolean;
  pricing?: {
    input: number;
    output: number;
    cacheWrites?: number;
    cacheReads?: number;
  };
  inputPrice?: number;
  outputPrice?: number;
  cacheWritesPrice?: number;
  cacheReadsPrice?: number;
  description?: string;
}

export interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type ApiProvider =
  | "anthropic"
  | "openrouter"
  | "bedrock"
  | "vertex"
  | "openai"
  | "ollama"
  | "lmstudio"
  | "gemini"
  | "openai-native";

export interface ApiHandlerOptions {
  apiModelId?: string
  apiKey?: string // anthropic
  anthropicBaseUrl?: string
  openRouterApiKey?: string
  openRouterModelId?: string
  openRouterModelInfo?: ModelInfo
  awsAccessKey?: string
  awsSecretKey?: string
  awsSessionToken?: string
  awsRegion?: string
  awsUseCrossRegionInference?: boolean
  vertexProjectId?: string
  vertexRegion?: string
  openAiBaseUrl?: string
  openAiApiKey?: string
  openAiModelId?: string
  ollamaModelId?: string
  ollamaBaseUrl?: string
  lmStudioModelId?: string
  lmStudioBaseUrl?: string
  geminiApiKey?: string
  openAiNativeApiKey?: string
  deepSeekApiKey?: string
  azureApiVersion?: string
}

export type ApiConfiguration = ApiHandlerOptions & {
  apiProvider?: ApiProvider;
}

// Anthropic Models
export type AnthropicModelId = keyof typeof anthropicModels;
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20241022";

export const anthropicModels = {
  "claude-3-5-sonnet-20241022": {
    name: "Claude 3.5 Sonnet",
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    pricing: {
      input: 3.0,
      output: 15.0,
      cacheWrites: 3.75,
      cacheReads: 0.3
    }
  },
  "claude-3-5-haiku-20241022": {
    name: "Claude 3.5 Haiku",
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: false,
    supportsPromptCache: true,
    pricing: {
      input: 1.0,
      output: 5.0,
      cacheWrites: 1.25,
      cacheReads: 0.1
    }
  },
  "claude-3-opus-20240229": {
    name: "Claude 3 Opus",
    maxTokens: 4096,
    contextWindow: 200_000,
    supportsImages: true,
    supportsPromptCache: true,
    pricing: {
      input: 15.0,
      output: 75.0,
      cacheWrites: 18.75,
      cacheReads: 1.5
    }
  },
  "claude-3-haiku-20240307": {
    name: "Claude 3 Haiku",
    maxTokens: 4096,
    contextWindow: 200_000,
    supportsImages: true,
    supportsPromptCache: true,
    pricing: {
      input: 0.25,
      output: 1.25,
      cacheWrites: 0.3,
      cacheReads: 0.03
    }
  },
} as const satisfies Record<string, ModelInfo>;

export type ApiStreamChunk = ApiStreamTextChunk | ApiStreamUsageChunk;

export interface ApiStreamTextChunk {
  type: "text";
  text: string;
}

export interface ApiStreamUsageChunk {
  type: "usage";
  inputTokens: number;
  outputTokens: number;
  cacheWriteTokens?: number;
  cacheReadTokens?: number;
  totalCost?: number; // openrouter
}

export type ApiStream = AsyncGenerator<ApiStreamChunk, void, unknown>;
