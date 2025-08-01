export const useMessagesStore = defineStore('messages', () => {
  const queue = ref([])

  function add (message) {
    queue.value.push(message)
  }

  return { queue, add }
})
