<template>
  <v-container>
    <div class="no-print">
      <v-row>
        <v-col>
          <v-alert :text="t('ccg.alert')" type="info" variant="tonal" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="9">
          <v-text-field
            v-model="title"
            :label="t('ccg.title_label')"
            variant="solo-filled"
            class="mb-3"
            clearable
            :hint="t('ccg.title_hint')"
            persistent-hint
          />
        </v-col>

        <v-col cols="3">
          <v-text-field
            v-model="titleColor"
            clearable
            :label="t('ccg.title_color_label')"
            variant="solo-filled"
            :hint="t('ccg.hex_color_hint')"
            persistent-hint
          />
        </v-col>

        <v-col cols="12">
          <v-row align="end" class="mb-2">
            <v-col cols="auto">
              <div>
                <v-btn-toggle
                  v-model="separator"
                  mandatory
                  color="primary"
                  density="compact"
                  variant="outlined"
                >
                  <v-btn value=",">{{ t('ccg.separator_comma') }}</v-btn>
                  <v-btn value=" ">{{ t('ccg.separator_space') }}</v-btn>
                </v-btn-toggle>
                <p class="text-label-medium text-medium-emphasis mt-2 ml-4">
                  {{ t('ccg.separator_hint') }}
                </p>
              </div>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="codeFontColor"
                clearable
                :label="t('ccg.code_font_color_label')"
                variant="solo-filled"
                :hint="t('ccg.hex_color_hint')"
                persistent-hint
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="codeBackgroundColor"
                clearable
                :label="t('ccg.code_background_label')"
                variant="solo-filled"
                :hint="t('ccg.hex_color_hint')"
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="rawInput"
            :label="
              codes.length ? `${t('ccg.codes_label')} (${codes.length})` : t('ccg.codes_label')
            "
            variant="solo-filled"
            rows="3"
            :hint="
              codes.length
                ? t('ccg.codes_hint_base') +
                  ' ' +
                  t('ccg.codes_hint_count', { count: codes.length, pages: pages.length })
                : t('ccg.codes_hint_base')
            "
            persistent-hint
            auto-grow
          />
        </v-col>

        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="expiryDate"
              clearable
              :label="t('ccg.expiry_date_label')"
              variant="solo-filled"
            />
          </v-col>

          <v-col cols="2">
            <v-text-field
              v-model="expiryColor"
              clearable
              :label="t('ccg.expiry_color_label')"
              variant="solo-filled"
              :hint="t('ccg.hex_color_short_hint')"
              persistent-hint
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="cardBackgroundColor"
              :label="t('ccg.card_background_label')"
              variant="solo-filled"
              :hint="t('ccg.card_background_hint')"
              persistent-hint
            >
              <template #append>
                <v-btn-toggle
                  v-if="cardBackgroundColor || cardBgImageUrl"
                  v-model="bgApplyTo"
                  multiple
                  mandatory
                  color="primary"
                  variant="outlined"
                >
                  <v-btn value="front">{{ t('ccg.front') }}</v-btn>
                  <v-btn value="back">{{ t('ccg.back') }}</v-btn>
                </v-btn-toggle>
              </template>

              <template #append-inner>
                <v-tooltip
                  location="top"
                  :text="
                    cardBgImageUrl ? t('ccg.image_loaded_tooltip') : t('ccg.upload_image_tooltip')
                  "
                >
                  <template #activator="{ props }">
                    <v-icon
                      v-bind="props"
                      :color="cardBgImageUrl ? 'primary' : undefined"
                      style="cursor: pointer"
                      @click="bgImageInput?.click()"
                    >
                      {{ cardBgImageUrl ? 'mdi-image-check' : 'mdi-image-plus' }}
                    </v-icon>
                  </template>
                </v-tooltip>

                <v-tooltip
                  v-if="cardBgImageUrl"
                  location="top"
                  :text="t('ccg.remove_image_tooltip')"
                >
                  <template #activator="{ props }">
                    <v-icon v-bind="props" style="cursor: pointer" @click="clearBgImage">
                      mdi-close
                    </v-icon>
                  </template>
                </v-tooltip>
              </template>
            </v-text-field>
            <input
              ref="bgImageInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="onBgImageChange"
            />
          </v-col>
        </v-row>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-row align="start" class="ga-6 flex-wrap">
            <v-col cols="auto">
              <p class="text-label-medium text-medium-emphasis mb-2">{{ t('ccg.layout_label') }}</p>
              <v-btn-toggle
                v-model="cardLayout"
                mandatory
                color="primary"
                density="compact"
                variant="outlined"
              >
                <v-btn value="eco">Eco</v-btn>
                <v-btn value="fancy">Fancy</v-btn>
              </v-btn-toggle>
            </v-col>

            <v-col cols="auto">
              <p class="text-label-medium text-medium-emphasis mb-2">
                {{ t('ccg.backside_label') }}
              </p>
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center flex-wrap ga-2">
                  <v-btn-toggle
                    v-model="backsideType"
                    mandatory
                    color="primary"
                    density="compact"
                    variant="outlined"
                  >
                    <v-btn value="off">{{ t('ccg.no_backside') }}</v-btn>
                    <v-btn value="logo">CA Logo</v-btn>
                    <v-btn v-if="cardLayout === 'fancy'" value="qr">QR Code</v-btn>
                    <v-btn value="custom">{{ t('ccg.custom') }}</v-btn>
                  </v-btn-toggle>

                  <template v-if="backsideType === 'custom'">
                    <v-btn variant="tonal" prepend-icon="mdi-upload" @click="fileInput?.click()">
                      {{ customBacksideUrl ? t('ccg.change_image') : t('ccg.upload_custom_logo') }}
                    </v-btn>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      style="display: none"
                      @change="onFileChange"
                    />
                  </template>
                </div>

                <v-text-field
                  v-if="backsideType !== 'off'"
                  v-model.number="duplexOffsetX"
                  type="number"
                  step="0.5"
                  density="compact"
                  variant="solo-filled"
                  style="width: 220px"
                  :label="t('ccg.duplex_offset_label')"
                  hide-details
                />
              </div>
            </v-col>

            <v-col cols="auto">
              <p class="text-label-medium text-medium-emphasis mb-2">{{ t('ccg.items_label') }}</p>
              <div class="d-flex align-center ga-2">
                <v-btn-toggle
                  v-model="itemsDisplay"
                  mandatory
                  color="primary"
                  density="compact"
                  variant="outlined"
                >
                  <v-btn value="images">{{ t('ccg.images') }}</v-btn>
                  <v-btn value="text">{{ t('ccg.text') }}</v-btn>
                  <v-btn value="none">{{ t('ccg.none') }}</v-btn>
                </v-btn-toggle>
                <img v-for="item in items" :key="item" :src="item" class="preview-icon" />
              </div>
            </v-col>
          </v-row>

          <v-alert
            v-if="backsideType !== 'off'"
            :text="t('ccg.duplex_offset_alert')"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4"
          />
        </v-col>
      </v-row>

      <div class="d-flex align-center gap-3 mt-4">
        <v-btn
          prepend-icon="mdi-file-pdf-box"
          color="primary"
          :disabled="!codes.length"
          @click="print"
        >
          {{ t('ccg.save_as_pdf') }}
        </v-btn>

        <div class="ml-4">
          {{ t('ccg.print_hint') }}
          <span v-if="backsideType !== 'off'">
            <i18n-t keypath="ccg.double_sided_hint" tag="span">
              <template #twosided><strong>Two-sided</strong></template>
              <template #longedge><strong>Long edge</strong></template>
            </i18n-t>
          </span>
        </div>
      </div>

      <br />
    </div>

    <template v-for="(page, pageIndex) in pages" :key="pageIndex">
      <div class="a4-preview">
        <div class="cards-grid">
          <div
            v-for="code in page"
            :key="code"
            class="business-card"
            :class="{ 'business-card--eco': cardLayout === 'eco' }"
            :style="frontCardStyle"
          >
            <template v-if="cardLayout === 'eco'">
              <div class="card-title" :style="{ color: titleColor }">{{ title }}</div>
              <div class="card-middle">
                <div class="card-content">
                  <div
                    class="card-code"
                    :style="{
                      color: codeFontColor || undefined,
                      background: codeBackgroundColor || undefined
                    }"
                  >
                    {{ code }}
                  </div>
                  <div v-show="itemsDisplay !== 'none'" class="card-items">
                    <template v-if="itemsDisplay === 'images'">
                      <img v-for="item in items" :key="item" :src="item" class="card-item-icon" />
                    </template>
                    <span v-else class="card-items-text">{{ itemsText }}</span>
                  </div>
                </div>
                <img v-if="qrDataUrls[code]" :src="qrDataUrls[code]" class="card-qr" />
              </div>
              <div class="card-expiry" :style="{ color: expiryColor }">{{ expiryDate }}</div>
            </template>
            <template v-else>
              <div class="card-title" :style="{ color: titleColor }">{{ title }}</div>
              <div
                class="card-code"
                :style="{
                  color: codeFontColor || undefined,
                  background: codeBackgroundColor || undefined
                }"
              >
                {{ code }}
              </div>
              <div v-show="itemsDisplay !== 'none'" class="card-items">
                <template v-if="itemsDisplay === 'images'">
                  <img v-for="item in items" :key="item" :src="item" class="card-item-icon" />
                </template>
                <span v-else class="card-items-text">{{ itemsText }}</span>
              </div>
              <div class="card-expiry" :style="{ color: expiryColor }">
                {{ t('ccg.code_expires', { date: expiryDate }) }}
              </div>
            </template>
          </div>
        </div>
        <div v-if="backsideType !== 'off'" class="corner-marker corner-marker--right">
          flip &#8594;
        </div>
      </div>

      <div v-if="backsideType !== 'off'" class="a4-preview backsides">
        <div class="cards-grid" :style="backsideGridStyle">
          <div
            v-for="(code, i) in backOrder(page)"
            :key="'back-' + pageIndex + '-' + i"
            class="business-card backside-card"
            :style="code ? backCardStyle : { border: 'none', background: 'transparent' }"
          >
            <template v-if="code">
              <img v-if="backsideType === 'logo'" src="/ca_program.png" class="backside-img" />
              <img
                v-else-if="backsideType === 'qr' && qrDataUrls[code]"
                :src="qrDataUrls[code]"
                class="backside-qr"
              />
              <img
                v-else-if="backsideType === 'custom' && customBacksideUrl"
                :src="customBacksideUrl"
                class="backside-img"
              />
            </template>
          </div>
        </div>
        <div class="corner-marker corner-marker--left">&#8592; flip</div>
      </div>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const { t } = useI18n()

