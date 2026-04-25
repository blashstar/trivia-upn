<template lang="pug">
.vista
  #encabezado
    .logo(@click="volverPortada")
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
    .grupo.derecha: Temporizador
  #principal
    .panel.inverso.pregunta(ref="questionRef")
      .texto {{ actual?.pregunta?.texto }}
    .panel
      p SELECCIONA SOLO #[strong UNA RESPUESTA]
    .opciones(ref="optionsRef")
      button.opcion(
        v-for="(opcion, index) in actual?.opciones"
        :key="index"
        type="button"
        @click="responder(index)"
      )
        span {{ letras[index] }}. {{ opcion.texto }}
        img(
          v-if="opcion.imagen"
          :src="opcion.imagen"
          @error="onImageError"
        )
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const store = useTriviaStore()
const router = useRouter()
const letras = ['A', 'B', 'C', 'D']
const questionRef = ref<HTMLElement | null>(null)
const optionsRef = ref<HTMLElement | null>(null)

const actual = computed(() => store.preguntaActual);

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}

function responder(index: number) {
  store.responder(index)
  router.push('/respuesta')
}

function volverPortada() {
  store.volverAPortada()
  router.push('/portada')
}

// Animate question text and options on mount
onMounted(() => {
  gsap.from(questionRef.value, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.out',
  })

  gsap.from(optionsRef.value.querySelectorAll('.opcion'), {
    opacity: 0,
    y: 20,
    stagger: 0.08,
    duration: 0.35,
    ease: 'power2.out',
  })
})

// Re-animate when question changes
watch(() => store.indiceActual, () => {
  gsap.from(questionRef.value, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.out',
  })

  gsap.from(optionsRef.value.querySelectorAll('.opcion'), {
    opacity: 0,
    y: 20,
    stagger: 0.08,
    duration: 0.35,
    ease: 'power2.out',
  })
})

// Navigate to /respuesta when timer expires
watch(() => store.pantalla, (newScreen) => {
  if (newScreen === 'respuesta') {
    router.push('/respuesta')
  }
})
</script>

<style lang="stylus">
.pregunta
  height 24dvh
  justify-content center

  .texto
    font-size 4vh
    line-height 1.2
    font-weight 700
</style>