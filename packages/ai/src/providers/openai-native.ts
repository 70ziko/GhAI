import OpenAI from "openai"
import { ApiHandler } from "../"
import {
	ApiHandlerOptions,
	ModelInfo,
	openAiNativeDefaultModelId,
	OpenAiNativeModelId,
	openAiNativeModels,
	ApiMessage,
} from "@ghai/types"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { ApiStream } from "../transform/stream"

export class OpenAiNativeHandler implements ApiHandler {
	private options: ApiHandlerOptions
	private client: OpenAI

	constructor(options: ApiHandlerOptions) {
		this.options = options
		this.client = new OpenAI({
			apiKey: this.options.openAiNativeApiKey,
		})
	}

	async *createMessage(systemPrompt: string, messages: ApiMessage[]): ApiStream {
		switch (this.getModel().id) {
			case "o1-preview":
			case "o1-mini": {
				// o1 doesnt support streaming, non-1 temp, or system prompt
				const response = await this.client.chat.completions.create({
          model: this.getModel().id,
          messages: [
            { role: "user", content: systemPrompt },
            ...convertToOpenAiMessages(
              messages.filter(
                (
                  message
                ): message is ApiMessage & { role: "user" | "assistant" } =>
                  message.role !== "system"
              )
            ),
            { role: "system", content: systemPrompt },
          ],
        });
				yield {
					type: "text",
					text: response.choices[0]?.message.content || "",
				}
				yield {
					type: "usage",
					inputTokens: response.usage?.prompt_tokens || 0,
					outputTokens: response.usage?.completion_tokens || 0,
				}
				break
			}
			default: {
				const stream = await this.client.chat.completions.create({
          model: this.getModel().id,
          // max_completion_tokens: this.getModel().info.maxTokens,
          temperature: 0,
          messages: [
            { role: "system", content: systemPrompt },
            ...convertToOpenAiMessages(
              messages.filter(
                (
                  message
                ): message is ApiMessage & { role: "user" | "assistant" } =>
                  message.role !== "system"
              )
            ),
            { role: "system", content: systemPrompt },
          ],
          stream: true,
          stream_options: { include_usage: true },
        });

				for await (const chunk of stream) {
					const delta = chunk.choices[0]?.delta
					if (delta?.content) {
						yield {
							type: "text",
							text: delta.content,
						}
					}

					// contains a null value except for the last chunk which contains the token usage statistics for the entire request
					if (chunk.usage) {
						yield {
							type: "usage",
							inputTokens: chunk.usage.prompt_tokens || 0,
							outputTokens: chunk.usage.completion_tokens || 0,
						}
					}
				}
			}
		}
	}

	getModel(): { id: OpenAiNativeModelId; info: ModelInfo } {
		const modelId = this.options.apiModelId
		if (modelId && modelId in openAiNativeModels) {
			const id = modelId as OpenAiNativeModelId
			return { id, info: openAiNativeModels[id] }
		}
		return { id: openAiNativeDefaultModelId, info: openAiNativeModels[openAiNativeDefaultModelId] }
	}
}
