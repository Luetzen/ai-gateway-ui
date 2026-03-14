import { defineComponent as j, computed as y, ref as v, watch as J, onMounted as X, openBlock as u, createElementBlock as r, createElementVNode as e, normalizeClass as b, createTextVNode as T, toDisplayString as p, Fragment as O, renderList as z, createCommentVNode as f, withDirectives as A, withKeys as Z, vModelText as I, withModifiers as ee, vModelSelect as q, renderSlot as ae } from "vue";
import { defineStore as te } from "pinia";
const F = {
  /** Auto: try local first, then Anthropic, then Gemini — first available wins. */
  auto: () => ({ type: "Auto" }),
  /** Use a specific local model by name. */
  local: (o) => ({ type: "Local", value: o }),
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
  gemini: (o) => ({
    type: "Gemini",
    value: o
  })
}, le = { class: "agui-settings-container" }, ie = { class: "agui-settings-content" }, se = { class: "agui-top-row" }, oe = { class: "agui-card agui-status-card" }, ne = { class: "agui-card-header" }, ue = ["disabled"], re = {
  key: 0,
  class: "agui-status-loading"
}, de = {
  key: 1,
  class: "agui-provider-list"
}, ve = { class: "agui-provider-status" }, ce = { class: "agui-provider-status" }, pe = { class: "agui-provider-status" }, ge = { class: "agui-provider-status" }, fe = { class: "agui-card agui-quick-test-card" }, me = { class: "agui-model-row" }, ye = ["value", "disabled"], he = {
  key: 0,
  label: "🖥 Lokal (LM Studio)"
}, ke = ["value"], be = ["value"], Ae = {
  key: 1,
  label: "☁ Anthropic Claude"
}, Me = {
  key: 2,
  label: "✦ Google Gemini"
}, Se = { class: "agui-quick-test-presets" }, Ce = ["onClick"], we = { class: "agui-quick-test-input-row" }, Le = ["disabled"], _e = ["disabled"], Ge = {
  key: 0,
  class: "agui-spinner-sm"
}, Ke = { key: 1 }, Ie = {
  key: 0,
  class: "agui-quick-test-hint"
}, Fe = {
  key: 1,
  class: "agui-quick-test-response"
}, Pe = { class: "agui-response-meta" }, Te = { class: "agui-meta-chip" }, $e = { class: "agui-meta-chip agui-model" }, Ee = {
  key: 0,
  class: "agui-meta-chip agui-tokens"
}, Ue = { class: "agui-response-text" }, Oe = {
  key: 2,
  class: "agui-quick-test-error"
}, ze = { class: "agui-card agui-config-card" }, qe = { class: "agui-card-header" }, Ve = {
  key: 0,
  class: "agui-legacy-badge"
}, xe = {
  key: 0,
  class: "agui-legacy-hint"
}, Ne = { class: "agui-config-grid" }, De = { class: "agui-provider-block" }, Re = { class: "agui-field" }, He = { class: "agui-provider-block" }, Be = { class: "agui-field" }, Qe = { class: "agui-field" }, Ye = { class: "agui-provider-block" }, We = { class: "agui-field" }, je = { class: "agui-field" }, Je = { class: "agui-advanced-block" }, Xe = {
  class: "agui-field",
  style: { "margin-top": "0.75rem" }
}, Ze = { class: "agui-config-footer" }, ea = ["disabled"], aa = { key: 0 }, ta = { key: 1 }, la = {
  key: 0,
  class: "agui-save-ok"
}, ia = {
  key: 1,
  class: "agui-save-err"
}, sa = {
  key: 0,
  class: "agui-card agui-usage-hint-card"
}, ca = /* @__PURE__ */ j({
  __name: "AiSettingsPanel",
  props: {
    store: {}
  },
  setup(o) {
    const l = o, t = y(() => l.store), G = ["Wer bist du?", "Antworte auf Deutsch", "Ping!"], m = v("Wer bist du?"), h = v(!1), g = v(null), c = v(""), P = y(() => {
      const i = t.value.activeModel;
      return i.type === "Auto" ? "auto" : i.type === "Local" ? `local:${i.value}` : i.type === "Cloud" ? `cloud:${i.value}` : i.type === "Gemini" ? `gemini:${i.value}` : "auto";
    });
    function M(i) {
      const a = i.target.value;
      let s;
      if (!a || a === "auto")
        s = F.auto();
      else {
        const [L, K] = a.split(":");
        L === "local" ? s = { type: "Local", value: K } : L === "cloud" ? s = { type: "Cloud", value: K } : L === "gemini" ? s = { type: "Gemini", value: K } : s = F.auto();
      }
      t.value.setActiveModel(s);
    }
    async function S() {
      if (!(!m.value.trim() || !t.value.isAvailable)) {
        h.value = !0, g.value = null, c.value = "";
        try {
          const i = await t.value.chat({
            model: t.value.activeModel,
            system: "Antworte sehr kurz — maximal 2 Sätze.",
            messages: [{ role: "user", content: m.value.trim() }],
            max_tokens: 256,
            temperature: 0.5
          });
          i && (g.value = {
            content: i.content,
            provider: i.provider,
            modelUsed: i.modelUsed,
            usage: i.usage ? { totalTokens: i.usage.totalTokens } : null
          });
        } catch (i) {
          c.value = i.message ?? "Fehler beim Test";
        } finally {
          h.value = !1;
        }
      }
    }
    async function C() {
      await t.value.fetchStatus(), t.value.isLocalOnline && await t.value.fetchModels();
    }
    const k = v(!1), d = v({
      lmStudioUrl: null,
      anthropicApiKey: null,
      geminiApiKey: null,
      defaultLocalModel: null,
      defaultCloudModel: null,
      defaultGeminiModel: null
    });
    J(
      () => t.value.config,
      (i) => {
        i && (d.value = {
          lmStudioUrl: i.lmStudioUrl,
          anthropicApiKey: i.anthropicApiKey,
          geminiApiKey: i.geminiApiKey,
          defaultLocalModel: i.defaultLocalModel,
          defaultCloudModel: i.defaultCloudModel,
          defaultGeminiModel: i.defaultGeminiModel
        });
      },
      { immediate: !0 }
    );
    async function w() {
      const i = {
        lmStudioUrl: d.value.lmStudioUrl?.trim() || null,
        anthropicApiKey: d.value.anthropicApiKey?.trim() || null,
        geminiApiKey: d.value.geminiApiKey?.trim() || null,
        defaultLocalModel: d.value.defaultLocalModel?.trim() || null,
        defaultCloudModel: d.value.defaultCloudModel?.trim() || null,
        defaultGeminiModel: d.value.defaultGeminiModel?.trim() || null
      };
      await t.value.saveConfig(i) && (k.value = !0, setTimeout(() => k.value = !1, 3e3));
    }
    return X(async () => {
      await t.value.initialize();
    }), (i, a) => (u(), r("div", le, [
      a[43] || (a[43] = e("div", { class: "agui-settings-header" }, [
        e("h1", null, "🤖 AI Gateway"),
        e("p", { class: "agui-header-subtitle" }, " KI-Provider konfigurieren für Prompt-Optimierung und Asset-Generierung ")
      ], -1)),
      e("div", ie, [
        e("div", se, [
          e("div", oe, [
            e("div", ne, [
              a[8] || (a[8] = e("h2", null, "Provider Status", -1)),
              e("button", {
                class: "agui-btn-icon",
                disabled: t.value.isLoadingStatus,
                title: "Status aktualisieren",
                onClick: C
              }, [
                e("span", {
                  class: b({ "agui-spinning": t.value.isLoadingStatus })
                }, "🔄", 2)
              ], 8, ue)
            ]),
            t.value.isLoadingStatus ? (u(), r("div", re, [...a[9] || (a[9] = [
              e("span", { class: "agui-spinner" }, null, -1),
              T(" Lade Status… ", -1)
            ])])) : (u(), r("div", de, [
              e("div", {
                class: b(["agui-provider-row", { online: t.value.isAvailable }])
              }, [
                a[10] || (a[10] = e("span", { class: "agui-provider-dot" }, null, -1)),
                a[11] || (a[11] = e("span", { class: "agui-provider-name" }, "AI Gateway", -1)),
                e("span", ve, p(t.value.isAvailable ? t.value.providerCount + " Provider aktiv" : "Nicht konfiguriert"), 1)
              ], 2),
              e("div", {
                class: b(["agui-provider-row", { online: t.value.isLocalOnline }])
              }, [
                a[12] || (a[12] = e("span", { class: "agui-provider-dot" }, null, -1)),
                a[13] || (a[13] = e("span", { class: "agui-provider-name" }, "🖥 LM Studio", -1)),
                e("span", ce, p(t.value.isLocalOnline ? "Online (" + t.value.loadedModels.length + " Modell)" : "Offline"), 1)
              ], 2),
              e("div", {
                class: b(["agui-provider-row", { online: t.value.isAnthropicConfigured }])
              }, [
                a[14] || (a[14] = e("span", { class: "agui-provider-dot" }, null, -1)),
                a[15] || (a[15] = e("span", { class: "agui-provider-name" }, "☁ Anthropic", -1)),
                e("span", pe, p(t.value.isAnthropicConfigured ? "Konfiguriert" : "Kein API Key"), 1)
              ], 2),
              e("div", {
                class: b(["agui-provider-row", { online: t.value.isGeminiConfigured }])
              }, [
                a[16] || (a[16] = e("span", { class: "agui-provider-dot" }, null, -1)),
                a[17] || (a[17] = e("span", { class: "agui-provider-name" }, "✦ Gemini", -1)),
                e("span", ge, p(t.value.isGeminiConfigured ? "Konfiguriert" : "Kein API Key"), 1)
              ], 2)
            ]))
          ]),
          e("div", fe, [
            a[22] || (a[22] = e("div", { class: "agui-card-header" }, [
              e("h2", null, "Quick-Test"),
              e("span", { class: "agui-card-hint" }, "Verbindung prüfen")
            ], -1)),
            e("div", me, [
              a[21] || (a[21] = e("label", { class: "agui-model-label" }, "Modell", -1)),
              e("select", {
                class: "agui-model-select",
                value: P.value,
                disabled: h.value,
                onChange: M
              }, [
                a[20] || (a[20] = e("option", { value: "auto" }, "⚡ Auto (Lokal → Claude → Gemini)", -1)),
                t.value.isLocalOnline ? (u(), r("optgroup", he, [
                  (u(!0), r(O, null, z(t.value.localModels, (s) => (u(), r("option", {
                    key: s.id,
                    value: `local:${s.id}`
                  }, p(s.id), 9, ke))), 128)),
                  !t.value.localModels.length && t.value.config?.defaultLocalModel ? (u(), r("option", {
                    key: 0,
                    value: `local:${t.value.config.defaultLocalModel}`
                  }, p(t.value.config.defaultLocalModel), 9, be)) : f("", !0)
                ])) : f("", !0),
                t.value.isAnthropicConfigured ? (u(), r("optgroup", Ae, [...a[18] || (a[18] = [
                  e("option", { value: "cloud:haiku" }, "Haiku — schnell & günstig", -1),
                  e("option", { value: "cloud:sonnet" }, "Sonnet — ausgewogen", -1),
                  e("option", { value: "cloud:opus" }, "Opus — leistungsstark", -1)
                ])])) : f("", !0),
                t.value.isGeminiConfigured ? (u(), r("optgroup", Me, [...a[19] || (a[19] = [
                  e("option", { value: "gemini:flash" }, "Flash — schnell, Free Tier", -1),
                  e("option", { value: "gemini:flash_lite" }, "Flash Lite — ultra-schnell", -1),
                  e("option", { value: "gemini:pro" }, "Pro — leistungsstark", -1)
                ])])) : f("", !0)
              ], 40, ye),
              e("span", {
                class: b(["agui-model-badge", `agui-qm-${t.value.activeModel.type.toLowerCase()}`])
              }, p(t.value.activeModelLabel), 3)
            ]),
            a[23] || (a[23] = e("p", { class: "agui-quick-test-desc" }, " Schicke eine kurze Nachricht um zu prüfen ob der konfigurierte Provider antwortet. ", -1)),
            e("div", Se, [
              (u(), r(O, null, z(G, (s) => e("button", {
                key: s,
                type: "button",
                class: b(["agui-preset-chip", { active: m.value === s }]),
                onClick: (L) => m.value = s
              }, p(s), 11, Ce)), 64))
            ]),
            e("div", we, [
              A(e("input", {
                "onUpdate:modelValue": a[0] || (a[0] = (s) => m.value = s),
                type: "text",
                placeholder: "Eigene Nachricht…",
                class: "agui-quick-input",
                disabled: h.value || !t.value.isAvailable,
                onKeyup: Z(S, ["enter"])
              }, null, 40, Le), [
                [I, m.value]
              ]),
              e("button", {
                class: "agui-btn-send",
                disabled: h.value || !m.value.trim() || !t.value.isAvailable,
                onClick: S
              }, [
                h.value ? (u(), r("span", Ge)) : (u(), r("span", Ke, "▶"))
              ], 8, _e)
            ]),
            !t.value.isAvailable && !t.value.isLoadingStatus ? (u(), r("div", Ie, " Kein Provider konfiguriert — trage unten einen API Key ein. ")) : f("", !0),
            g.value ? (u(), r("div", Fe, [
              e("div", Pe, [
                e("span", Te, p(g.value.provider), 1),
                e("span", $e, p(g.value.modelUsed), 1),
                g.value.usage?.totalTokens ? (u(), r("span", Ee, p(g.value.usage.totalTokens) + " Tokens ", 1)) : f("", !0)
              ]),
              e("p", Ue, p(g.value.content), 1)
            ])) : f("", !0),
            c.value ? (u(), r("div", Oe, p(c.value), 1)) : f("", !0)
          ])
        ]),
        e("div", ze, [
          e("div", qe, [
            a[24] || (a[24] = e("h2", null, "⚙️ Konfiguration", -1)),
            t.value.configSupported === !1 ? (u(), r("span", Ve, "Env-Vars only")) : f("", !0)
          ]),
          t.value.configSupported === !1 ? (u(), r("div", xe, [...a[25] || (a[25] = [
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
          ])])) : (u(), r("form", {
            key: 1,
            class: "agui-config-form",
            onSubmit: ee(w, ["prevent"])
          }, [
            e("div", Ne, [
              e("div", De, [
                a[28] || (a[28] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-local" }, "🖥 Lokal"),
                  e("strong", null, "LM Studio"),
                  e("span", { class: "agui-provider-note" }, "Kostenlos · lokal")
                ], -1)),
                e("div", Re, [
                  a[26] || (a[26] = e("label", null, "Server-URL", -1)),
                  A(e("input", {
                    "onUpdate:modelValue": a[1] || (a[1] = (s) => d.value.lmStudioUrl = s),
                    type: "url",
                    placeholder: "http://192.168.1.121:1234",
                    class: "agui-field-input",
                    autocomplete: "off"
                  }, null, 512), [
                    [I, d.value.lmStudioUrl]
                  ]),
                  a[27] || (a[27] = e("span", { class: "agui-field-note" }, "IP + Port deines LM Studio Servers", -1))
                ])
              ]),
              e("div", He, [
                a[33] || (a[33] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-cloud" }, "☁ Cloud"),
                  e("strong", null, "Anthropic Claude"),
                  e("span", { class: "agui-provider-note" }, "Haiku / Sonnet / Opus")
                ], -1)),
                e("div", Be, [
                  a[29] || (a[29] = e("label", null, "API Key", -1)),
                  A(e("input", {
                    "onUpdate:modelValue": a[2] || (a[2] = (s) => d.value.anthropicApiKey = s),
                    type: "password",
                    placeholder: "sk-ant-…",
                    class: "agui-field-input",
                    autocomplete: "new-password"
                  }, null, 512), [
                    [I, d.value.anthropicApiKey]
                  ]),
                  a[30] || (a[30] = e("span", { class: "agui-field-note" }, [
                    e("a", {
                      href: "https://console.anthropic.com/",
                      target: "_blank",
                      rel: "noopener"
                    }, "console.anthropic.com")
                  ], -1))
                ]),
                e("div", Qe, [
                  a[32] || (a[32] = e("label", null, "Standard-Modell", -1)),
                  A(e("select", {
                    "onUpdate:modelValue": a[3] || (a[3] = (s) => d.value.defaultCloudModel = s),
                    class: "agui-field-select"
                  }, [...a[31] || (a[31] = [
                    e("option", { value: "" }, "Standard (sonnet)", -1),
                    e("option", { value: "haiku" }, "Haiku — schnell & günstig", -1),
                    e("option", { value: "sonnet" }, "Sonnet — ausgewogen", -1),
                    e("option", { value: "opus" }, "Opus — leistungsstark", -1)
                  ])], 512), [
                    [q, d.value.defaultCloudModel]
                  ])
                ])
              ]),
              e("div", Ye, [
                a[38] || (a[38] = e("div", { class: "agui-provider-block-header" }, [
                  e("span", { class: "agui-badge agui-gemini" }, "✦ Free"),
                  e("strong", null, "Google Gemini"),
                  e("span", { class: "agui-provider-note" }, "Free Tier verfügbar")
                ], -1)),
                e("div", We, [
                  a[34] || (a[34] = e("label", null, "API Key", -1)),
                  A(e("input", {
                    "onUpdate:modelValue": a[4] || (a[4] = (s) => d.value.geminiApiKey = s),
                    type: "password",
                    placeholder: "AIza…",
                    class: "agui-field-input",
                    autocomplete: "new-password"
                  }, null, 512), [
                    [I, d.value.geminiApiKey]
                  ]),
                  a[35] || (a[35] = e("span", { class: "agui-field-note" }, [
                    e("a", {
                      href: "https://aistudio.google.com/apikey",
                      target: "_blank",
                      rel: "noopener"
                    }, "aistudio.google.com/apikey"),
                    T(" — kostenloser Free Tier ")
                  ], -1))
                ]),
                e("div", je, [
                  a[37] || (a[37] = e("label", null, "Standard-Modell", -1)),
                  A(e("select", {
                    "onUpdate:modelValue": a[5] || (a[5] = (s) => d.value.defaultGeminiModel = s),
                    class: "agui-field-select"
                  }, [...a[36] || (a[36] = [
                    e("option", { value: "" }, "Standard (flash)", -1),
                    e("option", { value: "flash" }, "Flash — schnell, Free Tier", -1),
                    e("option", { value: "flash_lite" }, "Flash Lite — ultra-schnell", -1),
                    e("option", { value: "pro" }, "Pro — leistungsstark", -1)
                  ])], 512), [
                    [q, d.value.defaultGeminiModel]
                  ])
                ])
              ])
            ]),
            e("details", Je, [
              a[41] || (a[41] = e("summary", null, "Erweitert", -1)),
              e("div", Xe, [
                a[39] || (a[39] = e("label", null, "Standard lokales Modell", -1)),
                A(e("input", {
                  "onUpdate:modelValue": a[6] || (a[6] = (s) => d.value.defaultLocalModel = s),
                  type: "text",
                  placeholder: "z.B. mistral-7b-instruct",
                  class: "agui-field-input"
                }, null, 512), [
                  [I, d.value.defaultLocalModel]
                ]),
                a[40] || (a[40] = e("span", { class: "agui-field-note" }, "Modellname wie in LM Studio angezeigt (optional)", -1))
              ])
            ]),
            e("div", Ze, [
              e("button", {
                type: "submit",
                class: "agui-btn-save",
                disabled: t.value.isSavingConfig
              }, [
                t.value.isSavingConfig ? (u(), r("span", aa, [...a[42] || (a[42] = [
                  e("span", { class: "agui-spinner-sm" }, null, -1),
                  T(" Speichern… ", -1)
                ])])) : (u(), r("span", ta, "💾 Speichern"))
              ], 8, ea),
              k.value ? (u(), r("span", la, "✓ Gespeichert & aktiv")) : f("", !0),
              t.value.error ? (u(), r("span", ia, [
                T(p(t.value.error) + " ", 1),
                e("button", {
                  type: "button",
                  class: "agui-btn-clear-err",
                  onClick: a[7] || (a[7] = (s) => t.value.clearError())
                }, "✕")
              ])) : f("", !0)
            ])
          ], 32))
        ]),
        i.$slots.footer ? (u(), r("div", sa, [
          ae(i.$slots, "footer")
        ])) : f("", !0)
      ])
    ]));
  }
});
class oa {
  constructor(l, t = "/api/v1/ai") {
    this.http = l, this.base = t;
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
    const t = await this.http.put(
      `${this.base}/config`,
      l
    );
    if (t.data.success && t.data.data)
      return t.data.data;
    throw new Error(t.data.error || "Failed to save AI config");
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
    const t = await this.http.post(
      `${this.base}/chat`,
      l
    );
    if (t.data.success && t.data.data)
      return t.data.data;
    throw new Error(t.data.error || "AI chat request failed");
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
    const t = await this.http.post(`${this.base}/models/load`, { model: l });
    if (!t.data.success)
      throw new Error(t.data.error || "Failed to load model");
  }
}
const V = "agui_active_model";
function na(o) {
  return o.type === "Auto" ? "auto" : o.type === "Local" ? `local:${o.value}` : o.type === "Cloud" ? `cloud:${o.value}` : o.type === "Gemini" ? `gemini:${o.value}` : "auto";
}
function ua(o) {
  if (!o || o === "auto") return F.auto();
  const [l, t] = o.split(":");
  return l === "local" && t ? F.local(t) : l === "cloud" && t ? { type: "Cloud", value: t } : l === "gemini" && t ? { type: "Gemini", value: t } : F.auto();
}
function ra(o) {
  return o.type === "Auto" ? "Auto" : o.type === "Local" ? `Local: ${o.value}` : o.type === "Cloud" ? `Claude ${{ haiku: "Haiku", sonnet: "Sonnet", opus: "Opus" }[o.value] ?? o.value}` : o.type === "Gemini" ? { flash: "Gemini Flash", pro: "Gemini Pro", flash_lite: "Gemini Flash Lite" }[o.value] ?? `Gemini ${o.value}` : "Auto";
}
function pa(o) {
  const l = new oa(o.httpClient, o.basePath);
  return te("agui-ai-settings", () => {
    const t = v(null), G = v([]), m = v(!1), h = v(!1), g = v(!1), c = v(null), P = v(null), M = v(
      ua(localStorage.getItem(V) ?? "auto")
    ), S = v(!1), C = v(null), k = v(!1), d = v(!1), w = v(null), i = y(() => t.value?.available ?? !1), a = y(() => t.value?.lmStudioOnline ?? !1), s = y(() => t.value?.anthropicConfigured ?? !1), L = y(() => t.value?.geminiConfigured ?? !1), K = y(() => t.value?.loadedModels ?? []), x = y(() => C.value?.isConfigured ?? !1), N = y(() => ra(M.value)), D = y(() => {
      const n = M.value;
      return n.type === "Auto" ? "Auto" : n.type === "Local" ? "Local" : n.type === "Cloud" ? "Claude" : n.type === "Gemini" ? "Gemini" : "Auto";
    }), R = y(() => {
      let n = 0;
      return t.value?.lmStudioOnline && n++, t.value?.anthropicConfigured && n++, t.value?.geminiConfigured && n++, n;
    });
    function H() {
      c.value = null;
    }
    function B(n) {
      M.value = n;
      try {
        localStorage.setItem(V, na(n));
      } catch {
      }
    }
    async function E() {
      k.value = !0, c.value = null;
      try {
        C.value = await l.getConfig(), w.value = !0;
      } catch (n) {
        n?.response?.status === 501 ? w.value = !1 : c.value = n.message || "Failed to load AI configuration";
      } finally {
        k.value = !1;
      }
    }
    async function Q(n) {
      d.value = !0, c.value = null;
      try {
        return C.value = await l.saveConfig(n), w.value = !0, await $(), !0;
      } catch (_) {
        return c.value = _.message || "Failed to save AI configuration", !1;
      } finally {
        d.value = !1;
      }
    }
    async function $() {
      m.value = !0, c.value = null;
      try {
        t.value = await l.getStatus(), S.value = !0;
      } catch (n) {
        c.value = n.message || "Failed to fetch AI status";
      } finally {
        m.value = !1;
      }
    }
    async function U() {
      h.value = !0, c.value = null;
      try {
        const n = await l.getModels();
        G.value = n.models;
      } catch (n) {
        c.value = n.message || "Failed to fetch models", G.value = [];
      } finally {
        h.value = !1;
      }
    }
    async function Y(n) {
      g.value = !0, c.value = null;
      try {
        const _ = await l.chat(n);
        return P.value = _, _;
      } catch (_) {
        return c.value = _.message || "AI chat request failed", null;
      } finally {
        g.value = !1;
      }
    }
    async function W() {
      S.value || (await E(), await $(), t.value?.lmStudioOnline && await U());
    }
    return {
      // State
      status: t,
      localModels: G,
      isLoadingStatus: m,
      isLoadingModels: h,
      isProcessing: g,
      error: c,
      lastResponse: P,
      activeModel: M,
      initialized: S,
      config: C,
      isLoadingConfig: k,
      isSavingConfig: d,
      configSupported: w,
      // Computed
      isAvailable: i,
      isLocalOnline: a,
      isAnthropicConfigured: s,
      isGeminiConfigured: L,
      loadedModels: K,
      providerCount: R,
      isConfigured: x,
      activeModelLabel: N,
      activeModelProviderTag: D,
      // Actions
      clearError: H,
      setActiveModel: B,
      loadConfig: E,
      saveConfig: Q,
      fetchStatus: $,
      fetchModels: U,
      chat: Y,
      initialize: W
    };
  });
}
export {
  ca as AiSettingsPanel,
  pa as createAiSettingsStore
};
