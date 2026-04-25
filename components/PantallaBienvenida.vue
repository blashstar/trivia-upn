<template lang="pug">
.vista
  #principal(v-if="textos")
    .panel.inverso
      .logo(ref="logoRef")
        img(src="/img/logo_ambar.png" alt="UPN Posgrado")
      h1(ref="titleRef") {{ textos.titulo }}
      button.enlace(type="button" ref="btnRef" @click="iniciar"): .texto
        img(src="/img/ico-arriba.svg")
        span {{ textos.boton }}
    figure.foto(ref="photoRef"): img(src="/img/portada.jpg")
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const store = useTriviaStore()
const router = useRouter()
const logoRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLButtonElement | null>(null)
const photoRef = ref<HTMLElement | null>(null)

const textos = computed(() => store.config?.textos.portada)

function iniciar() {
  store.iniciarJuego()
  router.push('/pregunta')
}

// Animate entrance
onMounted(() => {
  gsap.from(logoRef.value, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.out',
  })

  gsap.from(titleRef.value, {
    opacity: 0,
    y: 15,
    delay: 0.1,
    duration: 0.35,
    ease: 'power2.out',
  })

  gsap.from(btnRef.value, {
    opacity: 0,
    y: 15,
    delay: 0.2,
    duration: 0.3,
    ease: 'power2.out',
  })

  gsap.from(photoRef.value, {
    opacity: 0,
    scale: 1.05,
    delay: 0.15,
    duration: 0.5,
    ease: 'power2.out',
  })
})
</script>

<style lang="stylus">
h1
  &::first-line
    font-size 5vh

.enlace
  color color-amarillo
  background-color black
  text-align left
  min-height: auto
  justify-content start
  font-weight 400
  padding 0.5em 0
  line-height 1.4

  div.texto
    display flex
    align-items center
    gap 0.2em
    border-bottom 1px solid color-amarillo

    img
      height .8em
      object-fit contain

.foto
  flex 1 1 auto

  img
    width 100%
    height 100%
    object-fit cover
</style>