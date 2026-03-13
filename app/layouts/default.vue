<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        <NuxtLink class="text-decoration-none on-surface" to="/">Wurzelheim</NuxtLink>
      </v-app-bar-title>

      <v-spacer />

      <v-btn prepend-icon="mdi-pokeball" to="/meetup-creator"> Meetup Creator </v-btn>

      <v-btn prepend-icon="mdi-file-pdf-box" to="/code-card-generator"> Code Card Generator </v-btn>

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
        href="https://pokemongo.com/de/map"
        target="_blank"
        rel="noopener"
      >
        Pokemon GO Map
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
