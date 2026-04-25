<template lang="pug">
.vista
  #encabezado
    .logo
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
  #principal(v-if="textos")
    .panel
      h2 {{ textos.titulo }}
      h3 {{ textos.mensaje }}

    .contenido(:class="correcta ? 'acierto' : 'error'")
      img(src="/img/ico-bien.png" v-if="correcta")
      img(src="/img/ico-mal.png" v-else)

    button(type="button" @click="siguiente")
      span {{ textos.boton }}
</template>

<script setup lang="ts">
import { defaultTo } from 'lodash'

const store = useTriviaStore()
const router = useRouter()

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
</script>

<style lang="stylus">

  .contenido
    &.acierto
      background-color color-celeste
    &.error
      background-color color-fuchsia
</style>
