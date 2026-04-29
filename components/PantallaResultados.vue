<template lang="pug">
.vista
  #encabezado
    .logo(@click="volverPortada")
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
  #principal
    .panel(ref="textRef")
      h1 {{ textos?.titulo }}
      h3 {{ textos?.mensaje }}
    .contenido(:class="textos?.clase" ref="contentRef")
      img(:src="textos?.imagen")
    button(type="button" ref="btnRef" @click="reiniciar")
      span {{ textos?.boton }}
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const store = useTriviaStore()
const router = useRouter()
const audio = useAudioManager()
const textRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLButtonElement | null>(null)

const textos = computed(() => store.textoResultado ?? {
  titulo: '',
  mensaje: '',
  agradecimiento: ''
})

function reiniciar() {
  store.reiniciar()
  router.push('/portada')
}

function volverPortada() {
  store.reiniciar()
  router.push('/portada')
}

// Animate entrance
onMounted(() => {
  // Play sound only if specified in the result config
  if (textos.value?.audio === 'results') {
    audio.play('results')
  }

  gsap.from(textRef.value, {
    opacity: 0,
    y: -10,
    duration: 0.25,
    ease: 'power2.out',
  })

  gsap.from(contentRef.value, {
    opacity: 0,
    scale: 0.9,
    delay: 0.1,
    duration: 0.4,
    ease: 'power2.out',
  })

  gsap.from(btnRef.value, {
    opacity: 0,
    y: 15,
    delay: 0.25,
    duration: 0.3,
    ease: 'power2.out',
  })
})
</script>

<style lang="stylus">
.lila
  background-color color-lila

.celeste
  background-color color-celeste

.contenido img
  max-height: 40vh;
</style>
