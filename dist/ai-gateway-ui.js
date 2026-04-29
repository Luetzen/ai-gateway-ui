import { defineComponent as J, computed as m, ref as p, watch as X, onMounted as Z, openBlock as r, createElementBlock as d, createElementVNode as e, normalizeClass as k, createTextVNode as T, toDisplayString as g, Fragment as z, renderList as q, createCommentVNode as c, withDirectives as h, withKeys as ee, vModelText as O, withModifiers as ie, vModelSelect as $, createStaticVNode as ae, renderSlot as te } from "vue";
import { defineStore as le } from "pinia";
const I = {
  /** Auto: try local first, then Anthropic, then Gemini — first available wins. */
  auto: () => ({ type: "Auto" }),
  /** Use a specific local model by name. */
  local: (t) => ({ type: "Local", value: t }),
  // ---------------------------------------------------------------------------
  // Anthropic — Claude
  // ---------------------------------------------------------------------------
  /** Claude Haiku — fast and cheap. */
  haiku: () => ({ type: "Cloud", value: "haiku" }),
  /** Claude Sonnet — balanced quality/speed/cost. */
  sonnet: () => ({ type: "Cloud", value: "sonnet" }),
  /** Claude Opus — most capable Claude model. */
  opus: () => ({ type: "Cloud", value: "opus" }),
  // ---------------------------------------------------------------------------
  // Google Gemini
  // ---------------------------------------------------------------------------
  /**
   * Gemini 2.5 Flash — fast, free tier available (500 req/day, 10 req/min).
   * Recommended default for Gemini.
   */
  geminiFlash: () => ({ type: "Gemini", value: "flash" }),
  /**
   * Gemini 2.5 Pro — most capable Gemini model.
   * Free tier: 50 req/day, 5 req/min.
   */
  geminiPro: () => ({ type: "Gemini", value: "pro" }),
  /**
   * Gemini 2.0 Flash Lite — ultra-fast, highest free tier quota (1500 req/day, 30 req/min).
   * Great for high-volume or latency-sensitive tasks.
   */
  geminiFlashLite: () => ({ type: "Gemini", value: "flash_lite" }),
  /**
   * Use a specific Gemini model by variant name.
   * Accepts: "flash" | "pro" | "flash_lite"
   */
  gemini: (t) => ({
    type: "Gemini",
    value: t
  }),
  // ---------------------------------------------------------------------------
  // OpenAI
  // ---------------------------------------------------------------------------
  /** GPT-4o Mini — fast, affordable, intelligent. */
  gpt4oMini: () => ({ type: "OpenAi", value: "gpt_4o_mini" }),
  /** GPT-4o — versatile, high-intelligence model. */
  gpt4o: () => ({ type: "OpenAi", value: "gpt_4o" }),
  /** o3-mini — fast reasoning model. */
  o3Mini: () => ({ type: "OpenAi", value: "o3_mini" }),
  /** o1 — advanced reasoning model for complex tasks. */
  o1: () => ({ type: "OpenAi", value: "o1" }),
  /** Use a specific OpenAI model by variant name. */
  openAi: (t) => ({
    type: "OpenAi",
    value: t
  })
}, oe = { class: "agui-settings-container" }, se = { class: "agui-settings-content" }, ne = { class: "agui-top-row" }, ue = { class: "agui-card agui-status-card" }, re = { class: "agui-card-header" }, de = ["disabled"], pe = {
  key: 0,
  class: "agui-status-loading"
}, ve = {
  key: 1,
  class: "agui-provider-list"
}, ge = { class: "agui-provider-status" }, ce = { class: "agui-provider-status" }, fe = { class: "agui-provider-status" }, me = { class: "agui-provider-status" }, ye = { class: "agui-provider-status" }, Ae = { class: "agui-card agui-quick-test-card" }, he = { class: "agui-model-row" }, ke = ["value", "disabled"], be = {
  key: 0,
  label: "🖥 Lokal (LM Studio)"
}, Me = ["value"], Ce = ["value"], Se = {
  key: 1,
  label: "☁ Anthropic Claude"
}, we = {
  key: 2,
  label: "✦ Google Gemini"
}, _e = {
  key: 3,
  label: "🟩 OpenAI"
}, Le = { class: "agui-quick-test-presets" }, Ge = ["onClick"], Oe = { class: "agui-quick-test-input-row" }, Ke = ["disabled"], Ie = ["disabled"], Pe = {
  key: 0,
  class: "agui-spinner-sm"
}, Te = { key: 1 }, Fe = {
  key: 0,
  class: "agui-quick-test-hint"
}, $e = {
  key: 1,
  class: "agui-quick-test-response"
}, Ue = { class: "agui-response-meta" }, Ee = { class: "agui-meta-chip" }, ze = { class: "agui-meta-chip agui-model" }, qe = {
  key: 0,
  class: "agui-meta-chip agui-tokens"
}, Ve = { class: "agui-response-text" }, Ne = {
  key: 2,
  class: "agui-quick-test-error"
}, xe = { class: "agui-card agui-config-card" }, De = { class: "agui-card-header" }, Re = {
  key: 0,
  class: "agui-legacy-badge"
}, He = {
  key: 0,
  class: "agui-legacy-hint"
}, Be = { class: "agui-config-grid" }, Qe = { class: "agui-provider-block" }, Ye = { class: "agui-field" }, We = { class: "agui-provider-block" }, je = { class: "agui-field" }, Je = { class: "agui-field" }, Xe = { class: "agui-provider-block" }, Ze = { class: "agui-field" }, ei = { class: "agui-field" }, ii = { class: "agui-provider-block" }, ai = { class: "agui-field" }, ti = { class: "agui-field" }, li = { class: "agui-advanced-block" }, oi = {
  class: "agui-field",
  style: { "margin-top": "0.75rem" }
}, si = { class: "agui-config-footer" }, ni = ["disabled"], ui = { key: 0 }, ri = { key: 1 }, di = {
  key: 0,
  class: "agui-save-ok"
}, pi = {
  key: 1,
  class: "agui-save-err"
}, vi = {
  key: 0,
  class: "agui-card agui-usage-hint-card"
}, hi = /* @__PURE__ */ J({
  __name: "AiSettingsPanel",
  props: {
    store: {}
  },
  setup(t) {
    const l = t, a = m(() => l.store), K = ["Wer bist du?", "Antworte auf Deutsch", "Ping!"], y = p("Wer bist du?"), A = p(!1), f = p(null), v = p(""), P = m(() => {
      const o = a.value.activeModel;
      return o.type === "Auto" ? "auto" : o.type === "Local" ? `local:${o.value}` : o.type === "Cloud" ? `cloud:${o.value}` : o.type === "Gemini" ? `gemini:${o.value}` : o.type === "OpenAi" ? `openai:${o.value}` : "auto";
    });
    function C(o) {
      const i = o.target.value;
      let s;
      if (!i || i === "auto")
        s = I.auto();
      else {
        const [M, L] = i.split(":");
        M === "local" ? s = { type: "Local", value: L } : M === "cloud" ? s = { type: "Cloud", value: L } : M === "gemini" ? s = { type: "Gemini", value: L } : M === "openai" ? s = { type: "OpenAi", value: L } : s = I.auto();
      }
      a.value.setActiveModel(s);
    }
    async function S() {
      if (!(!y.value.trim() || !a.value.isAvailable)) {
        A.value = !0, f.value = null, v.value = "";
        try {
          const o = await a.value.chat({
            model: a.value.activeModel,
            system: "Antworte sehr kurz — maximal 2 Sätze.",
            messages: [{ role: "user", content: y.value.trim() }],
            max_tokens: 256,
            temperature: 0.5
          });
          o && (f.value = {
            content: o.content,
            provider: o.provider,
            modelUsed: o.modelUsed,
            usage: o.usage ? { totalTokens: o.usage.totalTokens } : null
          });
        } catch (o) {
          v.value = o.message ?? "Fehler beim Test";
        } finally {
          A.value = !1;
        }
      }
    }
    async function w() {
      await a.value.fetchStatus(), a.value.isLocalOnline && await a.value.fetchModels();
    }
    const b = p(!1), n = p({
      lmStudioUrl: null,
      anthropicApiKey: null,
      geminiApiKey: null,
      openAiApiKey: null,
      defaultLocalModel: null,
      defaultCloudModel: null,
      defaultGeminiModel: null,
      defaultOpenAiModel: null
    });
    X(
      () => a.value.config,
      (o) => {
        o && (n.value = {
          lmStudioUrl: o.lmStudioUrl,
          anthropicApiKey: o.anthropicApiKey,
          geminiApiKey: o.geminiApiKey,
          openAiApiKey: o.openAiApiKey,
          defaultLocalModel: o.defaultLocalModel,
          defaultCloudModel: o.defaultCloudModel,
          defaultGeminiModel: o.defaultGeminiModel,
          defaultOpenAiModel: o.defaultOpenAiModel
        });
      },
      { immediate: !0 }
    );
    async function _() {
      const o = {
        lmStudioUrl: n.value.lmStudioUrl?.trim() || null,
        anthropicApiKey: n.value.anthropicApiKey?.trim() || null,
        geminiApiKey: n.value.geminiApiKey?.trim() || null,
        openAiApiKey: n.value.openAiApiKey?.trim() || null,
        defaultLocalModel: n.value.defaultLocalModel?.trim() || null,
        defaultCloudModel: n.value.defaultCloudModel?.trim() || null,
        defaultGeminiModel: n.value.defaultGeminiModel?.trim() || null,
        defaultOpenAiModel: n.value.defaultOpenAiModel?.trim() || null
      };
      await a.value.saveConfig(o) && (b.value = !0, setTimeout(() => b.value = !1, 3e3));
    }
    return Z(async () => {
      await a.value.initialize();
    }), (o, i) => (r(), d("div", oe, [
      i[53] || (i[53] = e("div", { class: "agui-settings-header" }, [
        e("h1", null, "🤖 AI Gateway"),
        e("p", { class: "agui-header-subtitle" }, " KI-Provider konfigurieren für Prompt-Optimierung und Asset-Generierung ")
      ], -1)),
      e("div", se, [
        e("div", ne, [
          e("div", ue, [
            e("div", re, [
              i[10] || (i[10] = e("h2", null, "Provider Status", -1)),
              e("button", {
                class: "agui-btn-icon",
                disabled: a.value.isLoadingStatus,
                title: "Status aktualisieren",
                onClick: w
              }, [
                e("span", {
                  class: k({ "agui-spinning": a.value.isLoadingStatus })
                }, "🔄", 2)
              ], 8, de)
            ]),
            a.value.isLoadingStatus ? (r(), d("div", pe, [...i[11] || (i[11] = [
              e("span", { class: "agui-spinner" }, null, -1),
              T(" Lade Status… ", -1)
            ])])) : (r(), d("div", ve, [
              e("div", {
                class: k(["agui-provider-row", { online: a.value.isAvailable }])
              }, [
                i[12] || (i[12] = e("span", { class: "agui-provider-dot" }, null, -1)),
                i[13] || (i[13] = e("span", { class: "agui-provider-name" }, "AI Gateway", -1)),
                e("span", ge, g(a.value.isAvailable ? a.value.providerCount + " Provider aktiv" : "Nicht konfiguriert"), 1)
              ], 2),
              e("div", {
                class: k(["agui-provider-row", { online: a.value.isLocalOnline }])
              }, [
                i[14] || (i[14] = e("span", { class: "agui-provider-dot" }, null, -1)),
                i[15] || (i[15] = e("span", { class: "agui-provider-name" }, "🖥 LM Studio", -1)),
                e("span", ce, g(a.value.isLocalOnline ? "Online (" + a.value.loadedModels.length + " Modell)" : "Offline"), 1)
              ], 2),
              e("div", {
                class: k(["agui-provider-row", { online: a.value.isAnthropicConfigured }])
              }, [
                i[16] || (i[16] = e("span", { class: "agui-provider-dot" }, null, -1)),
                i[17] || (i[17] = e("span", { class: "agui-provider-name" }, "☁ Anthropic", -1)),
                e("span", fe, g(a.value.isAnthropicConfigured ? "Konfiguriert" : "Kein API Key"), 1)
              ], 2),
              e("div", {
                class: k(["agui-provider-row", { online: a.value.isGeminiConfigured }])
              }, [
                i[18] || (i[18] = e("span", { class: "agui-provider-dot" }, null, -1)),
                i[19] || (i[19] = e("span", { class: "agui-provider-name" }, "✦ Gemini", -1)),
                e("span", me, g(a.value.isGeminiConfigured ? "Konfiguriert" : "Kein API Key"), 1)
              ], 2),
              e("div", {
                class: k(["agui-provider-row", { online: a.value.isOpenAiConfigured }])
              }, [
                i[20] || (i[20] = e("span", { class: "agui-provider-dot" }, null, -1)),
                i[21] || (i[21] = e("span", { class: "agui-provider-name" }, "🟩 OpenAI", -1)),
                e("span", ye, g(a.value.isOpenAiConfigured ? "Konfiguriert" : "Kein API Key"), 1)
              ], 2)
            ]))
          ]),
          e("div", Ae, [
            i[27] || (i[27] = e("div", { class: "agui-card-header" }, [
              e("h2", null, "Quick-Test"),
              e("span", { class: "agui-card-hint" }, "Verbindung prüfen")
            ], -1)),
            e("div", he, [
              i[26] || (i[26] = e("label", { class: "agui-model-label" }, "Modell", -1)),
              e("select", {
                class: "agui-model-select",
                value: P.value,
                disabled: A.value,
                onChange: C
              }, [
                i[25] || (i[25] = e("option", { value: "auto" }, "⚡ Auto (Lokal → Claude → Gemini)", -1)),
                a.value.isLocalOnline ? (r(), d("optgroup", be, [
                  (r(!0), d(z, null, q(a.value.localModels, (s) => (r(), d("option", {
                    key: s.id,
                    value: `local:${s.id}`
                  }, g(s.id), 9, Me))), 128)),
                  !a.value.localModels.length && a.value.config?.defaultLocalModel ? (r(), d("option", {
                    key: 0,
                    value: `local:${a.value.config.defaultLocalModel}`
                  }, g(a.value.config.defaultLocalModel), 9, Ce)) : c("", !0)
                ])) : c("", !0),
                a.value.isAnthropicConfigured ? (r(), d("optgroup", Se, [...i[22] || (i[22] = [
                  e("option", { value: "cloud:haiku" }, "Haiku — schnell & günstig", -1),
                  e("option", { value: "cloud:sonnet" }, "Sonnet — ausgewogen", -1),
                  e("option", { value: "cloud:opus" }, "Opus — leistungsstark", -1)
                ])])) : c("", !0),
                a.value.isGeminiConfigured ? (r(), d("optgroup", we, [...i[23] || (i[23] = [
                  e("option", { value: "gemini:flash" }, "Flash — schnell, Free Tier", -1),
                  e("option", { value: "gemini:flash_lite" }, "Flash Lite — ultra-schnell", -1),
                  e("option", { value: "gemini:pro" }, "Pro — leistungsstark", -1)
                ])])) : c("", !0),
                a.value.isOpenAiConfigured ? (r(), d("optgroup", _e, [...i[24] || (i[24] = [
                  e("option", { value: "openai:gpt_4o_mini" }, "GPT-4o Mini — schnell & günstig", -1),
                  e("option", { value: "openai:gpt_4o" }, "GPT-4o — leistungsstark", -1),
                  e("option", { value: "openai:o1" }, "o1 — reasoning", -1),
                  e("option", { value: "openai:o3_mini" }, "o3-mini — fast reasoning", -1)
                ])])) : c("", !0)
              ], 40, ke),
              e("span", {
                class: k(["agui-model-badge", `agui-qm-${a.value.activeModel.type.toLowerCase()}`])
              }, g(a.value.activeModelLabel), 3)
            ]),
            i[28] || (i[28] = e("p", { class: "agui-quick-test-desc" }, " Schicke eine kurze Nachricht um zu prüfen ob der konfigurierte Provider antwortet. ", -1)),
            e("div", Le, [
              (r(), d(z, null, q(K, (s) => e("button", {
                key: s,
                type: "button",
                class: k(["agui-preset-chip", { active: y.value === s }]),
                onClick: (M) => y.value = s
              }, g(s), 11, Ge)), 64))
            ]),
            e("div", Oe, [
              h(e("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (s) => y.value = s),
                type: "text",
                placeholder: "Eigene Nachricht…",
                class: "agui-quick-input",
                disabled: A.value || !a.value.isAvailable,
                onKeyup: ee(S, ["enter"])
              }, null, 40, Ke), [
                [O, y.value]
              ]),
              e("button", {
                class: "agui-btn-send",
                disabled: A.value || !y.value.trim() || !a.value.isAvailable,
                onClick: S
              }, [
                A.value ? (r(), d("span", Pe)) : (r(), d("span", Te, "▶"))
              ], 8, Ie)
            ]),
            !a.value.isAvailable && !a.value.isLoadingStatus ? (r(), d("div", Fe, " Kein Provider konfiguriert — trage unten einen API Key ein. ")) : c("", !0),
            f.value ? (r(), d("div", $e, [
              e("div", Ue, [
                e("span", Ee, g(f.value.provider), 1),
                e("span", ze, g(f.value.modelUsed), 1),
                f.value.usage?.totalTokens ? (r(), d("span", qe, g(f.value.usage.totalTokens) + " Tokens ", 1)) : c("", !0)
              ]),
              e("p", Ve, g(f.value.content), 1)
            ])) : c("", !0),
            v.value ? (r(), d("div", Ne, g(v.value), 1)) : c("", !0)
          ])
        ]),
        e("div", xe, [
          e("div", De, [
            i[29] || (i[29] = e("h2", null, "⚙️ Konfiguration", -1)),
            a.value.configSupported === !1 ? (r(), d("span", Re, "Env-Vars only")) : c("", !0)
          ]),
          a.value.configSupported === !1 ? (r(), d("div", He, [...i[30] || (i[30] = [
            e("p", null, " Diese Instanz unterstützt keine In-App-Konfiguration. Setze die folgenden Umgebungsvariablen im Backend: ", -1),
            e("div", { class: "agui-env-table" }, [
              e("div", { class: "agui-env-row" }, [
                e("code", null, "LM_STUDIO_URL"),
                e("span", null, "http://192.168.1.x:1234")
              ]),
              e("div", { class: "agui-env-row" }, [
                e("code", null, "ANTHROPIC_API_KEY"),
                e("span", null, "sk-ant-…")
              ]),
              e("div", { class: "agui-env-row" }, [
                e("code", null, "GEMINI_API_KEY"),
                e("span", null, "AIza… (Free Tier verfügbar)")
              ])
            ], -1)
          ])])) : (r(), d("form", {
            key: 1,
            class: "agui-config-form",
            onSubmit: ie(_, ["prevent"])
          }, [
            e("div", Be, [
              e("div", Qe, [
                i[33] || (i[33] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-local" }, "🖥 Lokal"),
                  e("strong", null, "LM Studio"),
                  e("span", { class: "agui-provider-note" }, "Kostenlos · lokal")
                ], -1)),
                e("div", Ye, [
                  i[31] || (i[31] = e("label", null, "Server-URL", -1)),
                  h(e("input", {
                    "onUpdate:modelValue": i[1] || (i[1] = (s) => n.value.lmStudioUrl = s),
                    type: "url",
                    placeholder: "http://192.168.1.121:1234",
                    class: "agui-field-input",
                    autocomplete: "off"
                  }, null, 512), [
                    [O, n.value.lmStudioUrl]
                  ]),
                  i[32] || (i[32] = e("span", { class: "agui-field-note" }, "IP + Port deines LM Studio Servers", -1))
                ])
              ]),
              e("div", We, [
                i[38] || (i[38] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-cloud" }, "☁ Cloud"),
                  e("strong", null, "Anthropic Claude"),
                  e("span", { class: "agui-provider-note" }, "Haiku / Sonnet / Opus")
                ], -1)),
                e("div", je, [
                  i[34] || (i[34] = e("label", null, "API Key", -1)),
                  h(e("input", {
                    "onUpdate:modelValue": i[2] || (i[2] = (s) => n.value.anthropicApiKey = s),
                    type: "password",
                    placeholder: "sk-ant-…",
                    class: "agui-field-input",
                    autocomplete: "new-password"
                  }, null, 512), [
                    [O, n.value.anthropicApiKey]
                  ]),
                  i[35] || (i[35] = e("span", { class: "agui-field-note" }, [
                    e("a", {
                      href: "https://console.anthropic.com/",
                      target: "_blank",
                      rel: "noopener"
                    }, "console.anthropic.com")
                  ], -1))
                ]),
                e("div", Je, [
                  i[37] || (i[37] = e("label", null, "Standard-Modell", -1)),
                  h(e("select", {
                    "onUpdate:modelValue": i[3] || (i[3] = (s) => n.value.defaultCloudModel = s),
                    class: "agui-field-select"
                  }, [...i[36] || (i[36] = [
                    e("option", { value: "" }, "Standard (sonnet)", -1),
                    e("option", { value: "haiku" }, "Haiku — schnell & günstig", -1),
                    e("option", { value: "sonnet" }, "Sonnet — ausgewogen", -1),
                    e("option", { value: "opus" }, "Opus — leistungsstark", -1)
                  ])], 512), [
                    [$, n.value.defaultCloudModel]
                  ])
                ])
              ]),
              e("div", Xe, [
                i[43] || (i[43] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-gemini" }, "✦ Free"),
                  e("strong", null, "Google Gemini"),
                  e("span", { class: "agui-provider-note" }, "Free Tier verfügbar")
                ], -1)),
                e("div", Ze, [
                  i[39] || (i[39] = e("label", null, "API Key", -1)),
                  h(e("input", {
                    "onUpdate:modelValue": i[4] || (i[4] = (s) => n.value.geminiApiKey = s),
                    type: "password",
                    placeholder: "AIza…",
                    class: "agui-field-input",
                    autocomplete: "new-password"
                  }, null, 512), [
                    [O, n.value.geminiApiKey]
                  ]),
                  i[40] || (i[40] = e("span", { class: "agui-field-note" }, [
                    e("a", {
                      href: "https://aistudio.google.com/apikey",
                      target: "_blank",
                      rel: "noopener"
                    }, "aistudio.google.com/apikey"),
                    T(" — kostenloser Free Tier ")
                  ], -1))
                ]),
                e("div", ei, [
                  i[42] || (i[42] = e("label", null, "Standard-Modell", -1)),
                  h(e("select", {
                    "onUpdate:modelValue": i[5] || (i[5] = (s) => n.value.defaultGeminiModel = s),
                    class: "agui-field-select"
                  }, [...i[41] || (i[41] = [
                    e("option", { value: "" }, "Standard (flash)", -1),
                    e("option", { value: "flash" }, "Flash — schnell, Free Tier", -1),
                    e("option", { value: "flash_lite" }, "Flash Lite — ultra-schnell", -1),
                    e("option", { value: "pro" }, "Pro — leistungsstark", -1)
                  ])], 512), [
                    [$, n.value.defaultGeminiModel]
                  ])
                ])
              ]),
              e("div", ii, [
                i[48] || (i[48] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-openai" }, "🟩 Premium"),
                  e("strong", null, "OpenAI"),
                  e("span", { class: "agui-provider-note" }, "GPT-4o / o1")
                ], -1)),
                e("div", ai, [
                  i[44] || (i[44] = e("label", null, "API Key", -1)),
                  h(e("input", {
                    "onUpdate:modelValue": i[6] || (i[6] = (s) => n.value.openAiApiKey = s),
                    type: "password",
                    placeholder: "sk-proj-…",
                    class: "agui-field-input",
                    autocomplete: "new-password"
                  }, null, 512), [
                    [O, n.value.openAiApiKey]
                  ]),
                  i[45] || (i[45] = e("span", { class: "agui-field-note" }, [
                    e("a", {
                      href: "https://platform.openai.com/api-keys",
                      target: "_blank",
                      rel: "noopener"
                    }, "platform.openai.com/api-keys")
                  ], -1))
                ]),
                e("div", ti, [
                  i[47] || (i[47] = e("label", null, "Standard-Modell", -1)),
                  h(e("select", {
                    "onUpdate:modelValue": i[7] || (i[7] = (s) => n.value.defaultOpenAiModel = s),
                    class: "agui-field-select"
                  }, [...i[46] || (i[46] = [
                    ae('<option value="">Standard (gpt_4o_mini)</option><option value="gpt_4o_mini">GPT-4o Mini — schnell &amp; günstig</option><option value="gpt_4o">GPT-4o — leistungsstark</option><option value="o1">o1 — reasoning</option><option value="o3_mini">o3-mini — fast reasoning</option>', 5)
                  ])], 512), [
                    [$, n.value.defaultOpenAiModel]
                  ])
                ])
              ])
            ]),
            e("details", li, [
              i[51] || (i[51] = e("summary", null, "Erweitert", -1)),
              e("div", oi, [
                i[49] || (i[49] = e("label", null, "Standard lokales Modell", -1)),
                h(e("input", {
                  "onUpdate:modelValue": i[8] || (i[8] = (s) => n.value.defaultLocalModel = s),
                  type: "text",
                  placeholder: "z.B. mistral-7b-instruct",
                  class: "agui-field-input"
                }, null, 512), [
                  [O, n.value.defaultLocalModel]
                ]),
                i[50] || (i[50] = e("span", { class: "agui-field-note" }, "Modellname wie in LM Studio angezeigt (optional)", -1))
              ])
            ]),
            e("div", si, [
              e("button", {
                type: "submit",
                class: "agui-btn-save",
                disabled: a.value.isSavingConfig
              }, [
                a.value.isSavingConfig ? (r(), d("span", ui, [...i[52] || (i[52] = [
                  e("span", { class: "agui-spinner-sm" }, null, -1),
                  T(" Speichern… ", -1)
                ])])) : (r(), d("span", ri, "💾 Speichern"))
              ], 8, ni),
              b.value ? (r(), d("span", di, "✓ Gespeichert & aktiv")) : c("", !0),
              a.value.error ? (r(), d("span", pi, [
                T(g(a.value.error) + " ", 1),
                e("button", {
                  type: "button",
                  class: "agui-btn-clear-err",
                  onClick: i[9] || (i[9] = (s) => a.value.clearError())
                }, "✕")
              ])) : c("", !0)
            ])
          ], 32))
        ]),
        o.$slots.footer ? (r(), d("div", vi, [
          te(o.$slots, "footer")
        ])) : c("", !0)
      ])
    ]));
  }
});
class gi {
  constructor(l, a = "/api/v1/ai") {
    this.http = l, this.base = a;
  }
  async getConfig() {
    const l = await this.http.get(
      `${this.base}/config`
    );
    if (l.data.success && l.data.data)
      return l.data.data;
    throw new Error(l.data.error || "Failed to fetch AI config");
  }
  async saveConfig(l) {
    const a = await this.http.put(
      `${this.base}/config`,
      l
    );
    if (a.data.success && a.data.data)
      return a.data.data;
    throw new Error(a.data.error || "Failed to save AI config");
  }
  async getStatus() {
    const l = await this.http.get(
      `${this.base}/status`
    );
    if (l.data.success && l.data.data)
      return l.data.data;
    throw new Error(l.data.error || "Failed to fetch AI status");
  }
  async chat(l) {
    const a = await this.http.post(
      `${this.base}/chat`,
      l
    );
    if (a.data.success && a.data.data)
      return a.data.data;
    throw new Error(a.data.error || "AI chat request failed");
  }
  async getModels() {
    const l = await this.http.get(
      `${this.base}/models`
    );
    if (l.data.success && l.data.data)
      return l.data.data;
    throw new Error(l.data.error || "Failed to fetch AI models");
  }
  async loadModel(l) {
    const a = await this.http.post(`${this.base}/models/load`, { model: l });
    if (!a.data.success)
      throw new Error(a.data.error || "Failed to load model");
  }
}
const V = "agui_active_model";
function ci(t) {
  return t.type === "Auto" ? "auto" : t.type === "Local" ? `local:${t.value}` : t.type === "Cloud" ? `cloud:${t.value}` : t.type === "Gemini" ? `gemini:${t.value}` : t.type === "OpenAi" ? `openai:${t.value}` : "auto";
}
function fi(t) {
  if (!t || t === "auto") return I.auto();
  const [l, a] = t.split(":");
  return l === "local" && a ? I.local(a) : l === "cloud" && a ? { type: "Cloud", value: a } : l === "gemini" && a ? { type: "Gemini", value: a } : l === "openai" && a ? { type: "OpenAi", value: a } : I.auto();
}
function mi(t) {
  return t.type === "Auto" ? "Auto" : t.type === "Local" ? `Local: ${t.value}` : t.type === "Cloud" ? `Claude ${{ haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" }[t.value] ?? t.value}` : t.type === "Gemini" ? { flash: "Gemini Flash", pro: "Gemini Pro", flash_lite: "Gemini Flash Lite" }[t.value] ?? `Gemini ${t.value}` : t.type === "OpenAi" ? { gpt_4o: "GPT-4o", gpt_4o_mini: "GPT-4o Mini", o1: "o1", o3_mini: "o3-mini" }[t.value] ?? `OpenAI ${t.value}` : "Auto";
}
function ki(t) {
  const l = new gi(t.httpClient, t.basePath);
  return le("agui-ai-settings", () => {
    const a = p(null), K = p([]), y = p(!1), A = p(!1), f = p(!1), v = p(null), P = p(null), C = p(
      fi(localStorage.getItem(V) ?? "auto")
    ), S = p(!1), w = p(null), b = p(!1), n = p(!1), _ = p(null), o = m(() => a.value?.available ?? !1), i = m(() => a.value?.lmStudioOnline ?? !1), s = m(() => a.value?.anthropicConfigured ?? !1), M = m(() => a.value?.geminiConfigured ?? !1), L = m(() => a.value?.openAiConfigured ?? !1), N = m(() => a.value?.loadedModels ?? []), x = m(() => w.value?.isConfigured ?? !1), D = m(() => mi(C.value)), R = m(() => {
      const u = C.value;
      return u.type === "Auto" ? "Auto" : u.type === "Local" ? "Local" : u.type === "Cloud" ? "Claude" : u.type === "Gemini" ? "Gemini" : u.type === "OpenAi" ? "OpenAI" : "Auto";
    }), H = m(() => {
      let u = 0;
      return a.value?.lmStudioOnline && u++, a.value?.anthropicConfigured && u++, a.value?.geminiConfigured && u++, a.value?.openAiConfigured && u++, u;
    });
    function B() {
      v.value = null;
    }
    function Q(u) {
      C.value = u;
      try {
        localStorage.setItem(V, ci(u));
      } catch {
      }
    }
    async function U() {
      b.value = !0, v.value = null;
      try {
        w.value = await l.getConfig(), _.value = !0;
      } catch (u) {
        u?.response?.status === 501 ? _.value = !1 : v.value = u.message || "Failed to load AI configuration";
      } finally {
        b.value = !1;
      }
    }
    async function Y(u) {
      n.value = !0, v.value = null;
      try {
        return w.value = await l.saveConfig(u), _.value = !0, await F(), !0;
      } catch (G) {
        return v.value = G.message || "Failed to save AI configuration", !1;
      } finally {
        n.value = !1;
      }
    }
    async function F() {
      y.value = !0, v.value = null;
      try {
        a.value = await l.getStatus(), S.value = !0;
      } catch (u) {
        v.value = u.message || "Failed to fetch AI status";
      } finally {
        y.value = !1;
      }
    }
    async function E() {
      A.value = !0, v.value = null;
      try {
        const u = await l.getModels();
        K.value = u.models;
      } catch (u) {
        v.value = u.message || "Failed to fetch models", K.value = [];
      } finally {
        A.value = !1;
      }
    }
    async function W(u) {
      f.value = !0, v.value = null;
      try {
        const G = await l.chat(u);
        return P.value = G, G;
      } catch (G) {
        return v.value = G.message || "AI chat request failed", null;
      } finally {
        f.value = !1;
      }
    }
    async function j() {
      S.value || (await U(), await F(), a.value?.lmStudioOnline && await E());
    }
    return {
      // State
      status: a,
      localModels: K,
      isLoadingStatus: y,
      isLoadingModels: A,
      isProcessing: f,
      error: v,
      lastResponse: P,
      activeModel: C,
      initialized: S,
      config: w,
      isLoadingConfig: b,
      isSavingConfig: n,
      configSupported: _,
      // Computed
      isAvailable: o,
      isLocalOnline: i,
      isAnthropicConfigured: s,
      isGeminiConfigured: M,
      isOpenAiConfigured: L,
      loadedModels: N,
      providerCount: H,
      isConfigured: x,
      activeModelLabel: D,
      activeModelProviderTag: R,
      // Actions
      clearError: B,
      setActiveModel: Q,
      loadConfig: U,
      saveConfig: Y,
      fetchStatus: F,
      fetchModels: E,
      chat: W,
      initialize: j
    };
  });
}
export {
  hi as AiSettingsPanel,
  ki as createAiSettingsStore
};
