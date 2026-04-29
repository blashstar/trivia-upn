<template lang="pug">
.vista
  #encabezado
    .logo(@click="volverPortada")
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
  #principal(v-if="textos")
    .panel(ref="textRef")
      h2 {{ textos.titulo }}
      h3 {{ textos.mensaje }}

    .contenido(:class="correcta ? 'acierto' : 'error'" ref="contentRef")
      img(src="/img/ico-bien.png" v-if="correcta")
      img(src="/img/ico-mal.png" v-else)

    button(type="button" ref="btnRef" @click="siguiente")
      span {{ textos.boton }}
</template>

<script setup lang="ts">
import { defaultTo } from 'lodash'
import { gsap } from 'gsap'

const store = useTriviaStore()
const router = useRouter()
const audio = useAudioManager()
const textRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLButtonElement | null>(null)

const correcta = computed(() => defaultTo(store.ultimaRespuestaCorrecta, false))

const textos = computed(() => {
  return correcta.value ? store.config?.textos.respuesta.acierto : store.config?.textos.respuesta.error
})

function siguiente() {
  store.siguientePregunta()
  if (store.pantalla === 'resultados') {
    router.push('/resultado')
  } else {
    router.push('/pregunta')
  }
}

function volverPortada() {
  store.reiniciar()
  router.push('/portada')
}

// Animate entrance
onMounted(() => {
  // Play correct/incorrect sound based on answer result
  if (correcta.value) {
    audio.play('correct')
  } else {
    audio.play('incorrect')
  }

  gsap.from(textRef.value, {
    opacity: 0,
    y: -10,
    duration: 0.25,
    ease: 'power2.out',
  })

  gsap.from(contentRef.value, {
    opacity: 0,
    scale: 0.85,
    duration: 0.35,
    ease: 'back.out(1.4)',
  })

  gsap.from(btnRef.value, {
    opacity: 0,
    y: 15,
    delay: 0.15,
    duration: 0.3,
    ease: 'power2.out',
  })
})
</script>

<style lang="stylus">
  .contenido
    &.acierto
      background-color color-celeste
    &.error
      background-color color-fuchsia
</style>