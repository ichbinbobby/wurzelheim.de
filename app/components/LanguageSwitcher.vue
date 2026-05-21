<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn v-bind="props" prepend-icon="mdi-translate" slim>
        {{ currentLocale?.name }}
      </v-btn>
    </template>

    <v-list density="compact">
      <v-list-item
        v-for="locale in locales"
        :key="locale.code"
        :active="locale.code === currentLocale?.code"
        color="primary"
        @click="setLocale(locale.code)"
      >
        {{ locale.name }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const currentLocale = computed(() => locales.value.find((l) => l.code === locale.value))
</script>
