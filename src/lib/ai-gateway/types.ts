// =============================================================================
// Types — AI Client (Provider-Agnostic)
// These types mirror the Rust crate types exactly.
// =============================================================================

export type AiProvider = "lm_studio" | "anthropic" | "gemini" | "openai";

export type AnthropicModel = "haiku" | "sonnet" | "opus";

export type GeminiModel = "flash" | "pro" | "flash_lite";

export type OpenAiModel = "gpt_4o" | "gpt_4o_mini" | "o1" | "o3_mini";

export type AiRole = "user" | "assistant";

/**
 * Model selector — determines which AI provider/model handles the request.
 *
 * - `{ type: "Local", value: "qwen3-30b-a3b" }` → LM Studio
 * - `{ type: "Cloud", value: "sonnet" }` → Anthropic
 * - `{ type: "Gemini", value: "flash" }` → Google Gemini
 * - `{ type: "Auto" }` → tries local first, then Anthropic, then Gemini
 */
export type AiModel =
  | { type: "Local"; value: string }
  | { type: "Cloud"; value: AnthropicModel }
  | { type: "Gemini"; value: GeminiModel }
  | { type: "OpenAi"; value: OpenAiModel }
  | { type: "Auto" };

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiUsage {
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;
}

// =============================================================================
// Request Types
// =============================================================================

export interface AiChatRequest {
  model?: AiModel;
  system?: string;
  messages: AiMessage[];
  max_tokens?: number;
  temperature?: number;
  response_format?: "text" | "json";
}

export interface AiDirectChatRequest {
  model?: AiModel;
  system?: string;
  messages: AiMessage[];
  max_tokens?: number;
  temperature?: number;
}

export type AiTarget =
  | "kanban_cards"
  | "calendar_events"
  | "meal_plan"
  | "free_text";

export interface AiContextBoard {
  board_id: number;
  name: string;
  columns: AiContextColumn[];
}

export interface AiContextColumn {
  column_id: number;
  name: string;
}

export interface AiContextFamilyMember {
  id: number;
  name: string;
}

export interface AiContext {
  boards?: AiContextBoard[];
  family_members?: AiContextFamilyMember[];
  today?: string;
  extra_instructions?: string | null;
}

export interface AiProcessRequest {
  input: string;
  target: AiTarget;
  model?: AiModel;
  context?: AiContext;
  language?: string;
}

export interface LoadModelRequest {
  model: string;
}

// =============================================================================
// Response Types
// =============================================================================

export interface AiChatResponse {
  content: string;
  model_used: string;
  provider: AiProvider;
  usage: AiUsage | null;
}

export interface AiKanbanCard {
  board_id: number | null;
  column_id: number | null;
  board_name: string | null;
  column_name: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
}

export interface AiCalendarEvent {
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  all_day: boolean;
  location: string | null;
  family_member_id: number | null;
  family_member_name: string | null;
}

export interface AiMealPlanItem {
  meal_name: string;
  date: string | null;
  slot: string | null;
  notes: string | null;
}

export interface AiProcessResponse {
  kanban_cards?: AiKanbanCard[];
  calendar_events?: AiCalendarEvent[];
  meal_plan_items?: AiMealPlanItem[];
  text?: string;
  model_used: string;
  provider: string;
  usage?: AiUsage;
}

export interface AiLocalStatus {
  configured: boolean;
  online: boolean;
  loaded_models: string[];
  url: string | null;
}

export interface AiCloudStatus {
  configured: boolean;
  available_models: string[];
}

export interface AiGeminiStatus {
  configured: boolean;
  available_models: string[];
}

export interface AiOpenAiStatus {
  configured: boolean;
  available_models: string[];
}

export interface AiStatusResponse {
  available: boolean;
  local: AiLocalStatus;
  cloud: AiCloudStatus;
  gemini: AiGeminiStatus;
  openai: AiOpenAiStatus;
}

export interface AiModelInfo {
  id: string;
  object?: string;
  owned_by?: string;
}

export interface AiModelsResponse {
  models: AiModelInfo[];
}

export interface AvailableModel {
  id: string;
  provider: string;
  display_name: string;
  model_selector: AiModel;
  online: boolean;
}

export interface AvailableModelsResponse {
  models: AvailableModel[];
}

export interface AiActionResponse {
  success: boolean;
  message: string;
}
