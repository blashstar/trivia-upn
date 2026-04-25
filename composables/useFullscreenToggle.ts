export function useFullscreenToggle(): { isFullscreen: import('vue').Ref<boolean> } {
  const isFullscreen = ref(!!document.fullscreenElement)

  function updateState() {
    isFullscreen.value = !!document.fullscreenElement
  }

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'f' || e.key === 'F') {
      const tag = (e.target as HTMLElement).tagName
      if (['INPUT', 'TEXTAREA'].includes(tag)) return
      toggle()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('fullscreenchange', updateState)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('fullscreenchange', updateState)
  })

  return { isFullscreen }
}