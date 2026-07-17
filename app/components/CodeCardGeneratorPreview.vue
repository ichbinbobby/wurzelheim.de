<template>
  <div :class="{ 'paper-a4': paperSize === 'a4' }">
    <template v-for="(page, pageIndex) in pages" :key="pageIndex">
      <div class="a4-preview">
        <div class="cards-grid">
          <CodeCard
            v-for="code in page"
            :key="code"
            side="front"
            :code="code"
            :config="config"
            :qr-data-url="qrDataUrls[code]"
            :card-style="frontCardStyle"
          />
        </div>
        <div v-if="config.backsideType !== 'off'" class="corner-marker corner-marker--right">
          flip &#8594;
        </div>
      </div>

      <div v-if="config.backsideType !== 'off'" class="a4-preview backsides">
        <div class="cards-grid" :style="backsideGridStyle">
          <CodeCard
            v-for="(code, i) in backOrder(page)"
            :key="'back-' + pageIndex + '-' + i"
            side="back"
            :code="code"
            :config="config"
            :qr-data-url="code ? qrDataUrls[code] : undefined"
            :card-style="backCardStyle"
          />
        </div>
        <div class="corner-marker corner-marker--left">&#8592; flip</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { CodeCardConfig } from '@/composables/useCodeCardGenerator'
import { backOrder } from '@/composables/useCodeCardGenerator'

defineProps<{
  pages: string[][]
  config: CodeCardConfig
  qrDataUrls: Record<string, string>
  frontCardStyle: CSSProperties
  backCardStyle: CSSProperties
  backsideGridStyle: CSSProperties
  paperSize: 'a4' | 'letter'
}>()
</script>

<style>
@media print {
  .a4-preview {
    width: 100% !important;
    min-height: auto !important;
    padding: 0 !important;
    padding-bottom: 2mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    page-break-after: always;
  }

  .a4-preview:last-child {
    page-break-after: auto;
  }

  /*
   * Many browsers/printers ignore the @page margin set on the root
   * component once the print dialog's "Margins" is left at "Default"
   * (which is commonly ~12-13mm, not the 5mm assumed there). Column
   * width already fits safely on both A4 and US Letter; row height (see
   * the .paper-a4 override in CodeCard.vue) is the dimension that
   * actually differs — Letter is ~17.6mm shorter than A4 (279.4mm vs
   * 297mm), so only A4 can afford slightly taller rows for 8 rows/page.
   */
  .cards-grid {
    grid-template-columns: repeat(3, 60mm) !important;
    gap: 0 !important;
    width: 180mm !important;
    margin: 0 auto !important;
    justify-content: unset !important;
  }

  /*
   * .a4-preview shrinks to its content height in print (min-height: auto
   * above), so "bottom: 4mm" here would sit right under the last row of
   * cards instead of at the physical page edge — overlapping them. It's
   * only an on-screen orientation hint, so just hide it on paper.
   */
  .corner-marker {
    display: none !important;
  }
}
</style>

<style scoped>
.a4-preview {
  position: relative;
  width: 210mm;
  min-height: 297mm;
  padding: 5mm;
  margin: 16px auto;
  background: white;
  color: black;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 62mm);
  gap: 2mm;
  justify-content: center;
}

.backsides {
  margin-top: 16px;
}

.corner-marker {
  position: absolute;
  bottom: 4mm;
  font-size: 6pt;
  color: #bbb;
  letter-spacing: 0.5px;
}

.corner-marker--right {
  right: 4mm;
}

.corner-marker--left {
  left: 4mm;
}
</style>
