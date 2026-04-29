/**
 * AI Gateway Settings Store — factory function.
 *
 * Usage:
 * ```ts
 * import { createAiSettingsStore } from "@luetzen/ai-gateway-ui";
 *
 * export const useAiSettingsStore = createAiSettingsStore({
 *   httpClient: myAxiosInstance,
 *   basePath: "/api/v1/ai",
 * });
 * ```
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AiModels } from "@luetzen/ai-gateway";
import type { AiModel, AiChatRequest, AnthropicModel, GeminiModel, OpenAiModel } from "@luetzen/ai-gateway";
import { AiGatewayApi } from "./api";
import type {
  AiGatewayUiConfig,
  AiStatusResponse,
  AiChatResponse,
  AiModelInfo,
  AiConfigDto,
  AiConfigResponse,
} from "./types";

const ACTIVE_MODEL_STORAGE_KEY = "agui_active_model";

function serializeModel(model: AiModel): string {
  if (model.type === "Auto") return "auto";
  if (model.type === "Local") return `local:${model.value}`;
  if (model.type === "Cloud") return `cloud:${model.value}`;
  if (model.type === "Gemini") return `gemini:${model.value}`;
  if (model.type === "OpenAi") return `openai:${model.value}`;
  return "auto";
}

function deserializeModel(raw: string): AiModel {
  if (!raw || raw === "auto") return AiModels.auto();
  const [provider, value] = raw.split(":");
  if (provider === "local" && value) return AiModels.local(value);
  if (provider === "cloud" && value)
    return { type: "Cloud", value: value as AnthropicModel };
  if (provider === "gemini" && value)
    return { type: "Gemini", value: value as GeminiModel };
  if (provider === "openai" && value)
    return { type: "OpenAi", value: value as OpenAiModel };
  return AiModels.auto();
}

function labelForModel(model: AiModel): string {
  if (model.type === "Auto") return "Auto";
  if (model.type === "Local") return `Local: ${model.value}`;
  if (model.type === "Cloud") {
    const names: Record<string, string> = { haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" };
    return `Claude ${names[model.value] ?? model.value}`;
  }
  if (model.type === "Gemini") {
    const names: Record<string, string> = { flash: "Gemini Flash", pro: "Gemini Pro", flash_lite: "Gemini Flash Lite" };
    return names[model.value] ?? `Gemini ${model.value}`;
  }
  if (model.type === "OpenAi") {
    const names: Record<string, string> = { gpt_4o: "GPT-4o", gpt_4o_mini: "GPT-4o Mini", o1: "o1", o3_mini: "o3-mini" };
    return names[model.value] ?? `OpenAI ${model.value}`;
  }
  return "Auto";
}

/**
 * Creates a Pinia store for the AI Settings panel.
 *
 * @param config - HTTP client and optional base path
 * @returns A Pinia `useStore` composable
 */
