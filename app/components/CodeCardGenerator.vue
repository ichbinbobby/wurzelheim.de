<template>
  <v-container>
    <CodeCardGeneratorForm
      :state="state"
      :items="items"
      :codes-count="codes.length"
      :pages-count="pages.length"
      @clear-bg-image="clearBgImage"
      @bg-image-change="onBgImageChange"
      @file-change="onFileChange"
      @print="print"
    />

    <CodeCardGeneratorPreview
      :pages="pages"
      :config="cardConfig"
      :qr-data-urls="qrDataUrls"
      :front-card-style="frontCardStyle"
      :back-card-style="backCardStyle"
      :backside-grid-style="backsideGridStyle"
      :paper-size="state.paperSize"
    />
  </v-container>
</template>

<script setup lang="ts">
const {
  state,
  items,
  codes,
  pages,
  qrDataUrls,
  frontCardStyle,
  backCardStyle,
  backsideGridStyle,
  cardConfig,
  clearBgImage,
  onBgImageChange,
  onFileChange,
  print
} = useCodeCardGenerator()

// @page's `size` isn't scopable by CSS class, so it's set via a reactive
// injected style tag instead, keeping it in sync with the paper size toggle.
useHead({
  style: [
    {
      innerHTML: computed(
        () => `@media print { @page { size: ${state.paperSize === 'letter' ? 'letter' : 'A4'}; margin: 5mm; } }`
      )
    }
  ]
})
</script>

<style>
@media print {
  :root {
    color-scheme: light !important;
  }

  .v-app-bar,
  .v-footer,
  .no-print {
    display: none !important;
  }

  body,
  .v-application,
  .v-main,
  .v-container {
    background: white !important;
    color: black !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: none !important;
  }
}
</style>
