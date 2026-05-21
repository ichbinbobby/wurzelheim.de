<template>
  <v-snackbar
    v-model="visible"
    :timeout="-1"
    location="bottom"
    multi-line
    color="surface-variant"
    elevation="8"
  >
    We use Google Analytics to understand how this site is used. Do you agree to anonymous tracking?

    <template #actions>
      <v-btn variant="text" @click="reject">Reject</v-btn>
      <v-btn color="primary" variant="tonal" @click="accept">Accept</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'cookie_consent'

const visible = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'accepted') {
    grantConsent()
  } else if (stored !== 'rejected') {
    visible.value = true
  }
})

const grantConsent = () => {
  ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
    'consent',
    'update',
    { analytics_storage: 'granted' }
  )
}

const accept = () => {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  grantConsent()
  visible.value = false
}

const reject = () => {
  localStorage.setItem(STORAGE_KEY, 'rejected')
  visible.value = false
}
</script>
