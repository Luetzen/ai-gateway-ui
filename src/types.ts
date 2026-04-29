import type { AiChatRequest, AiModel } from "@luetzen/ai-gateway";

// =============================================================================
// HTTP Client interface — consumers inject their own axios/fetch wrapper
// =============================================================================

/**
 * Minimal HTTP client interface that the store needs.
 * The consuming app provides an implementation (typically wrapping axios).
 *
 * Each method must return `{ data: T }` where T is the parsed JSON body.
 */
export interface AiGatewayHttpClient {
  get<T = any>(url: string): Promise<{ data: T }>;
  post<T = any>(url: string, body?: any): Promise<{ data: T }>;
  put<T = any>(url: string, body?: any): Promise<{ data: T }>;
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Configuration object passed to `createAiSettingsStore()`.
 */
export interface AiGatewayUiConfig {
  /** The HTTP client to use for API calls (e.g. your configured axios instance). */
  httpClient: AiGatewayHttpClient;

  /** Base path for AI endpoints (default: "/api/v1/ai"). */
  basePath?: string;
}

// =============================================================================
// API Response types (match the Pixel backend DTOs)
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AiUsageDto {
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
}

export interface AiChatResponse {
  content: string;
  modelUsed: string;
  provider: string;
  usage: AiUsageDto | null;
}

export interface AiStatusResponse {
  available: boolean;
  lmStudioOnline: boolean;
  loadedModels: string[];
  anthropicConfigured: boolean;
  geminiConfigured: boolean;
  openAiConfigured: boolean;
}

export interface AiModelInfo {
  id: string;
  object: string;
  ownedBy: string;
}

export interface AiModelsResponse {
  models: AiModelInfo[];
}

/**
 * AI provider configuration stored in the database.
 * All fields are optional — null means "not configured".
 */
export interface AiConfigDto {
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
export interface AiConfigResponse extends AiConfigDto {
  /** true if at least one provider field is non-null/non-empty */
  isConfigured: boolean;
}

export interface EnhancePromptRequest {
  prompt: string;
  model?: AiModel;
}

export interface SuggestAssetsRequest {
  description: string;
  model?: AiModel;
}
