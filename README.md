# @luetzen/ai-gateway-ui

> Vue 3 component library for AI Gateway settings — provider status, quick test, and configuration panel.

[![npm version](https://img.shields.io/npm/v/@luetzen/ai-gateway-ui.svg)](https://www.npmjs.com/package/@luetzen/ai-gateway-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎛️ **Provider Status** — real-time status of LM Studio, Anthropic Claude, and Google Gemini
- ⚡ **Quick Test** — send test messages to verify provider connectivity
- ⚙️ **Configuration Panel** — manage API keys, server URLs, and default models
- 🎨 **Fully Themeable** — CSS custom properties (`--agui-*`) for complete visual control
- 📦 **Decoupled** — bring your own HTTP client (axios, fetch, etc.)
- 🔌 **Pinia Store** — built-in state management via factory function

## Installation

```bash
npm install @luetzen/ai-gateway-ui
```

### Peer Dependencies

```bash
npm install vue pinia @luetzen/ai-gateway
```

## Quick Start

### 1. Create the store

```ts
// src/stores/ai-settings.ts
import { createAiSettingsStore } from "@luetzen/ai-gateway-ui";
import { apiClient } from "@/services/api/client"; // your axios instance

export const useAiSettingsStore = createAiSettingsStore({
  httpClient: apiClient,         // must implement { get, post, put }
  basePath: "/api/v1/ai",       // optional, this is the default
});
```

### 2. Use the component

```vue
<template>
  <AiSettingsPanel :store="aiSettings" />
</template>

<script setup lang="ts">
import { AiSettingsPanel } from "@luetzen/ai-gateway-ui";
import "@luetzen/ai-gateway-ui/style.css";
import { useAiSettingsStore } from "@/stores/ai-settings";

const aiSettings = useAiSettingsStore();
</script>
```

### 3. Apply a theme

**Option A: Use the default dark theme**

```ts
import "@luetzen/ai-gateway-ui/theme/default.css";
```

**Option B: Map your app's design tokens**

```css
:root {
  --agui-canvas: var(--my-bg);
  --agui-fg: var(--my-text);
  --agui-accent: var(--my-primary);
  --agui-card-bg: var(--my-card-bg);
  --agui-card-border: var(--my-card-border);
  /* ... see full token list below */
}
```

## Theming

All visual properties use CSS custom properties with the `--agui-` prefix. Every property has a sensible fallback, so the component works without any theme — but looks best with one.

### Token Reference

| Token | Description | Default |
|-------|-------------|---------|
| `--agui-canvas` | Page background | `#0d1117` |
| `--agui-fg` | Primary text | `#c9d1d9` |
| `--agui-fg-muted` | Secondary text | `#8b949e` |
| `--agui-fg-subtle` | Tertiary text | `#6e7681` |
| `--agui-fg-on-emphasis` | Text on colored bg | `#ffffff` |
| `--agui-accent` | Links, highlights | `#58a6ff` |
| `--agui-card-bg` | Card background | `rgba(255,255,255,0.03)` |
| `--agui-card-border` | Card border | `rgba(255,255,255,0.07)` |
| `--agui-input-bg` | Input background | `rgba(0,0,0,0.25)` |
| `--agui-input-border` | Input border | `rgba(255,255,255,0.1)` |
| `--agui-success-fg` | Success text | `#3fb950` |
| `--agui-danger-fg` | Error text | `#f85149` |
| `--agui-provider-online` | Online dot | `#48bb78` |
| `--agui-btn-save-bg` | Save button gradient | `linear-gradient(...)` |

See `src/theme-default.css` for the complete list.

## Slots

The component provides a `footer` slot for custom content below the config form:

```vue
<AiSettingsPanel :store="aiSettings">
  <template #footer>
    <h2>💡 Where is AI used?</h2>
    <p>Your custom content here...</p>
  </template>
</AiSettingsPanel>
```

## API

### `createAiSettingsStore(config)`

Factory function that creates a Pinia store.

```ts
interface AiGatewayUiConfig {
  httpClient: AiGatewayHttpClient; // { get, post, put } methods
  basePath?: string;               // default: "/api/v1/ai"
}
```

### `<AiSettingsPanel>`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `store` | Pinia store instance | ✅ | Return value of `useAiSettingsStore()` |

## License

MIT © [Luetzen](https://github.com/Luetzen)