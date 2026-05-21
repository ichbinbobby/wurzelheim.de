<template>
  <v-container class="fill-height d-flex align-center flex-wrap" max-width="900">
    <div class="mx-auto">
      <v-img class="mb-4" height="200" src="/ca_program.png" />

      <div class="mb-8 text-center">
        <div class="text-body-medium font-weight-light mb-n1">{{ t('home.welcome_to') }}</div>
        <h1 class="text-display-medium font-weight-bold">Wurzelheim</h1>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            prepend-icon="mdi-pokeball"
            rounded="lg"
            :title="t('home.tagline')"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
