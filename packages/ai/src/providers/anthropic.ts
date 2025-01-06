import { Anthropic } from "@anthropic-ai/sdk";
import {
  AnthropicModelId,
  anthropicDefaultModelId,
  anthropicModels,
  ApiHandlerOptions,
  ModelInfo,
  ApiStream,
  ApiMessage
} from "@ghai/types";
import { ApiHandler } from "../index";

export class AnthropicHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: Anthropic

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new Anthropic({
			apiKey: this.options.apiKey,
			baseURL: this.options.anthropicBaseUrl || undefined,
		})
	}

	async *createMessage(systemPrompt: string, messages: ApiMessage[]): ApiStream {
		const modelId = this.getModel().id;
		
		// Convert messages to Anthropic format, handling system message as a user message
		const anthropicMessages = messages
			.filter(msg => msg.role !== 'system')
			.map(msg => ({
				role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
				content: msg.content
			}));

		const stream = await this.client.messages.create({
			model: modelId,
			max_tokens: this.getModel().info.maxTokens || 8192,
			temperature: 0,
			system: systemPrompt,
			messages: anthropicMessages,
			stream: true
		});

		for await (const chunk of stream) {
			switch (chunk.type) {
				case "message_start":
					if (chunk.message.usage) {
						yield {
							type: "usage",
							inputTokens: chunk.message.usage.input_tokens,
							outputTokens: chunk.message.usage.output_tokens
						}
					}
					break
				case "message_stop":
					// no usage data, just an indicator that the message is done
					break
				case "content_block_start":
					switch (chunk.content_block.type) {
						case "text":
							// we may receive multiple text blocks, in which case just insert a line break between them
							if (chunk.index > 0) {
								yield {
									type: "text",
									text: "\n",
								}
							}
							yield {
								type: "text",
								text: chunk.content_block.text,
							}
							break
					}
					break
				case "content_block_delta":
					switch (chunk.delta.type) {
						case "text_delta":
							yield {
								type: "text",
								text: chunk.delta.text,
							}
							break
					}
					break
				case "content_block_stop":
					break
			}
		}
	}

	getModel(): { id: AnthropicModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in anthropicModels) {
			const id = modelId as AnthropicModelId
			return { id, info: anthropicModels[id] }
		}
		return { id: anthropicDefaultModelId, info: anthropicModels[anthropicDefaultModelId] }
	}
}
