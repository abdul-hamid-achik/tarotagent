import type { Ref } from 'vue'

export function useAutoDismissMessage(duration = 3000) {
  const message: Ref<string | null> = ref(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  function set(value: string | null) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    message.value = value

    if (value) {
      timer = setTimeout(() => {
        message.value = null
        timer = null
      }, duration)
    }
  }

  onBeforeUnmount(() => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })

  return {
    message: computed(() => message.value),
    set,
  }
}
