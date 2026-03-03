<script setup lang="ts">
const items = shallowRef([
  {
    title: 'Wurzelheim GitHub',
    icon: `mdi-github`,
    href: 'https://github.com/ichbinbobby/wurzelheim.de'
  },
  {
    title: 'Pokemon GO News',
    icon: `mdi-pokeball`,
    href: 'https://pokemongo.com/en/news'
  }
])
</script>

<template>
  <v-footer app height="40">
    <NuxtLink
      v-for="item in items"
      :key="item.title"
      class="d-inline-block mx-2 social-link"
      :href="item.href"
      rel="noopener noreferrer"
      target="_blank"
      :title="item.title"
    >
      <v-icon :icon="item.icon" :size="item.icon === '$vuetify' ? 24 : 16" />
    </NuxtLink>

    <div class="text-body-small text-disabled" style="position: absolute; right: 16px">
      &copy; 2026-{{ new Date().getFullYear() }}
      <span class="d-none d-sm-inline-block">Wurzelheim Alexanderplatz</span>
      —
      <NuxtLink
        class="text-decoration-none on-surface"
        href="https://campfire.onelink.me/eBr8?af_dp=campfire://&af_force_deeplink=true&deep_link_sub1=cj1jbHVicyZjPWQ5ZGI1NGI2LWZhOWEtNDQ2ZS05ODUyLWI3YWE2YTI3MTRjMSZpPXRydWU="
        rel="noopener noreferrer"
        target="_blank"
      >
        Campfire Link
      </NuxtLink>
    </div>
  </v-footer>
</template>

<style scoped lang="sass">
.social-link :deep(.v-icon)
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
  text-decoration: none
  transition: .2s ease-in-out

  &:hover
    color: rgba(25, 118, 210, 1)
</style>
