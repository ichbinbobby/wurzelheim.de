<template>
  <v-sheet>
    <v-container >
      <v-row>
        <v-col>
          <v-select v-model="eventType" :items="eventTypes" label="Event" return-object />
        </v-col>

        <v-col>
          <v-autocomplete 
            v-model="pokemon" 
            :items="pokemonList" 
            label="Pokemon"   
            item-title="title"
            item-value="value" 
            return-object 
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-textarea v-model="eventText" append-inner-icon="mdi-content-copy" label="Beschreibung" @click:append-inner="copyEventText" />
        </v-col>
      </v-row>
        
      <v-row>
        <!-- TODO Generated Text that can be copied and edited and where can we get the max cps for raiding? -->
         <v-col cols="9">
          <v-card>
              <v-card-title><span>{{ pokemon ? pokemon.title : 'Pokemon' }}</span> <span>{{ eventType.title }}</span></v-card-title>

              <v-card-text class="preserve-linebreaks">
                {{ eventText }}
              </v-card-text>
          </v-card>
         </v-col>

         <v-col>
            <v-avatar
              class="ma-3"
              rounded="0"
              size="215"
            >
              <v-img :src="imgUrl" />
            </v-avatar>
         </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import type { Pokemon } from '~/types/pokemon'
import pokemonData from '@/assets/pokemon.json'

const eventType = ref({title: 'Raid-Stunde', value: 'Raid Hour'})
const eventText = ref(`Pokemon Trainer, wir treffen uns vor dem dm hinter der Polizeistation, um gemeinsam zu Raiden.

Vergesst nicht bei Camp Fire einzuchecken. Ihr könnt uns einfach ansprechen. Eventuell machen wir ein Foto. Bitte haltet die Stadt sauber 🙂`)

const pokemon = ref<Pokemon | null>(null)

const messages = useMessagesStore()

// https://www.pokemon.com/api/1/de/kalos/kalos
const pokemonList = ref<Pokemon[]>(pokemonData.map(p => ({
  title: p.name,
  value: p.name,
  id: p.id,
  number: Number(p.number),
  type: p.type,
  detailPageURL: p.detailPageURL,
  ThumbnailAltText: p.ThumbnailAltText,
  ThumbnailImage: p.ThumbnailImage,
  weakness: p.weakness,
})))

const imgUrl = computed(() => {
  return pokemon.value ? pokemonList.value.find(p => p.title === pokemon.value?.title)?.ThumbnailImage : ''
});

const eventTypes = ref([
  { title: 'Raid-Stunde', value: 'Raid Hour' },
  { title: 'Raid-Tag', value: 'Raid Day' },
  { title: 'Dyna-Kampf-Tag', value: 'Max Battle Day' },
  { title: 'Gigadynamax', value: 'Gigantamax Battle Day' },
  { title: 'Community Day', value: 'Community Day' },
  { title: 'Community Day Classic', value: 'Community Day Classic' },
  { title: 'Rampenlichtstunde', value: 'Spotlight Hour' },
  { title: 'Schlüpftag', value: 'Hatch Day' },
  { title: 'Forschungstag', value: 'Research Day' },
  { title: 'GO Fest', value: 'GO Fest' },
  { title: 'GO Tour', value: 'GO Tour' },
])

const copyEventText = () => {
  if (eventText.value) {
    navigator.clipboard.writeText(eventText.value)
    messages.add('Event text copied to clipboard!')
  }
}
</script>

<style scoped>
.preserve-linebreaks {
  white-space: pre-line;
}
</style>