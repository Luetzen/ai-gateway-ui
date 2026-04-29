import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { ComputedRef } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';
import { StoreDefinition } from 'pinia';

declare const __VLS_component: DefineComponent<__VLS_Props, {}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {}, string, PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, ComponentProvideOptions, false, {}, HTMLDivElement>;

declare type __VLS_Props = {
    /** The Pinia store instance returned by `createAiSettingsStore()(pinia)` */
    store: any;
};

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        footer?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLDivElement;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare interface AiChatRequest {
    model?: AiModel;
    system?: string;
    messages: AiMessage[];
    max_tokens?: number;
    temperature?: number;
    response_format?: "text" | "json";
}

export declare interface AiChatResponse {
    content: string;
    modelUsed: string;
    provider: string;
    usage: AiUsageDto | null;
}

/**
 * AI provider configuration stored in the database.
 * All fields are optional — null means "not configured".
 */
export declare interface AiConfigDto {
    lmStudioUrl: string | null;
    anthropicApiKey: string | null;
    geminiApiKey: string | null;
    openAiApiKey: string | null;
    defaultLocalModel: string | null;
    defaultCloudModel: string | null;
    defaultGeminiModel: string | null;
    defaultOpenAiModel: string | null;
}

/** Response envelope returned by GET and PUT /api/v1/ai/config */
export declare interface AiConfigResponse extends AiConfigDto {
    /** true if at least one provider field is non-null/non-empty */
    isConfigured: boolean;
}

/**
 * Minimal HTTP client interface that the store needs.
 * The consuming app provides an implementation (typically wrapping axios).
 *
 * Each method must return `{ data: T }` where T is the parsed JSON body.
 */
export declare interface AiGatewayHttpClient {
    get<T = any>(url: string): Promise<{
        data: T;
    }>;
    post<T = any>(url: string, body?: any): Promise<{
        data: T;
    }>;
    put<T = any>(url: string, body?: any): Promise<{
        data: T;
    }>;
}

/**
 * Configuration object passed to `createAiSettingsStore()`.
 */
export declare interface AiGatewayUiConfig {
    /** The HTTP client to use for API calls (e.g. your configured axios instance). */
    httpClient: AiGatewayHttpClient;
    /** Base path for AI endpoints (default: "/api/v1/ai"). */
    basePath?: string;
}

declare interface AiMessage {
    role: AiRole;
    content: string;
}

/**
 * Model selector — determines which AI provider/model handles the request.
 *
 * - `{ type: "Local", value: "qwen3-30b-a3b" }` → LM Studio
 * - `{ type: "Cloud", value: "sonnet" }` → Anthropic
 * - `{ type: "Gemini", value: "flash" }` → Google Gemini
 * - `{ type: "Auto" }` → tries local first, then Anthropic, then Gemini
 */
declare type AiModel = {
    type: "Local";
    value: string;
} | {
    type: "Cloud";
    value: AnthropicModel;
} | {
    type: "Gemini";
    value: GeminiModel;
} | {
    type: "OpenAi";
    value: OpenAiModel;
} | {
    type: "Auto";
};

export declare interface AiModelInfo {
    id: string;
    object: string;
    ownedBy: string;
}

declare type AiRole = "user" | "assistant";

export declare const AiSettingsPanel: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;

export declare interface AiStatusResponse {
    available: boolean;
    lmStudioOnline: boolean;
    loadedModels: string[];
    anthropicConfigured: boolean;
    geminiConfigured: boolean;
    openAiConfigured: boolean;
}

declare interface AiUsageDto {
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
}

declare type AnthropicModel = "haiku" | "sonnet" | "opus";

/**
 * Creates a Pinia store for the AI Settings panel.
 *
 * @param config - HTTP client and optional base path
 * @returns A Pinia `useStore` composable
 */
