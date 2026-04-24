<template lang="pug">
.vista
  #encabezado
    .logo
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
    .grupo.derecha
      strong TIEMPO
      span.tiempo() {{ tiempoRestante }}
  #principal
    .panel.inverso.pregunta
      .texto {{ actual?.pregunta?.texto }}
    .panel
      p SELECCIONA SOLO #[strong UNA RESPUESTA]
    .opciones
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
const store = useTriviaStore()
const router = useRouter()
const letras = ['A', 'B', 'C', 'D']

const actual = computed(() => store.preguntaActual);

const tiempoRestante = computed(() => {
  if (!store.tiempoRestante) return '00:00'
  const minutos = Math.floor(store.tiempoRestante / 60).toString().padStart(2, '0')
  const segundos = (store.tiempoRestante % 60).toString().padStart(2, '0')
  return `${minutos}:${segundos}`
})

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}

function responder(index: number) {
  store.responder(index)
  router.push('/respuesta')
}
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
