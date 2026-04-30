<template>
  <div class="agui-settings-container">
    <div class="agui-settings-header">
      <h1>🤖 AI Gateway</h1>
      <p class="agui-header-subtitle">
        KI-Provider konfigurieren für Prompt-Optimierung und
        Asset-Generierung
      </p>
    </div>

    <div class="agui-settings-content">
      <!-- Status + Quick Test side by side -->
      <div class="agui-top-row">
        <!-- Provider Status Card -->
        <div class="agui-card agui-status-card">
          <div class="agui-card-header">
            <h2>Provider Status</h2>
            <button
              class="agui-btn-icon"
              :disabled="store.isLoadingStatus"
              title="Status aktualisieren"
              @click="refreshStatus"
            >
              <span :class="{ 'agui-spinning': store.isLoadingStatus }">🔄</span>
            </button>
          </div>

          <div v-if="store.isLoadingStatus" class="agui-status-loading">
            <span class="agui-spinner"></span> Lade Status…
          </div>

          <div v-else class="agui-provider-list">
            <div class="agui-provider-row" :class="{ online: store.isAvailable }">
              <span class="agui-provider-dot"></span>
              <span class="agui-provider-name">AI Gateway</span>
              <span class="agui-provider-status">
                {{ store.isAvailable ? store.providerCount + " Provider aktiv" : "Nicht konfiguriert" }}
              </span>
            </div>
            <div class="agui-provider-row" :class="{ online: store.isLocalOnline }">
              <span class="agui-provider-dot"></span>
              <span class="agui-provider-name">🖥 LM Studio</span>
              <span class="agui-provider-status">
                {{ store.isLocalOnline ? "Online (" + store.loadedModels.length + " Modell)" : "Offline" }}
              </span>
            </div>
            <div class="agui-provider-row" :class="{ online: store.isAnthropicConfigured }">
              <span class="agui-provider-dot"></span>
              <span class="agui-provider-name">☁ Anthropic</span>
              <span class="agui-provider-status">
                {{ store.isAnthropicConfigured ? "Konfiguriert" : "Kein API Key" }}
              </span>
            </div>
            <div class="agui-provider-row" :class="{ online: store.isGeminiConfigured }">
              <span class="agui-provider-dot"></span>
              <span class="agui-provider-name">✦ Gemini</span>
              <span class="agui-provider-status">
                {{ store.isGeminiConfigured ? "Konfiguriert" : "Kein API Key" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Test Card -->
        <div class="agui-card agui-quick-test-card">
          <div class="agui-card-header">
            <h2>Quick-Test</h2>
            <span class="agui-card-hint">Verbindung prüfen</span>
          </div>

          <!-- Active Model Selector -->
          <div class="agui-model-row">
            <label class="agui-model-label">Modell</label>
            <select
              class="agui-model-select"
              :value="activeModelSerialized"
              :disabled="quickTesting"
              @change="onQuickTestModelChange"
            >
              <option value="auto">⚡ Auto (Lokal → Claude → Gemini)</option>
              <optgroup v-if="store.isLocalOnline" label="🖥 Lokal (LM Studio)">
                <option v-for="m in store.localModels" :key="m.id" :value="`local:${m.id}`">
                  {{ m.id }}
                </option>
                <option
                  v-if="!store.localModels.length && store.config?.defaultLocalModel"
                  :value="`local:${store.config.defaultLocalModel}`"
                >
                  {{ store.config.defaultLocalModel }}
                </option>
              </optgroup>
              <optgroup v-if="store.isAnthropicConfigured" label="☁ Anthropic Claude">
                <option value="cloud:haiku">Haiku — schnell &amp; günstig</option>
                <option value="cloud:sonnet">Sonnet — ausgewogen</option>
                <option value="cloud:opus">Opus — leistungsstark</option>
              </optgroup>
              <optgroup v-if="store.isGeminiConfigured" label="✦ Google Gemini">
                <option value="gemini:flash">Flash — schnell, Free Tier</option>
                <option value="gemini:flash_lite">Flash Lite — ultra-schnell</option>
                <option value="gemini:pro">Pro — leistungsstark</option>
              </optgroup>
            </select>
            <span
              class="agui-model-badge"
              :class="`agui-qm-${store.activeModel.type.toLowerCase()}`"
            >
              {{ store.activeModelLabel }}
            </span>
          </div>

          <p class="agui-quick-test-desc">
            Schicke eine kurze Nachricht um zu prüfen ob der konfigurierte Provider antwortet.
          </p>

          <div class="agui-quick-test-presets">
            <button
              v-for="preset in quickTestPresets"
              :key="preset"
              type="button"
              class="agui-preset-chip"
              :class="{ active: quickTestInput === preset }"
              @click="quickTestInput = preset"
            >
              {{ preset }}
            </button>
          </div>

          <div class="agui-quick-test-input-row">
            <input
              v-model="quickTestInput"
              type="text"
              placeholder="Eigene Nachricht…"
              class="agui-quick-input"
              :disabled="quickTesting || !store.isAvailable"
              @keyup.enter="runQuickTest"
            />
            <button
              class="agui-btn-send"
              :disabled="quickTesting || !quickTestInput.trim() || !store.isAvailable"
              @click="runQuickTest"
            >
              <span v-if="quickTesting" class="agui-spinner-sm"></span>
              <span v-else>▶</span>
            </button>
          </div>

          <div v-if="!store.isAvailable && !store.isLoadingStatus" class="agui-quick-test-hint">
            Kein Provider konfiguriert — trage unten einen API Key ein.
          </div>

          <div v-if="quickTestResponse" class="agui-quick-test-response">
            <div class="agui-response-meta">
              <span class="agui-meta-chip">{{ quickTestResponse.provider }}</span>
              <span class="agui-meta-chip agui-model">{{ quickTestResponse.modelUsed }}</span>
              <span v-if="quickTestResponse.usage?.totalTokens" class="agui-meta-chip agui-tokens">
                {{ quickTestResponse.usage.totalTokens }} Tokens
              </span>
            </div>
            <p class="agui-response-text">{{ quickTestResponse.content }}</p>
          </div>

          <div v-if="quickTestError" class="agui-quick-test-error">
            {{ quickTestError }}
          </div>
        </div>
      </div>

      <!-- Config Form Card -->
      <div class="agui-card agui-config-card">
        <div class="agui-card-header">
          <h2>⚙️ Konfiguration</h2>
          <span v-if="store.configSupported === false" class="agui-legacy-badge">Env-Vars only</span>
        </div>

        <!-- Legacy deployment -->
        <div v-if="store.configSupported === false" class="agui-legacy-hint">
          <p>
            Diese Instanz unterstützt keine In-App-Konfiguration.
            Setze die folgenden Umgebungsvariablen im Backend:
          </p>
          <div class="agui-env-table">
            <div class="agui-env-row">
              <code>LM_STUDIO_URL</code>
              <span>http://192.168.1.x:1234</span>
            </div>
            <div class="agui-env-row">
              <code>ANTHROPIC_API_KEY</code>
              <span>sk-ant-…</span>
            </div>
            <div class="agui-env-row">
              <code>GEMINI_API_KEY</code>
              <span>AIza… (Free Tier verfügbar)</span>
            </div>
          </div>
        </div>

        <!-- Config form (supported) -->
        <form v-else class="agui-config-form" @submit.prevent="handleSaveConfig">
          <div class="agui-config-grid">
            <!-- LM Studio -->
            <div class="agui-provider-block">
              <div class="agui-provider-block-header">
                <span class="agui-badge agui-local">🖥 Lokal</span>
                <strong>LM Studio</strong>
                <span class="agui-provider-note">Kostenlos · lokal</span>
              </div>
              <div class="agui-field">
                <label>Server-URL</label>
                <input
                  v-model="configForm.lmStudioUrl"
                  type="url"
                  placeholder="http://192.168.1.121:1234"
                  class="agui-field-input"
                  autocomplete="off"
                />
                <span class="agui-field-note">IP + Port deines LM Studio Servers</span>
              </div>
            </div>

            <!-- Anthropic -->
            <div class="agui-provider-block">
              <div class="agui-provider-block-header">
                <span class="agui-badge agui-cloud">☁ Cloud</span>
                <strong>Anthropic Claude</strong>
                <span class="agui-provider-note">Haiku / Sonnet / Opus</span>
              </div>
              <div class="agui-field">
                <label>API Key</label>
                <input
                  v-model="configForm.anthropicApiKey"
                  type="password"
                  placeholder="sk-ant-…"
                  class="agui-field-input"
                  autocomplete="new-password"
                />
                <span class="agui-field-note">
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener">console.anthropic.com</a>
                </span>
              </div>
              <div class="agui-field">
                <label>Standard-Modell</label>
                <select v-model="configForm.defaultCloudModel" class="agui-field-select">
                  <option value="">Standard (sonnet)</option>
                  <option value="haiku">Haiku — schnell &amp; günstig</option>
                  <option value="sonnet">Sonnet — ausgewogen</option>
                  <option value="opus">Opus — leistungsstark</option>
                </select>
              </div>
            </div>

            <!-- Gemini -->
            <div class="agui-provider-block">
              <div class="agui-provider-block-header">
                <span class="agui-badge agui-gemini">✦ Free</span>
                <strong>Google Gemini</strong>
                <span class="agui-provider-note">Free Tier verfügbar</span>
              </div>
              <div class="agui-field">
                <label>API Key</label>
                <input
                  v-model="configForm.geminiApiKey"
                  type="password"
                  placeholder="AIza…"
                  class="agui-field-input"
                  autocomplete="new-password"
                />
                <span class="agui-field-note">
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">aistudio.google.com/apikey</a>
                  — kostenloser Free Tier
                </span>
              </div>
              <div class="agui-field">
                <label>Standard-Modell</label>
                <select v-model="configForm.defaultGeminiModel" class="agui-field-select">
                  <option value="">Standard (flash)</option>
                  <option value="flash">Flash — schnell, Free Tier</option>
                  <option value="flash_lite">Flash Lite — ultra-schnell</option>
                  <option value="pro">Pro — leistungsstark</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Advanced -->
          <details class="agui-advanced-block">
            <summary>Erweitert</summary>
            <div class="agui-field" style="margin-top: 0.75rem">
              <label>Standard lokales Modell</label>
              <input
                v-model="configForm.defaultLocalModel"
                type="text"
                placeholder="z.B. mistral-7b-instruct"
                class="agui-field-input"
              />
              <span class="agui-field-note">Modellname wie in LM Studio angezeigt (optional)</span>
            </div>
          </details>

          <div class="agui-config-footer">
            <button type="submit" class="agui-btn-save" :disabled="store.isSavingConfig">
              <span v-if="store.isSavingConfig">
                <span class="agui-spinner-sm"></span> Speichern…
              </span>
              <span v-else>💾 Speichern</span>
            </button>
            <span v-if="saveSuccess" class="agui-save-ok">✓ Gespeichert &amp; aktiv</span>
            <span v-if="store.error" class="agui-save-err">
              {{ store.error }}
              <button type="button" class="agui-btn-clear-err" @click="store.clearError()">✕</button>
            </span>
          </div>
        </form>
      </div>

      <!-- Usage hint (optional via slot) -->
      <div v-if="$slots.footer" class="agui-card agui-usage-hint-card">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { AiModels } from "@luetzen/ai-gateway";
import type { AiModel, AnthropicModel, GeminiModel } from "@luetzen/ai-gateway";
import type { AiConfigDto } from "../types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
const props = defineProps<{
  /** The Pinia store instance returned by `createAiSettingsStore()(pinia)` */
  store: any;
}>();

const store = computed(() => props.store);

// ---------------------------------------------------------------------------
// Quick Test
// ---------------------------------------------------------------------------
const quickTestPresets = ["Wer bist du?", "Antworte auf Deutsch", "Ping!"];
const quickTestInput = ref("Wer bist du?");
const quickTesting = ref(false);
const quickTestResponse = ref<null | {
  content: string;
  provider: string;
  modelUsed: string;
  usage: { totalTokens: number | null } | null;
}>(null);
const quickTestError = ref("");

const activeModelSerialized = computed(() => {
  const m = store.value.activeModel;
  if (m.type === "Auto") return "auto";
  if (m.type === "Local") return `local:${m.value}`;
  if (m.type === "Cloud") return `cloud:${m.value}`;
  if (m.type === "Gemini") return `gemini:${m.value}`;
  return "auto";
});

function onQuickTestModelChange(event: Event) {
  const val = (event.target as HTMLSelectElement).value;
  let model: AiModel;
  if (!val || val === "auto") {
    model = AiModels.auto();
  } else {
    const [provider, value] = val.split(":");
    if (provider === "local") model = { type: "Local", value };
    else if (provider === "cloud") model = { type: "Cloud", value: value as AnthropicModel };
    else if (provider === "gemini") model = { type: "Gemini", value: value as GeminiModel };
    else model = AiModels.auto();
  }
  store.value.setActiveModel(model);
}

async function runQuickTest() {
  if (!quickTestInput.value.trim() || !store.value.isAvailable) return;
  quickTesting.value = true;
  quickTestResponse.value = null;
  quickTestError.value = "";

  try {
    const res = await store.value.chat({
      model: store.value.activeModel,
      system: "Antworte sehr kurz — maximal 2 Sätze.",
      messages: [{ role: "user", content: quickTestInput.value.trim() }],
      max_tokens: 256,
      temperature: 0.5,
    });
    if (res) {
      quickTestResponse.value = {
        content: res.content,
        provider: res.provider,
        modelUsed: res.modelUsed,
        usage: res.usage ? { totalTokens: res.usage.totalTokens } : null,
      };
    }
  } catch (e: unknown) {
    quickTestError.value = (e instanceof Error && e.message) ? e.message : "Fehler beim Test";
  } finally {
    quickTesting.value = false;
  }
}

async function refreshStatus() {
  await store.value.fetchStatus();
  if (store.value.isLocalOnline) {
    await store.value.fetchModels();
  }
}

// ---------------------------------------------------------------------------
// Config form
// ---------------------------------------------------------------------------
const saveSuccess = ref(false);

const configForm = ref<AiConfigDto>({
  lmStudioUrl: null,
  anthropicApiKey: null,
  geminiApiKey: null,
  defaultLocalModel: null,
  defaultCloudModel: null,
  defaultGeminiModel: null,
});

watch(
  () => store.value.config,
  (cfg: any) => {
    if (!cfg) return;
    configForm.value = {
      lmStudioUrl: cfg.lmStudioUrl,
      anthropicApiKey: cfg.anthropicApiKey,
      geminiApiKey: cfg.geminiApiKey,
      defaultLocalModel: cfg.defaultLocalModel,
      defaultCloudModel: cfg.defaultCloudModel,
      defaultGeminiModel: cfg.defaultGeminiModel,
    };
  },
  { immediate: true },
);

async function handleSaveConfig() {
  const payload: AiConfigDto = {
    lmStudioUrl: configForm.value.lmStudioUrl?.trim() || null,
    anthropicApiKey: configForm.value.anthropicApiKey?.trim() || null,
    geminiApiKey: configForm.value.geminiApiKey?.trim() || null,
    defaultLocalModel: configForm.value.defaultLocalModel?.trim() || null,
    defaultCloudModel: configForm.value.defaultCloudModel?.trim() || null,
    defaultGeminiModel: configForm.value.defaultGeminiModel?.trim() || null,
  };

  const ok = await store.value.saveConfig(payload);
  if (ok) {
    saveSuccess.value = true;
    setTimeout(() => (saveSuccess.value = false), 3000);
  }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
onMounted(async () => {
  await store.value.initialize();
});
</script>

<style>
/* ============================================================================
   AI Gateway UI — Component Styles
   All classes prefixed with "agui-" to avoid collisions.
   All colors/sizes reference CSS custom properties with --agui-* prefix.

   The consumer maps their design tokens to --agui-* vars, or imports
   the provided default theme.
   ============================================================================ */

/* ── Layout ─────────────────────────────────────────────── */
.agui-settings-container {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: var(--agui-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  color: var(--agui-fg, #c9d1d9);
}

.agui-settings-header {
  margin-bottom: 1.5rem;
}

.agui-settings-header h1 {
  font-size: var(--agui-font-xl, 24px);
  font-weight: var(--agui-fw-semibold, 600);
  color: var(--agui-fg, #c9d1d9);
  margin: 0 0 0.25rem;
}

.agui-header-subtitle {
  font-size: var(--agui-font-sm, 14px);
  color: var(--agui-fg-subtle, #6e7681);
  margin: 0;
}

.agui-settings-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Cards ──────────────────────────────────────────────── */
.agui-card {
  background: var(--agui-card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--agui-card-border, rgba(255, 255, 255, 0.07));
  border-radius: var(--agui-radius-lg, 12px);
  padding: 1.25rem 1.5rem;
}

.agui-card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.agui-card-header h2 {
  font-size: var(--agui-font-md, 16px);
  font-weight: var(--agui-fw-semibold, 600);
  color: var(--agui-fg, #c9d1d9);
  margin: 0;
  flex: 1;
}

.agui-card-hint {
  font-size: var(--agui-font-xs, 12px);
  color: var(--agui-fg-subtle, #6e7681);
}

/* ── Top row ───────────────────────────────────────────── */
.agui-top-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
@media (max-width: 680px) {
  .agui-top-row {
    grid-template-columns: 1fr;
  }
}

/* ── Provider Status ─────────────────────────────────────── */
.agui-status-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--agui-fg-subtle, #6e7681);
}

.agui-provider-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.agui-provider-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--agui-fg-subtle, #6e7681);
}

.agui-provider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--agui-fg-subtle, #6e7681);
  flex-shrink: 0;
  transition: background 0.2s;
}

.agui-provider-row.online .agui-provider-dot {
  background: var(--agui-provider-online, #48bb78);
  box-shadow: 0 0 6px var(--agui-provider-online-glow, rgba(72, 187, 120, 0.5));
}

.agui-provider-row.online {
  color: var(--agui-border, #30363d);
}

.agui-provider-name {
  flex: 1;
  font-weight: 500;
}

.agui-provider-status {
  font-size: 0.78rem;
  color: var(--agui-fg-subtle, #6e7681);
}

.agui-provider-row.online .agui-provider-status {
  color: var(--agui-success-fg, #3fb950);
}

.agui-btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem 0.3rem;
  border-radius: 4px;
  transition: background 0.15s;
}
.agui-btn-icon:hover {
  background: var(--agui-card-border, rgba(255, 255, 255, 0.07));
}
.agui-btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.agui-spinning {
  display: inline-block;
  animation: agui-spin 0.8s linear infinite;
}

/* ── Model selector row ──────────────────────────────────── */
.agui-model-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.agui-model-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--agui-fg-muted, #8b949e);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.agui-model-select {
  flex: 1;
  min-width: 0;
  background: var(--agui-card-bg-hover, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--agui-card-border-hover, rgba(255, 255, 255, 0.12));
  border-radius: var(--agui-radius-md, 6px);
  color: var(--agui-fg, #c9d1d9);
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.agui-model-select:focus {
  outline: none;
  border-color: var(--agui-provider-cloud-border, rgba(139, 92, 246, 0.35));
  background: var(--agui-card-bg-hover, rgba(255, 255, 255, 0.06));
}
.agui-model-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.agui-model-select option,
.agui-model-select optgroup {
  background: var(--agui-canvas, #0d1117);
  color: var(--agui-fg, #c9d1d9);
}

.agui-model-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--agui-provider-cloud-border, rgba(139, 92, 246, 0.35));
  background: var(--agui-provider-cloud-subtle, rgba(139, 92, 246, 0.12));
  color: var(--agui-provider-cloud, rgb(167, 139, 250));
}
.agui-qm-local {
  border-color: var(--agui-provider-local-border, rgba(34, 197, 94, 0.35));
  background: var(--agui-provider-local-subtle, rgba(34, 197, 94, 0.1));
  color: var(--agui-provider-local, rgb(74, 222, 128));
}
.agui-qm-cloud {
  border-color: var(--agui-provider-anthropic-border, rgba(251, 146, 60, 0.35));
  background: var(--agui-provider-anthropic-subtle, rgba(251, 146, 60, 0.1));
  color: var(--agui-provider-anthropic, rgb(251, 146, 60));
}
.agui-qm-gemini {
  border-color: var(--agui-provider-gemini-border, rgba(59, 130, 246, 0.35));
  background: var(--agui-provider-gemini-subtle, rgba(59, 130, 246, 0.1));
  color: var(--agui-provider-gemini, rgb(96, 165, 250));
}

/* ── Quick Test ──────────────────────────────────────────── */
.agui-quick-test-desc {
  font-size: 0.82rem;
  color: var(--agui-fg-subtle, #6e7681);
  margin: 0 0 0.75rem;
}

.agui-quick-test-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.agui-preset-chip {
  padding: 0.25rem 0.65rem;
  font-size: 0.78rem;
  border-radius: 20px;
  border: 1px solid var(--agui-input-border, rgba(255, 255, 255, 0.1));
  background: var(--agui-card-bg, rgba(255, 255, 255, 0.03));
  color: var(--agui-fg-muted, #8b949e);
  cursor: pointer;
  transition: all 0.2s;
}
.agui-preset-chip:hover,
.agui-preset-chip.active {
  background: var(--agui-focus-accent-light, rgba(99, 179, 237, 0.15));
  border-color: var(--agui-focus-accent-border, rgba(99, 179, 237, 0.4));
  color: var(--agui-accent, #58a6ff);
}

.agui-quick-test-input-row {
  display: flex;
  gap: 0.5rem;
}

.agui-quick-input {
  flex: 1;
  background: var(--agui-input-bg, rgba(0, 0, 0, 0.25));
  border: 1px solid var(--agui-input-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--agui-radius-md, 6px);
  color: var(--agui-fg, #c9d1d9);
  font-size: 0.88rem;
  padding: 0.45rem 0.75rem;
  outline: none;
  transition: border-color 0.2s;
}
.agui-quick-input:focus {
  border-color: var(--agui-focus-accent, rgba(99, 179, 237, 0.5));
}
.agui-quick-input:disabled {
  opacity: 0.5;
}

.agui-btn-send {
  padding: 0.45rem 0.85rem;
  background: var(--agui-focus-accent-light, rgba(99, 179, 237, 0.15));
  border: 1px solid var(--agui-focus-accent-border, rgba(99, 179, 237, 0.4));
  border-radius: var(--agui-radius-md, 6px);
  color: var(--agui-accent, #58a6ff);
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
}
.agui-btn-send:hover:not(:disabled) {
  background: var(--agui-focus-accent, rgba(99, 179, 237, 0.5));
}
.agui-btn-send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.agui-quick-test-hint {
  margin-top: 0.6rem;
  font-size: 0.78rem;
  color: var(--agui-fg-subtle, #6e7681);
}

.agui-quick-test-response {
  margin-top: 0.75rem;
  background: var(--agui-input-bg, rgba(0, 0, 0, 0.25));
  border: 1px solid var(--agui-card-border, rgba(255, 255, 255, 0.07));
  border-radius: var(--agui-radius-lg, 12px);
  padding: 0.75rem;
}

.agui-response-meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.agui-meta-chip {
  font-size: 0.7rem;
  padding: 0.18rem 0.55rem;
  border-radius: var(--agui-radius-sm, 4px);
  background: var(--agui-card-border, rgba(255, 255, 255, 0.07));
  color: var(--agui-fg-subtle, #6e7681);
}
.agui-meta-chip.agui-model {
  color: var(--agui-accent, #58a6ff);
  background: var(--agui-focus-accent-light, rgba(99, 179, 237, 0.15));
}
.agui-meta-chip.agui-tokens {
  color: var(--agui-warning-fg, #d29922);
  background: var(--agui-warning-subtle, rgba(210, 153, 34, 0.1));
}

.agui-response-text {
  font-size: 0.88rem;
  color: var(--agui-fg, #c9d1d9);
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
}

.agui-quick-test-error {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  color: var(--agui-danger-fg, #f85149);
}

/* ── Config form ─────────────────────────────────────────── */
.agui-config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}
@media (max-width: 760px) {
  .agui-config-grid {
    grid-template-columns: 1fr;
  }
}

.agui-provider-block {
  background: var(--agui-card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--agui-card-border, rgba(255, 255, 255, 0.07));
  border-radius: var(--agui-radius-lg, 12px);
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.agui-provider-block-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.agui-provider-block-header strong {
  font-size: 0.88rem;
  color: var(--agui-fg, #c9d1d9);
  flex: 1;
}

.agui-provider-note {
  font-size: 0.72rem;
  color: var(--agui-fg-subtle, #6e7681);
}

.agui-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.18rem 0.45rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.agui-badge.agui-local {
  background: var(--agui-focus-accent-light, rgba(99, 179, 237, 0.15));
  color: var(--agui-accent, #58a6ff);
}
.agui-badge.agui-cloud {
  background: var(--agui-provider-cloud-subtle, rgba(139, 92, 246, 0.12));
  color: var(--agui-provider-cloud, rgb(167, 139, 250));
}
.agui-badge.agui-gemini {
  background: var(--agui-provider-local-subtle, rgba(34, 197, 94, 0.1));
  color: var(--agui-provider-online, #48bb78);
}

.agui-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.agui-field label {
  font-size: 0.73rem;
  font-weight: var(--agui-fw-semibold, 600);
  color: var(--agui-fg-subtle, #6e7681);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.agui-field-input,
.agui-field-select {
  background: var(--agui-input-bg-deep, rgba(0, 0, 0, 0.3));
  border: 1px solid var(--agui-input-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--agui-radius-md, 6px);
  color: var(--agui-fg, #c9d1d9);
  font-size: 0.88rem;
  padding: 0.45rem 0.65rem;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.agui-field-input:focus,
.agui-field-select:focus {
  border-color: var(--agui-focus-accent, rgba(99, 179, 237, 0.5));
}
.agui-field-select option {
  background: var(--agui-canvas, #0d1117);
  color: var(--agui-fg, #c9d1d9);
}

.agui-field-note {
  font-size: 0.72rem;
  color: var(--agui-fg-subtle, #6e7681);
}
.agui-field-note a {
  color: var(--agui-accent, #58a6ff);
  text-decoration: none;
}
.agui-field-note a:hover {
  text-decoration: underline;
}

.agui-advanced-block {
  border: 1px solid var(--agui-card-border, rgba(255, 255, 255, 0.07));
  border-radius: var(--agui-radius-md, 6px);
  padding: 0.6rem 0.85rem;
  margin-bottom: 1rem;
}
.agui-advanced-block summary {
  font-size: 0.82rem;
  color: var(--agui-fg-subtle, #6e7681);
  cursor: pointer;
  user-select: none;
}

.agui-config-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agui-btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.4rem;
  background: var(--agui-btn-save-bg, linear-gradient(135deg, #3182ce, #1f6feb));
  color: var(--agui-fg-on-emphasis, #ffffff);
  border: none;
  border-radius: var(--agui-radius-md, 6px);
  font-size: 0.9rem;
  font-weight: var(--agui-fw-semibold, 600);
  cursor: pointer;
  transition: opacity 0.2s;
}
.agui-btn-save:hover:not(:disabled) {
  opacity: 0.88;
}
.agui-btn-save:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.agui-save-ok {
  font-size: 0.85rem;
  color: var(--agui-success-fg, #3fb950);
  font-weight: 500;
}

.agui-save-err {
  font-size: 0.82rem;
  color: var(--agui-danger-fg, #f85149);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.agui-btn-clear-err {
  background: transparent;
  border: none;
  color: var(--agui-danger-fg, #f85149);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  line-height: 1;
}

/* ── Legacy hint ─────────────────────────────────────────── */
.agui-legacy-badge {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--agui-radius-sm, 4px);
  background: var(--agui-warning-subtle, rgba(210, 153, 34, 0.1));
  color: var(--agui-warning-fg, #d29922);
}

.agui-legacy-hint p {
  font-size: 0.85rem;
  color: var(--agui-fg-muted, #8b949e);
  margin: 0 0 0.75rem;
}

.agui-env-table {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.agui-env-row {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  font-size: 0.83rem;
}
.agui-env-row code {
  font-family: monospace;
  color: var(--agui-accent, #58a6ff);
  background: var(--agui-focus-accent-light, rgba(99, 179, 237, 0.15));
  padding: 0.1rem 0.4rem;
  border-radius: var(--agui-radius-sm, 4px);
  white-space: nowrap;
}
.agui-env-row span {
  color: var(--agui-fg-subtle, #6e7681);
}

/* ── Spinners ─────────────────────────────────────────────── */
.agui-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid var(--agui-card-border, rgba(255, 255, 255, 0.07));
  border-top-color: var(--agui-accent, #58a6ff);
  border-radius: 50%;
  animation: agui-spin 0.7s linear infinite;
}

.agui-spinner-sm {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid var(--agui-card-border-hover, rgba(255, 255, 255, 0.12));
  border-top-color: var(--agui-fg-on-emphasis, #ffffff);
  border-radius: 50%;
  animation: agui-spin 0.7s linear infinite;
}

@keyframes agui-spin {
  to { transform: rotate(360deg); }
}
</style>
