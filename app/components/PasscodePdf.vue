<template>
  <v-container>
    <div class="no-print">
      <v-row>
        <v-col>
          <v-alert
            text="This tool will take your monthly digital codes and generate a PDF for you to print."
            type="info"
            variant="tonal"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="title"
            label="Title"
            variant="solo-filled"
            class="mb-3"
            hint="Name of your Campfire group"
            persistent-hint
          />

          <div class="d-flex align-center gap-3 mb-2">
            <v-btn-toggle
              v-model="separator"
              mandatory
              color="primary"
              density="compact"
              variant="outlined"
            >
              <v-btn value=",">Comma</v-btn>
              <v-btn value=" ">Space</v-btn>
            </v-btn-toggle>

            <p class="ml-4">Select your separator</p>
          </div>

          <v-textarea
            v-model="rawInput"
            label="Codes"
            variant="solo-filled"
            rows="3"
            hint="If you paste 120 codes it will create five pages with 3 columns and 8 rows"
            persistent-hint
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

        <v-col cols="12" md="6" class="d-flex align-center gap-2">
          <v-btn-toggle
            v-model="itemsDisplay"
            mandatory
            color="primary"
            density="compact"
            variant="outlined"
            class="mr-2"
          >
            <v-btn value="images">Images</v-btn>
            <v-btn value="text">Text</v-btn>
            <v-btn value="none">None</v-btn>
          </v-btn-toggle>
          <img v-for="item in items" :key="item" :src="item" class="preview-icon" />
        </v-col>
      </v-row>

      <v-switch
        v-model="printBacksides"
        class="mt-2 mb-1 ml-2"
        color="primary"
        density="compact"
        hide-details
        :label="`Print backsides ${printBacksides ? 'enabled' : 'disabled'}`"
      />

      <div class="d-flex align-center gap-3 mt-4">
        <v-btn
          prepend-icon="mdi-file-pdf-box"
          color="primary"
          :disabled="!codes.length"
          @click="print"
        >
          Save as PDF
        </v-btn>

        <div class="ml-4">
          Opens your printer dialog. To save as PDF select "Save as PDF".
          <span v-if="printBacksides">
            For double-sided printing, enable <strong>Two-sided</strong> and set flip to
            <strong>Long edge</strong>.</span
          >
        </div>
      </div>

      <br />
    </div>

    <template v-for="(page, pageIndex) in pages" :key="pageIndex">
      <div class="a4-preview">
        <div class="cards-grid">
          <div v-for="code in page" :key="code" class="business-card">
            <div class="card-title">{{ title }}</div>
            <div class="card-code">{{ code }}</div>
            <div v-show="itemsDisplay !== 'none'" class="card-items">
              <template v-if="itemsDisplay === 'images'">
                <img v-for="item in items" :key="item" :src="item" class="card-item-icon" />
              </template>
              <span v-else class="card-items-text">{{ itemsText }}</span>
            </div>
            <div class="card-expiry">Code will expire {{ expiryDate }}</div>
          </div>
        </div>
      </div>

      <div v-if="printBacksides" class="a4-preview backsides">
        <div class="cards-grid">
          <div
            v-for="code in backOrder(page)"
            :key="'back-' + code"
            class="business-card backside-card"
          >
            <img src="/ca_program.png" class="backside-img" />
          </div>
        </div>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
const itemsDisplay = ref<'images' | 'text' | 'none'>('images')
const itemsText = 'Raid Pass, Star Piece, Incubator and Incense'
const title = ref('Wurzelheim Alexanderplatz')
const rawInput = ref('')
const separator = ref(',')
const getExpiryDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() + 3)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const day = lastDay.getDate()
  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th'
  const month = lastDay.toLocaleString('en-US', { month: 'long' })
  const year = lastDay.getFullYear()
  return `${month} ${day}${suffix} ${year} at 12:00:00 AM UTC`
}
const expiryDate = ref(getExpiryDate())

const items = [
  '/item_paid_raid_ticket.png',
  '/item_star_piece.png',
  '/item_incubator_basic.png',
  '/item_incense_ordinary.png'
]

const printBacksides = ref(false)

const codes = computed(() =>
  rawInput.value
    .split(separator.value)
    .map((s) => s.trim())
    .filter(Boolean)
)

const pages = computed(() => {
  const result: string[][] = []
  for (let i = 0; i < codes.value.length; i += 24) {
    result.push(codes.value.slice(i, i + 24))
  }
  return result
})

// Reverse each row of 3 so backs align when printed double-sided (flip on long edge)
const backOrder = (page: string[]) => {
  const result: string[] = []
  for (let i = 0; i < page.length; i += 3) {
    result.push(...page.slice(i, i + 3).toReversed())
  }
  return result
}

const print = () => window.print()
</script>

<style>
@media print {
  @page {
    size: A4;
    margin: 5mm;
  }

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
  }

  .a4-preview {
    width: 100% !important;
    min-height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    page-break-after: always;
  }

  .a4-preview:last-child {
    page-break-after: auto;
  }

  .cards-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 0 !important;
    margin-top: 0 !important;
  }

  .business-card {
    width: 100% !important;
    height: 35mm !important;
    border-radius: 0 !important;
  }
}
</style>

<style scoped>
.a4-preview {
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
}

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

.card-title {
  font-size: 8pt;
  font-weight: bold;
}

.card-code {
  font-family: monospace;
  font-size: 11pt;
  letter-spacing: 1px;
}

.card-items {
  display: flex;
  flex-direction: row;
  gap: 2mm;
}

.preview-icon {
  height: 40px;
  width: 40px;
  object-fit: contain;
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

.backsides {
  margin-top: 16px;
}
</style>
