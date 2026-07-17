<template>
  <div
    v-if="side === 'front'"
    class="business-card"
    :class="{ 'business-card--eco': config.layout === 'eco' }"
    :style="cardStyle"
  >
    <template v-if="config.layout === 'eco'">
      <div class="card-title" :style="{ color: config.titleColor }">{{ config.title }}</div>
      <div class="card-middle">
        <div class="card-content">
          <div
            class="card-code"
            :style="{
              color: config.codeFontColor || undefined,
              background: config.codeBackgroundColor || undefined
            }"
          >
            {{ code }}
          </div>
          <div v-show="config.itemsDisplay !== 'none'" class="card-items">
            <template v-if="config.itemsDisplay === 'images'">
              <img v-for="item in config.items" :key="item" :src="item" class="card-item-icon" />
            </template>
            <span v-else class="card-items-text">{{ config.itemsText }}</span>
          </div>
        </div>
        <img v-if="qrDataUrl" :src="qrDataUrl" class="card-qr" />
      </div>
      <div class="card-expiry" :style="{ color: config.expiryColor }">{{ config.expiryDate }}</div>
    </template>
    <template v-else>
      <div class="card-title" :style="{ color: config.titleColor }">{{ config.title }}</div>
      <div
        class="card-code"
        :style="{
          color: config.codeFontColor || undefined,
          background: config.codeBackgroundColor || undefined
        }"
      >
        {{ code }}
      </div>
      <div v-show="config.itemsDisplay !== 'none'" class="card-items">
        <template v-if="config.itemsDisplay === 'images'">
          <img v-for="item in config.items" :key="item" :src="item" class="card-item-icon" />
        </template>
        <span v-else class="card-items-text">{{ config.itemsText }}</span>
      </div>
      <div class="card-expiry" :style="{ color: config.expiryColor }">
        {{ t('ccg.code_expires', { date: config.expiryDate }) }}
      </div>
    </template>
  </div>

  <div v-else class="business-card backside-card" :style="code ? cardStyle : placeholderStyle">
    <template v-if="code">
      <img v-if="config.backsideType === 'logo'" src="/ca_program.png" class="backside-img" />
      <img
        v-else-if="config.backsideType === 'qr' && qrDataUrl"
        :src="qrDataUrl"
        class="backside-qr"
      />
      <img
        v-else-if="config.backsideType === 'custom' && config.customBacksideUrl"
        :src="config.customBacksideUrl"
        class="backside-img"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { CodeCardConfig } from '@/composables/useCodeCardGenerator'

defineProps<{
  side: 'front' | 'back'
  code: string | null
  config: CodeCardConfig
  qrDataUrl?: string
  cardStyle?: CSSProperties
}>()

const placeholderStyle: CSSProperties = { border: 'none', background: 'transparent' }

const { t } = useI18n()
</script>

<style>
@media print {
  .business-card {
    width: 100% !important;
    height: 31mm !important;
    border-radius: 0 !important;
  }

  /* A4 (297mm) is ~17.6mm taller than US Letter (279.4mm), so 8 rows/page can be a bit taller */
  .paper-a4 .business-card {
    height: 33mm !important;
  }
}
</style>

<style scoped>
.business-card {
  width: 62mm;
  height: 33mm;
  border: 1px solid #999;
  border-radius: 0;
  padding: 2mm 3mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: white;
  color: black;
  page-break-inside: avoid;
  text-align: center;
}

/* Eco layout: text left, QR right */
.business-card--eco {
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  align-items: flex-start;
}

.business-card--eco .card-title,
.business-card--eco .card-expiry,
.business-card--eco .card-items {
  padding-left: 2mm;
}

.card-middle {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 2mm;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2mm;
  min-width: 0;
}

.card-qr {
  width: 20mm;
  height: 20mm;
  object-fit: contain;
  align-self: center;
  flex-shrink: 0;
}

.business-card--eco .card-item-icon {
  height: 5mm;
  width: 5mm;
}

.card-title {
  font-size: 8pt;
  font-weight: bold;
}

.card-code {
  font-family: monospace;
  font-size: 10pt;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 25px;
  padding: 1mm 2mm;
}

.card-items {
  display: flex;
  flex-direction: row;
  gap: 2mm;
}

.card-item-icon {
  height: 8mm;
  width: 8mm;
  object-fit: contain;
}

.card-items-text {
  font-size: 6pt;
}

.card-expiry {
  font-size: 6pt;
  color: #444;
}

.backside-card {
  justify-content: center;
}

.backside-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.backside-qr {
  width: 29mm;
  height: 29mm;
  object-fit: contain;
}
</style>
