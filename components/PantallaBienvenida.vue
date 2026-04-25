<template lang="pug">
.vista
  #principal(v-if="textos")
    .panel.inverso
      .logo
        img(src="/img/logo_ambar.png" alt="UPN Posgrado")
      h1 {{ textos.titulo }}
      button.enlace(type="button" @click="iniciar"): .texto
        img(src="/img/ico-arriba.svg")
        span {{ textos.boton }}
    figure.foto: img(src="/img/portada.jpg")
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

const textos = computed(() => store.config?.textos.portada)

function iniciar() {
  store.iniciarJuego()
  router.push('/pregunta')
}
</script>

<style lang="stylus">
*
  // outline 1px solid red

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
