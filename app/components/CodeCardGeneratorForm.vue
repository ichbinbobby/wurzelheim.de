<template>
  <div class="no-print">
    <v-row>
      <v-col>
        <v-alert :text="t('ccg.alert')" type="info" variant="tonal" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="9">
        <v-text-field
          v-model="state.title"
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
          v-model="state.titleColor"
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
                v-model="state.separator"
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
              v-model="state.codeFontColor"
              clearable
              :label="t('ccg.code_font_color_label')"
              variant="solo-filled"
              :hint="t('ccg.hex_color_hint')"
              persistent-hint
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model="state.codeBackgroundColor"
              clearable
              :label="t('ccg.code_background_label')"
              variant="solo-filled"
              :hint="t('ccg.hex_color_hint')"
              persistent-hint
            />
          </v-col>
        </v-row>

        <v-textarea
          v-model="state.rawInput"
          :label="codesCount ? `${t('ccg.codes_label')} (${codesCount})` : t('ccg.codes_label')"
          variant="solo-filled"
          rows="3"
          :hint="
            codesCount
              ? t('ccg.codes_hint_base') +
                ' ' +
                t('ccg.codes_hint_count', { count: codesCount, pages: pagesCount })
              : t('ccg.codes_hint_base')
          "
          persistent-hint
          auto-grow
        />
      </v-col>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="state.expiryDate"
            clearable
            :label="t('ccg.expiry_date_label')"
            variant="solo-filled"
          />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-model="state.expiryColor"
            clearable
            :label="t('ccg.expiry_color_label')"
            variant="solo-filled"
            :hint="t('ccg.hex_color_short_hint')"
            persistent-hint
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="state.cardBackgroundColor"
            :label="t('ccg.card_background_label')"
            variant="solo-filled"
            :hint="t('ccg.card_background_hint')"
            persistent-hint
          >
            <template #append>
              <v-btn-toggle
                v-if="state.cardBackgroundColor || state.cardBgImageUrl"
                v-model="state.bgApplyTo"
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
                  state.cardBgImageUrl
                    ? t('ccg.image_loaded_tooltip')
                    : t('ccg.upload_image_tooltip')
                "
              >
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :color="state.cardBgImageUrl ? 'primary' : undefined"
                    style="cursor: pointer"
                    @click="bgImageInput?.click()"
                  >
                    {{ state.cardBgImageUrl ? 'mdi-image-check' : 'mdi-image-plus' }}
                  </v-icon>
                </template>
              </v-tooltip>

              <v-tooltip v-if="state.cardBgImageUrl" location="top" :text="t('ccg.remove_image_tooltip')">
                <template #activator="{ props }">
                  <v-icon v-bind="props" style="cursor: pointer" @click="emit('clearBgImage')">
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
            @change="emit('bgImageChange', $event)"
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
              v-model="state.cardLayout"
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
                  v-model="state.backsideType"
                  mandatory
                  color="primary"
                  density="compact"
                  variant="outlined"
                >
                  <v-btn value="off">{{ t('ccg.no_backside') }}</v-btn>
                  <v-btn value="logo">CA Logo</v-btn>
                  <v-btn v-if="state.cardLayout === 'fancy'" value="qr">QR Code</v-btn>
                  <v-btn value="custom">{{ t('ccg.custom') }}</v-btn>
                </v-btn-toggle>

                <template v-if="state.backsideType === 'custom'">
                  <v-btn variant="tonal" prepend-icon="mdi-upload" @click="fileInput?.click()">
                    {{
                      state.customBacksideUrl ? t('ccg.change_image') : t('ccg.upload_custom_logo')
                    }}
                  </v-btn>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="emit('fileChange', $event)"
                  />
                </template>
              </div>

              <v-text-field
                v-if="state.backsideType !== 'off'"
                v-model.number="state.duplexOffsetX"
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
                v-model="state.itemsDisplay"
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

          <v-col cols="auto">
            <p class="text-label-medium text-medium-emphasis mb-2">
              {{ t('ccg.paper_size_label') }}
            </p>
            <v-btn-toggle
              v-model="state.paperSize"
              mandatory
              color="primary"
              density="compact"
              variant="outlined"
            >
              <v-btn value="a4">{{ t('ccg.paper_size_a4') }}</v-btn>
              <v-btn value="letter">{{ t('ccg.paper_size_letter') }}</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-alert
          v-if="state.backsideType !== 'off'"
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
        :disabled="!codesCount"
        @click="emit('print')"
      >
        {{ t('ccg.save_as_pdf') }}
      </v-btn>

      <div class="ml-4">
        {{ t('ccg.print_hint') }}
        <span v-if="state.backsideType !== 'off'">
          <i18n-t keypath="ccg.double_sided_hint" tag="span">
            <template #twosided><strong>Two-sided</strong></template>
            <template #longedge><strong>Long edge</strong></template>
          </i18n-t>
        </span>
      </div>
    </div>

    <br />
  </div>
</template>

<script setup lang="ts">
import type { CodeCardGeneratorState } from '@/composables/useCodeCardGenerator'

const { t } = useI18n()

defineProps<{
  state: CodeCardGeneratorState
  items: string[]
  codesCount: number
  pagesCount: number
}>()

const emit = defineEmits<{
  clearBgImage: []
  bgImageChange: [e: Event]
  fileChange: [e: Event]
  print: []
}>()

const bgImageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
</script>

<style scoped>
.preview-icon {
  height: 40px;
  width: 40px;
  object-fit: contain;
}
</style>