export declare function createAiSettingsStore(config: AiGatewayUiConfig): StoreDefinition<"agui-ai-settings", Pick<{
status: Ref<    {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null, AiStatusResponse | {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null>;
localModels: Ref<    {
id: string;
object: string;
ownedBy: string;
}[], AiModelInfo[] | {
id: string;
object: string;
ownedBy: string;
}[]>;
isLoadingStatus: Ref<boolean, boolean>;
isLoadingModels: Ref<boolean, boolean>;
isProcessing: Ref<boolean, boolean>;
error: Ref<string | null, string | null>;
lastResponse: Ref<    {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null, AiChatResponse | {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null>;
activeModel: Ref<    {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}, AiModel | {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}>;
initialized: Ref<boolean, boolean>;
config: Ref<    {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null, AiConfigResponse | {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null>;
isLoadingConfig: Ref<boolean, boolean>;
isSavingConfig: Ref<boolean, boolean>;
configSupported: Ref<boolean | null, boolean | null>;
isAvailable: ComputedRef<boolean>;
isLocalOnline: ComputedRef<boolean>;
isAnthropicConfigured: ComputedRef<boolean>;
isGeminiConfigured: ComputedRef<boolean>;
isOpenAiConfigured: ComputedRef<boolean>;
loadedModels: ComputedRef<string[]>;
providerCount: ComputedRef<number>;
isConfigured: ComputedRef<boolean>;
activeModelLabel: ComputedRef<string>;
activeModelProviderTag: ComputedRef<"Local" | "Gemini" | "Auto" | "Claude" | "OpenAI">;
clearError: () => void;
setActiveModel: (model: AiModel) => void;
loadConfig: () => Promise<void>;
saveConfig: (cfg: AiConfigDto) => Promise<boolean>;
fetchStatus: () => Promise<void>;
fetchModels: () => Promise<void>;
chat: (request: AiChatRequest) => Promise<AiChatResponse | null>;
initialize: () => Promise<void>;
}, "status" | "localModels" | "isLoadingStatus" | "isLoadingModels" | "isProcessing" | "error" | "lastResponse" | "activeModel" | "initialized" | "config" | "isLoadingConfig" | "isSavingConfig" | "configSupported">, Pick<{
status: Ref<    {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null, AiStatusResponse | {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null>;
localModels: Ref<    {
id: string;
object: string;
ownedBy: string;
}[], AiModelInfo[] | {
id: string;
object: string;
ownedBy: string;
}[]>;
isLoadingStatus: Ref<boolean, boolean>;
isLoadingModels: Ref<boolean, boolean>;
isProcessing: Ref<boolean, boolean>;
error: Ref<string | null, string | null>;
lastResponse: Ref<    {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null, AiChatResponse | {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null>;
activeModel: Ref<    {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}, AiModel | {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}>;
initialized: Ref<boolean, boolean>;
config: Ref<    {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null, AiConfigResponse | {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null>;
isLoadingConfig: Ref<boolean, boolean>;
isSavingConfig: Ref<boolean, boolean>;
configSupported: Ref<boolean | null, boolean | null>;
isAvailable: ComputedRef<boolean>;
isLocalOnline: ComputedRef<boolean>;
isAnthropicConfigured: ComputedRef<boolean>;
isGeminiConfigured: ComputedRef<boolean>;
isOpenAiConfigured: ComputedRef<boolean>;
loadedModels: ComputedRef<string[]>;
providerCount: ComputedRef<number>;
isConfigured: ComputedRef<boolean>;
activeModelLabel: ComputedRef<string>;
activeModelProviderTag: ComputedRef<"Local" | "Gemini" | "Auto" | "Claude" | "OpenAI">;
clearError: () => void;
setActiveModel: (model: AiModel) => void;
loadConfig: () => Promise<void>;
saveConfig: (cfg: AiConfigDto) => Promise<boolean>;
fetchStatus: () => Promise<void>;
fetchModels: () => Promise<void>;
chat: (request: AiChatRequest) => Promise<AiChatResponse | null>;
initialize: () => Promise<void>;
}, "loadedModels" | "isConfigured" | "isAvailable" | "isLocalOnline" | "isAnthropicConfigured" | "isGeminiConfigured" | "isOpenAiConfigured" | "providerCount" | "activeModelLabel" | "activeModelProviderTag">, Pick<{
status: Ref<    {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null, AiStatusResponse | {
available: boolean;
lmStudioOnline: boolean;
loadedModels: string[];
anthropicConfigured: boolean;
geminiConfigured: boolean;
openAiConfigured: boolean;
} | null>;
localModels: Ref<    {
id: string;
object: string;
ownedBy: string;
}[], AiModelInfo[] | {
id: string;
object: string;
ownedBy: string;
}[]>;
isLoadingStatus: Ref<boolean, boolean>;
isLoadingModels: Ref<boolean, boolean>;
isProcessing: Ref<boolean, boolean>;
error: Ref<string | null, string | null>;
lastResponse: Ref<    {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null, AiChatResponse | {
content: string;
modelUsed: string;
provider: string;
usage: {
promptTokens: number | null;
completionTokens: number | null;
totalTokens: number | null;
} | null;
} | null>;
activeModel: Ref<    {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}, AiModel | {
type: "Local";
value: string;
} | {
type: "Cloud";
value: AnthropicModel;
} | {
type: "Gemini";
value: GeminiModel;
} | {
type: "OpenAi";
value: OpenAiModel;
} | {
type: "Auto";
}>;
initialized: Ref<boolean, boolean>;
config: Ref<    {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null, AiConfigResponse | {
isConfigured: boolean;
lmStudioUrl: string | null;
anthropicApiKey: string | null;
geminiApiKey: string | null;
openAiApiKey: string | null;
defaultLocalModel: string | null;
defaultCloudModel: string | null;
defaultGeminiModel: string | null;
defaultOpenAiModel: string | null;
} | null>;
isLoadingConfig: Ref<boolean, boolean>;
isSavingConfig: Ref<boolean, boolean>;
configSupported: Ref<boolean | null, boolean | null>;
isAvailable: ComputedRef<boolean>;
isLocalOnline: ComputedRef<boolean>;
isAnthropicConfigured: ComputedRef<boolean>;
isGeminiConfigured: ComputedRef<boolean>;
isOpenAiConfigured: ComputedRef<boolean>;
loadedModels: ComputedRef<string[]>;
providerCount: ComputedRef<number>;
isConfigured: ComputedRef<boolean>;
activeModelLabel: ComputedRef<string>;
activeModelProviderTag: ComputedRef<"Local" | "Gemini" | "Auto" | "Claude" | "OpenAI">;
clearError: () => void;
setActiveModel: (model: AiModel) => void;
loadConfig: () => Promise<void>;
saveConfig: (cfg: AiConfigDto) => Promise<boolean>;
fetchStatus: () => Promise<void>;
fetchModels: () => Promise<void>;
chat: (request: AiChatRequest) => Promise<AiChatResponse | null>;
initialize: () => Promise<void>;
}, "clearError" | "setActiveModel" | "loadConfig" | "saveConfig" | "fetchStatus" | "fetchModels" | "chat" | "initialize">>;

declare type GeminiModel = "flash" | "pro" | "flash_lite";

declare type OpenAiModel = "gpt_4o" | "gpt_4o_mini" | "o1" | "o3_mini";

export { }
