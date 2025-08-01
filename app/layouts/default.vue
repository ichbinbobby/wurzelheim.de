<template>
  <v-app>
    <v-app-bar title="Wurzelheim">
      <v-spacer />

      <v-btn
        prepend-icon="mdi-campfire"
        href="https://campfire.nianticlabs.com/discover"
        target="_blank"
        rel="noopener"
      >
        Campfire
      </v-btn>

      <v-btn
        prepend-icon="mdi-map-marker"
        href="https://www.google.com/maps"
        target="_blank"
        rel="noopener"
      >
        Google Maps
      </v-btn>

      <v-btn
        :prepend-icon="theme.name.value === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        class="mr-3"
        text="Toggle Theme"
        slim
        @click="theme.toggle()"
      />
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>

    <AppFooter />

    <v-snackbar-queue v-model="messages.queue" />
  </v-app>
</template>

<script setup lang="ts">
  import { useTheme } from 'vuetify'

  const theme = useTheme()
  const messages = useMessagesStore()
</script>
