export type ApiProvider =
    | "anthropic"
    | "openrouter"
    | "bedrock"
    | "vertex"
    | "openai"
    | "ollama"
    | "lmstudio"
    | "gemini"
    | "openai-native"
    | "deepseek"

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
    apiProvider?: ApiProvider
}

// Models
import { ModelInfo } from "./index"

// Anthropic
// https://docs.anthropic.com/en/docs/about-claude/models
export type AnthropicModelId = keyof typeof anthropicModels
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20241022"
export const anthropicModels = {
    "claude-3-5-sonnet-20241022": {
        name: "Claude 3.5 Sonnet",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: true,
        supportsComputerUse: true,
        supportsPromptCache: true,
        inputPrice: 3.0, // $3 per million input tokens
        outputPrice: 15.0, // $15 per million output tokens
        cacheWritesPrice: 3.75, // $3.75 per million tokens
        cacheReadsPrice: 0.3, // $0.30 per million tokens
    },
    "claude-3-5-haiku-20241022": {
        name: "Claude 3.5 Haiku",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: false,
        supportsPromptCache: true,
        inputPrice: 1.0,
        outputPrice: 5.0,
        cacheWritesPrice: 1.25,
        cacheReadsPrice: 0.1,
    },
    "claude-3-opus-20240229": {
        name: "Claude 3 Opus",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: true,
        inputPrice: 15.0,
        outputPrice: 75.0,
        cacheWritesPrice: 18.75,
        cacheReadsPrice: 1.5,
    },
    "claude-3-haiku-20240307": {
        name: "Claude 3 Haiku",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: true,
        inputPrice: 0.25,
        outputPrice: 1.25,
        cacheWritesPrice: 0.3,
        cacheReadsPrice: 0.03,
    },
} as const satisfies Record<string, ModelInfo>

// AWS Bedrock
// https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
export type BedrockModelId = keyof typeof bedrockModels
export const bedrockDefaultModelId: BedrockModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0"
export const bedrockModels = {
    "anthropic.claude-3-5-sonnet-20241022-v2:0": {
        name: "Claude 3.5 Sonnet",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: true,
        supportsComputerUse: true,
        supportsPromptCache: false,
        inputPrice: 3.0,
        outputPrice: 15.0,
    },
    "anthropic.claude-3-5-haiku-20241022-v1:0": {
        name: "Claude 3.5 Haiku",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: false,
        supportsPromptCache: false,
        inputPrice: 1.0,
        outputPrice: 5.0,
    },
    "anthropic.claude-3-5-sonnet-20240620-v1:0": {
        name: "Claude 3.5 Sonnet",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 3.0,
        outputPrice: 15.0,
    },
    "anthropic.claude-3-opus-20240229-v1:0": {
        name: "Claude 3 Opus",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 15.0,
        outputPrice: 75.0,
    },
    "anthropic.claude-3-sonnet-20240229-v1:0": {
        name: "Claude 3 Sonnet",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 3.0,
        outputPrice: 15.0,
    },
    "anthropic.claude-3-haiku-20240307-v1:0": {
        name: "Claude 3 Haiku",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0.25,
        outputPrice: 1.25,
    },
} as const satisfies Record<string, ModelInfo>

// OpenRouter
// https://openrouter.ai/models?order=newest&supported_parameters=tools
export const openRouterDefaultModelId = "anthropic/claude-3.5-sonnet:beta" // will always exist in openRouterModels
export const openRouterDefaultModelInfo: ModelInfo = {
    name: "Claude 3.5 Sonnet",
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: true,
    supportsPromptCache: true,
    inputPrice: 3.0,
    outputPrice: 15.0,
    cacheWritesPrice: 3.75,
    cacheReadsPrice: 0.3,
    description:
        "The new Claude 3.5 Sonnet delivers better-than-Opus capabilities, faster-than-Sonnet speeds, at the same Sonnet prices. Sonnet is particularly good at:\n\n- Coding: New Sonnet scores ~49% on SWE-Bench Verified, higher than the last best score, and without any fancy prompt scaffolding\n- Data science: Augments human data science expertise; navigates unstructured data while using multiple tools for insights\n- Visual processing: excelling at interpreting charts, graphs, and images, accurately transcribing text to derive insights beyond just the text alone\n- Agentic tasks: exceptional tool use, making it great at agentic tasks (i.e. complex, multi-step problem solving tasks that require engaging with other systems)\n\n#multimodal\n\n_This is a faster endpoint, made available in collaboration with Anthropic, that is self-moderated: response moderation happens on the provider's side instead of OpenRouter's. For requests that pass moderation, it's identical to the [Standard](/anthropic/claude-3.5-sonnet) variant._",
}