export function createAiSettingsStore(config: AiGatewayUiConfig) {
  const api = new AiGatewayApi(config.httpClient, config.basePath);

  return defineStore("agui-ai-settings", () => {
    // =========================================================================
    // State
    // =========================================================================
    const status = ref<AiStatusResponse | null>(null);
    const localModels = ref<AiModelInfo[]>([]);
    const isLoadingStatus = ref(false);
    const isLoadingModels = ref(false);
    const isProcessing = ref(false);
    const error = ref<string | null>(null);
    const lastResponse = ref<AiChatResponse | null>(null);
    const activeModel = ref<AiModel>(
      deserializeModel(localStorage.getItem(ACTIVE_MODEL_STORAGE_KEY) ?? "auto"),
    );
    const initialized = ref(false);
    const config_ = ref<AiConfigResponse | null>(null);
    const isLoadingConfig = ref(false);
    const isSavingConfig = ref(false);
    const configSupported = ref<boolean | null>(null);

    // =========================================================================
    // Computed
    // =========================================================================
    const isAvailable = computed(() => status.value?.available ?? false);
    const isLocalOnline = computed(() => status.value?.lmStudioOnline ?? false);
    const isAnthropicConfigured = computed(() => status.value?.anthropicConfigured ?? false);
    const isGeminiConfigured = computed(() => status.value?.geminiConfigured ?? false);
    const isOpenAiConfigured = computed(() => status.value?.openAiConfigured ?? false);
    const loadedModels = computed(() => status.value?.loadedModels ?? []);
    const isConfigured = computed(() => config_.value?.isConfigured ?? false);
    const activeModelLabel = computed(() => labelForModel(activeModel.value));
    const activeModelProviderTag = computed(() => {
      const m = activeModel.value;
      if (m.type === "Auto") return "Auto";
      if (m.type === "Local") return "Local";
      if (m.type === "Cloud") return "Claude";
      if (m.type === "Gemini") return "Gemini";
      if (m.type === "OpenAi") return "OpenAI";
      return "Auto";
    });
    const providerCount = computed(() => {
      let count = 0;
      if (status.value?.lmStudioOnline) count++;
      if (status.value?.anthropicConfigured) count++;
      if (status.value?.geminiConfigured) count++;
      if (status.value?.openAiConfigured) count++;
      return count;
    });

    // =========================================================================
    // Actions
    // =========================================================================
    function clearError() {
      error.value = null;
    }

    function setActiveModel(model: AiModel) {
      activeModel.value = model;
      try {
        localStorage.setItem(ACTIVE_MODEL_STORAGE_KEY, serializeModel(model));
      } catch { /* ignore */ }
    }

    async function loadConfig(): Promise<void> {
      isLoadingConfig.value = true;
      error.value = null;
      try {
        config_.value = await api.getConfig();
        configSupported.value = true;
      } catch (e: any) {
        if (e?.response?.status === 501) {
          configSupported.value = false;
        } else {
          error.value = e.message || "Failed to load AI configuration";
        }
      } finally {
        isLoadingConfig.value = false;
      }
    }

    async function saveConfig(cfg: AiConfigDto): Promise<boolean> {
      isSavingConfig.value = true;
      error.value = null;
      try {
        config_.value = await api.saveConfig(cfg);
        configSupported.value = true;
        await fetchStatus();
        return true;
      } catch (e: any) {
        error.value = e.message || "Failed to save AI configuration";
        return false;
      } finally {
        isSavingConfig.value = false;
      }
    }

    async function fetchStatus(): Promise<void> {
      isLoadingStatus.value = true;
      error.value = null;
      try {
        status.value = await api.getStatus();
        initialized.value = true;
      } catch (e: any) {
        error.value = e.message || "Failed to fetch AI status";
      } finally {
        isLoadingStatus.value = false;
      }
    }

    async function fetchModels(): Promise<void> {
      isLoadingModels.value = true;
      error.value = null;
      try {
        const response = await api.getModels();
        localModels.value = response.models;
      } catch (e: any) {
        error.value = e.message || "Failed to fetch models";
        localModels.value = [];
      } finally {
        isLoadingModels.value = false;
      }
    }

    async function chat(request: AiChatRequest): Promise<AiChatResponse | null> {
      isProcessing.value = true;
      error.value = null;
      try {
        const response = await api.chat(request);
        lastResponse.value = response;
        return response;
      } catch (e: any) {
        error.value = e.message || "AI chat request failed";
        return null;
      } finally {
        isProcessing.value = false;
      }
    }

    async function initialize(): Promise<void> {
      if (initialized.value) return;
      await loadConfig();
      await fetchStatus();
      if (status.value?.lmStudioOnline) {
        await fetchModels();
      }
    }

    return {
      // State
      status,
      localModels,
      isLoadingStatus,
      isLoadingModels,
      isProcessing,
      error,
      lastResponse,
      activeModel,
      initialized,
      config: config_,
      isLoadingConfig,
      isSavingConfig,
      configSupported,
      // Computed
      isAvailable,
      isLocalOnline,
      isAnthropicConfigured,
      isGeminiConfigured,
      isOpenAiConfigured,
      loadedModels,
      providerCount,
      isConfigured,
      activeModelLabel,
      activeModelProviderTag,
      // Actions
      clearError,
      setActiveModel,
      loadConfig,
      saveConfig,
      fetchStatus,
      fetchModels,
      chat,
      initialize,
    };
  });
}