const itemsDisplay = ref<'images' | 'text' | 'none'>('images')
const itemsText = 'Raid Pass, Star Piece, Incubator and Incense'
const title = ref('Wurzelheim Alexanderplatz')
const titleColor = ref('#000000')
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
const expiryColor = ref('#000000')
const codeFontColor = ref('#000000')
const codeBackgroundColor = ref('#ffffff')
const cardBackgroundColor = ref('')
const cardBgImageUrl = ref<string | null>(null)
const bgApplyTo = ref<string[]>(['front', 'back'])
const bgImageInput = ref<HTMLInputElement | null>(null)

const resizeImageToDataUrl = (file: File, width: number, height: number): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = objectUrl
  })

const clearBgImage = () => {
  cardBgImageUrl.value = null
  cardBackgroundColor.value = ''
}

const onBgImageChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  cardBackgroundColor.value = file.name
  cardBgImageUrl.value = await resizeImageToDataUrl(file, 744, 396)
}

const cardBackgroundStyle = computed(() => ({
  backgroundColor: cardBackgroundColor.value || 'transparent',
  ...(cardBgImageUrl.value && {
    backgroundImage: `url(${cardBgImageUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  })
}))

const frontCardStyle = computed(() =>
  bgApplyTo.value.includes('front') ? cardBackgroundStyle.value : {}
)
const backCardStyle = computed(() =>
  bgApplyTo.value.includes('back') ? cardBackgroundStyle.value : {}
)

const items = [
  '/item_paid_raid_ticket.png',
  '/item_star_piece.png',
  '/item_incubator_basic.png',
  '/item_incense_ordinary.png'
]

const cardLayout = ref<'eco' | 'fancy'>('eco')
const backsideType = ref<'off' | 'logo' | 'qr' | 'custom'>('off')
const customBacksideUrl = ref<string | null>(null)
const duplexOffsetX = ref(-3) // in mm, negative shifts left, positive shifts right
const backsideGridStyle = computed(() =>
  duplexOffsetX.value ? { transform: `translateX(${duplexOffsetX.value}mm)` } : {}
)
const fileInput = ref<HTMLInputElement | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    customBacksideUrl.value = ev.target?.result as string
  }
  reader.readAsDataURL(file)
}

watch(cardLayout, (val) => {
  if (val === 'eco' && backsideType.value === 'qr') {
    backsideType.value = 'off'
  }
})

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
const backOrder = (page: string[]): (string | null)[] => {
  const result: (string | null)[] = []
  for (let i = 0; i < page.length; i += 3) {
    const row: (string | null)[] = page.slice(i, i + 3)
    while (row.length < 3) row.push(null)
    result.push(...row.toReversed())
  }
  return result
}

const qrDataUrls = ref<Record<string, string>>({})

watch(
  codes,
  async (newCodes) => {
    const entries = await Promise.all(
      newCodes.map(async (code) => {
        const url = await QRCode.toDataURL(
          `https://store.pokemongo.com/offer-redemption?passcode=${code}`,
          { margin: 1, width: 200 }
        )
        return [code, url] as const
      })
    )
    qrDataUrls.value = Object.fromEntries(entries)
  },
  { immediate: true }
)

const print = () => {
  ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'generate_pdf', {
    card_layout: cardLayout.value,
    backside_type: backsideType.value,
    code_count: codes.value.length,
    page_count: pages.value.length,
    title: title.value,
    expiry_date: expiryDate.value
  })
  window.print()
}
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
    margin: 0 !important;
    max-width: none !important;
  }

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
   * Many browsers/printers ignore the @page margin above once the print
   * dialog's "Margins" is left at "Default" (which is commonly ~12-13mm,
   * not the 5mm assumed here). Row height is also tuned for US Letter
   * (279.4mm tall), which is ~17.6mm shorter than A4 (297mm) — that's the
   * binding constraint for 8 rows, not page width, on either paper size.
   */
  .cards-grid {
    grid-template-columns: repeat(3, 60mm) !important;
    gap: 0 !important;
    width: 180mm !important;
    margin: 0 auto !important;
    justify-content: unset !important;
  }

  .business-card {
    width: 100% !important;
    height: 31mm !important;
    border-radius: 0 !important;
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

.backside-qr {
  width: 29mm;
  height: 29mm;
  object-fit: contain;
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
