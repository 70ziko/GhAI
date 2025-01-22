import { ApiConfiguration, ModelInfo, ApiMessage } from "@ghai/types";
import { AnthropicHandler } from "./providers/anthropic";
import { ApiStream } from "./transform/stream";

export interface ApiHandler {
    createMessage(systemPrompt: string, messages: ApiMessage[]): ApiStream;
    getModel(): { id: string; info: ModelInfo };
}

export function buildApiHandler(configuration: ApiConfiguration): ApiHandler {
    // For now, we only support Anthropic
    const { apiProvider, ...options } = configuration;
    return new AnthropicHandler(options);
}
