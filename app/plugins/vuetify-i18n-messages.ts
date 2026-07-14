import * as vuetifyLocales from 'vuetify/locale'

// vuetify-nuxt-module hands Vuetify's translations over to @nuxtjs/i18n entirely once it
// detects the module, so it no longer falls back to its own bundled strings (e.g.
// $vuetify.input.clear). Merge Vuetify's official translations in here instead of copying
// them into our locale files by hand, so adding a new app language doesn't also require
// pasting in Vuetify's strings for it.
interface NuxtI18n {
  locales: { value: (string | { code: string })[] }
  messages: { value: Record<string, Record<string, unknown> | undefined> }
  mergeLocaleMessage: (code: string, messages: Record<string, unknown>) => void
}

export default defineNuxtPlugin(nuxtApp => {
  const i18n = nuxtApp.$i18n as unknown as NuxtI18n

  for (const locale of i18n.locales.value) {
    const code = typeof locale === 'string' ? locale : locale.code
    if (i18n.messages.value[code]?.$vuetify) continue

    const vuetifyLocale = (vuetifyLocales as Record<string, unknown>)[code]
    if (vuetifyLocale) i18n.mergeLocaleMessage(code, { $vuetify: vuetifyLocale })
  }
})
