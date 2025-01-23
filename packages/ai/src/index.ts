import { ApiConfiguration, ModelInfo, ApiMessage } from "@ghai/types";
import { AnthropicHandler } from "./providers/anthropic";
import { ApiStream } from "./transform/stream";

export interface ApiHandler {
    createMessage(systemPrompt: string, messages: ApiMessage[]): ApiStream;
    getModel(): { id: string; info: ModelInfo };
}

export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
  const { apiProvider, ...options } = configuration;
  switch (apiProvider) {
    case "anthropic":
      return new AnthropicHandler(options);
    default:
      throw new Error(`Unsupported API provider: ${apiProvider}`);
  }
}
