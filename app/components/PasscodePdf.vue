<template>
  <v-container>
    <div class="no-print">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title"
            label="Title"
            variant="solo-filled"
            hide-details
            class="mb-3"
          />

          <v-textarea
            v-model="rawInput"
            label="Codes (comma separated)"
            variant="solo-filled"
            rows="3"
            hide-details
            auto-grow
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="expiryDate"
            label="Expiry date"
            variant="solo-filled"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="itemsText"
            label="Items"
            variant="solo-filled"
            hide-details
          />
        </v-col>
      </v-row>

      <v-btn
        class="mt-4"
        prepend-icon="mdi-file-pdf-box"
        color="primary"
        :disabled="!codes.length"
        @click="print"
      >
        Save as PDF
      </v-btn>
    </div>

    <div v-if="codes.length" class="cards-grid mt-6">
      <div v-for="code in codes" :key="code" class="business-card">
        <div class="card-title">{{ title }}</div>
        <div class="card-code">{{ code }}</div>
        <div class="card-items">{{ itemsText }}</div>
        <div class="card-expiry">Code will expire {{ expiryDate }}</div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  const title = ref('Wurzelheim Alexanderplatz')
  const rawInput = ref('')
  const expiryDate = ref('May 31st 2026 at 12:00:00 AM UTC')
  const itemsText = ref(
    'Contains 1 Premium Battle Pass, 1 Star Piece, 1 Egg Incubator, and 1 Incense'
  )

  const codes = computed(() =>
    rawInput.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )

  const print = () => window.print()
</script>

<style>
  @media print {
    .v-app-bar,
    .v-footer,
    .no-print {
      display: none !important;
    }

    .v-main {
      padding: 0 !important;
    }

    .v-container {
      padding: 0 !important;
    }
  }
</style>

<style scoped>
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 85mm);
    gap: 5mm;
  }

  .business-card {
    width: 85mm;
    height: 55mm;
    border: 1px solid #999;
    border-radius: 2mm;
    padding: 4mm 6mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    background: white;
    color: black;
    page-break-inside: avoid;
  }

  .card-title {
    font-size: 11pt;
    font-weight: bold;
  }

  .card-code {
    font-family: monospace;
    font-size: 14pt;
    letter-spacing: 1px;
    text-align: center;
  }

  .card-items {
    font-size: 7pt;
    color: #444;
  }

  .card-expiry {
    font-size: 7pt;
    color: #444;
  }
</style>
