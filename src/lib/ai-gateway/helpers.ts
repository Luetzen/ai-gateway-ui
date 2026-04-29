import type { AiMessage, AiModel, GeminiModel, OpenAiModel } from "./types";

// =============================================================================
// Message Constructors
// =============================================================================

/**
 * Create a user message.
 */
export function userMessage(content: string): AiMessage {
  return { role: "user", content };
}

/**
 * Create an assistant message.
 */
export function assistantMessage(content: string): AiMessage {
  return { role: "assistant", content };
}

// =============================================================================
// Model Selectors
// =============================================================================

/**
 * Convenience constructors for common model selectors.
 *
 * @example
 * ```ts
 * import { AiModels } from "@luetzen/ai-gateway";
 *
 * const model = AiModels.auto();                   // local first, then Anthropic, then Gemini
 * const model = AiModels.sonnet();                 // Claude Sonnet
 * const model = AiModels.geminiFlash();            // Gemini 2.5 Flash (free tier)
 * const model = AiModels.local("qwen3-30b-a3b");  // specific local model
 * ```
 */
export const AiModels = {
  /** Auto: try local first, then Anthropic, then Gemini — first available wins. */
  auto: (): AiModel => ({ type: "Auto" }),

  /** Use a specific local model by name. */
  local: (modelName: string): AiModel => ({ type: "Local", value: modelName }),

  // ---------------------------------------------------------------------------
  // Anthropic — Claude
  // ---------------------------------------------------------------------------

  /** Claude Haiku — fast and cheap. */
  haiku: (): AiModel => ({ type: "Cloud", value: "haiku" }),

  /** Claude Sonnet — balanced quality/speed/cost. */
  sonnet: (): AiModel => ({ type: "Cloud", value: "sonnet" }),

  /** Claude Opus — most capable Claude model. */
  opus: (): AiModel => ({ type: "Cloud", value: "opus" }),

  // ---------------------------------------------------------------------------
  // Google Gemini
  // ---------------------------------------------------------------------------

  /**
   * Gemini 2.5 Flash — fast, free tier available (500 req/day, 10 req/min).
   * Recommended default for Gemini.
   */
  geminiFlash: (): AiModel => ({ type: "Gemini", value: "flash" }),

  /**
   * Gemini 2.5 Pro — most capable Gemini model.
   * Free tier: 50 req/day, 5 req/min.
   */
  geminiPro: (): AiModel => ({ type: "Gemini", value: "pro" }),

  /**
   * Gemini 2.0 Flash Lite — ultra-fast, highest free tier quota (1500 req/day, 30 req/min).
   * Great for high-volume or latency-sensitive tasks.
   */
  geminiFlashLite: (): AiModel => ({ type: "Gemini", value: "flash_lite" }),

  /**
   * Use a specific Gemini model by variant name.
   * Accepts: "flash" | "pro" | "flash_lite"
   */
  gemini: (variant: GeminiModel): AiModel => ({
    type: "Gemini",
    value: variant,
  }),

  // ---------------------------------------------------------------------------
  // OpenAI
  // ---------------------------------------------------------------------------

  /** GPT-4o Mini — fast, affordable, intelligent. */
  gpt4oMini: (): AiModel => ({ type: "OpenAi", value: "gpt_4o_mini" }),

  /** GPT-4o — versatile, high-intelligence model. */
  gpt4o: (): AiModel => ({ type: "OpenAi", value: "gpt_4o" }),

  /** o3-mini — fast reasoning model. */
  o3Mini: (): AiModel => ({ type: "OpenAi", value: "o3_mini" }),

  /** o1 — advanced reasoning model for complex tasks. */
  o1: (): AiModel => ({ type: "OpenAi", value: "o1" }),

  /** Use a specific OpenAI model by variant name. */
  openAi: (variant: OpenAiModel): AiModel => ({
    type: "OpenAi",
    value: variant,
  }),
} as const;