// Vertex AI
// https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
export type VertexModelId = keyof typeof vertexModels
export const vertexDefaultModelId: VertexModelId = "claude-3-5-sonnet-v2@20241022"
export const vertexModels = {
    "claude-3-5-sonnet-v2@20241022": {
        name: "Claude 3.5 Sonnet",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: true,
        supportsComputerUse: true,
        supportsPromptCache: false,
        inputPrice: 3.0,
        outputPrice: 15.0,
    },
    "claude-3-5-sonnet@20240620": {
        name: "Claude 3.5 Sonnet",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 3.0,
        outputPrice: 15.0,
    },
    "claude-3-5-haiku@20241022": {
        name: "Claude 3.5 Haiku",
        maxTokens: 8192,
        contextWindow: 200_000,
        supportsImages: false,
        supportsPromptCache: false,
        inputPrice: 1.0,
        outputPrice: 5.0,
    },
    "claude-3-opus@20240229": {
        name: "Claude 3 Opus",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 15.0,
        outputPrice: 75.0,
    },
    "claude-3-haiku@20240307": {
        name: "Claude 3 Haiku",
        maxTokens: 4096,
        contextWindow: 200_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0.25,
        outputPrice: 1.25,
    },
} as const satisfies Record<string, ModelInfo>

export const openAiModelInfoSaneDefaults: ModelInfo = {
    name: "OpenAI Model",
    maxTokens: -1,
    contextWindow: 128_000,
    supportsImages: true,
    supportsPromptCache: false,
    pricing: {
        input: 0,
        output: 0,
        cacheWrites: 0 as number | undefined,
        cacheReads: 0 as number | undefined,
    } as const,
}

// Gemini
// https://ai.google.dev/gemini-api/docs/models/gemini
export type GeminiModelId = keyof typeof geminiModels
export const geminiDefaultModelId: GeminiModelId = "gemini-2.0-flash-thinking-exp-1219"
export const geminiModels = {
    "gemini-2.0-flash-thinking-exp-1219": {
        name: "Gemini 2.0 Flash Thinking",
        maxTokens: 8192,
        contextWindow: 32_767,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-2.0-flash-exp": {
        name: "Gemini 2.0 Flash",
        maxTokens: 8192,
        contextWindow: 1_048_576,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-exp-1206": {
        name: "Gemini Exp 1206",
        maxTokens: 8192,
        contextWindow: 2_097_152,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-1.5-flash-002": {
        name: "Gemini 1.5 Flash",
        maxTokens: 8192,
        contextWindow: 1_048_576,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-1.5-flash-exp-0827": {
        name: "Gemini 1.5 Flash Exp",
        maxTokens: 8192,
        contextWindow: 1_048_576,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-1.5-flash-8b-exp-0827": {
        name: "Gemini 1.5 Flash 8B Exp",
        maxTokens: 8192,
        contextWindow: 1_048_576,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-1.5-pro-002": {
        name: "Gemini 1.5 Pro",
        maxTokens: 8192,
        contextWindow: 2_097_152,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
    "gemini-1.5-pro-exp-0827": {
        name: "Gemini 1.5 Pro Exp",
        maxTokens: 8192,
        contextWindow: 2_097_152,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0,
        outputPrice: 0,
    },
} as const satisfies Record<string, ModelInfo>

// OpenAI Native
// https://openai.com/api/pricing/
export type OpenAiNativeModelId = keyof typeof openAiNativeModels
export const openAiNativeDefaultModelId: OpenAiNativeModelId = "gpt-4o"
export const openAiNativeModels = {
    // don't support tool use yet
    "o1-preview": {
        name: "O1 Preview",
        maxTokens: 32_768,
        contextWindow: 128_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 15,
        outputPrice: 60,
        pricing: {
            input: 15,
            output: 60,
        },
    },
    "o1-mini": {
        name: "O1 Mini",
        maxTokens: 65_536,
        contextWindow: 128_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 3,
        outputPrice: 12,
        pricing: {
            input: 3,
            output: 12,
        },
    },
    "gpt-4o": {
        name: "GPT-4O",
        maxTokens: 4_096,
        contextWindow: 128_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 5,
        outputPrice: 15,
        pricing: {
            input: 5,
            output: 15,
        },
    },
    "gpt-4o-mini": {
        name: "GPT-4O Mini",
        maxTokens: 16_384,
        contextWindow: 128_000,
        supportsImages: true,
        supportsPromptCache: false,
        inputPrice: 0.15,
        outputPrice: 0.6,
        pricing: {
            input: 0.15,
            output: 0.6,
        },
    },
} as const satisfies Record<string, ModelInfo>

// Azure OpenAI
// https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
// https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#api-specs
export const azureOpenAiDefaultApiVersion = "2024-08-01-preview"

// DeepSeek
// https://api-docs.deepseek.com/quick_start/pricing
export type DeepSeekModelId = keyof typeof deepSeekModels
export const deepSeekDefaultModelId: DeepSeekModelId = "deepseek-chat"
export const deepSeekModels = {
    "deepseek-chat": {
        name: "DeepSeek Chat",
        maxTokens: 8_000,
        contextWindow: 64_000,
        supportsImages: false,
        supportsPromptCache: true, // supports context caching, but not in the way anthropic does it (deepseek reports input tokens and reads/writes in the same usage report) FIXME: we need to show users cache stats how deepseek does it
        inputPrice: 0, // technically there is no input price, it's all either a cache hit or miss (ApiOptions will not show this)
        outputPrice: 0.28,
        cacheWritesPrice: 0.14,
        cacheReadsPrice: 0.014,
    },
} as const satisfies Record<string, ModelInfo>
