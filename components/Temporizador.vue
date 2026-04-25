<template>
  <div class="grupo tiempo" :class="{ urgente: store.esUrgente }">
    <strong>TIEMPO</strong>
    <span ref="timerRef" class="contador">{{ displayTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const store = useTriviaStore()
const timerRef = ref<HTMLElement | null>(null)
const displayTime = ref('00:00')
let timeline: gsap.core.Timeline | null = null

// Format milliseconds to MM:SS
function formatTime(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60).toString().padStart(2, '0')
  const sec = (totalSec % 60).toString().padStart(2, '0')
  // const mili = Math.floor((ms % 1000) / 10).toString().padStart(3, '0')
  return `${min}:${sec}`
}

// Start GSAP countdown
function startCountdown() {
  if (timeline) timeline.kill()

  const totalMs = store.tiempoTotal * 1000

  timeline = gsap.timeline({
    onUpdate: () => {
      if (timeline) {
        const remaining = totalMs - timeline.progress() * totalMs
        displayTime.value = formatTime(remaining)
        store.tiempoRestante = Math.ceil(remaining / 1000)
      }
    },
    onComplete: () => {
      displayTime.value = '00:00'
      store.tiempoRestante = 0
      store.responder(null)
    },
  })

  timeline.to({}, { duration: store.tiempoTotal, ease: 'none' })
}

// Watch for pantalla changes to start/restart
watch(() => store.pantalla, (screen) => {
  if (screen === 'pregunta') {
    startCountdown()
  } else if (timeline) {
    timeline.kill()
    timeline = null
  }
}, { immediate: true })

onUnmounted(() => {
  if (timeline) timeline.kill()
})
</script>

<style scoped lang="stylus">
.tiempo
  font-size 2.3vh
  font-weight 400
  line-height 1

  .contador
    font-family 'Courier New', Courier, monospace
    font-size 2vh
    font-weight 400
    font-variant-numeric tabular-nums
    font-feature-settings 'tnum'

// Heartbeat animation for urgent timer
.tiempo.urgente .contador
  animation heartbeat 0.6s ease-in-out infinite

@keyframes heartbeat
  0%, 100%
    transform scale(1)
  50%
    transform scale(1.15)
</style>
