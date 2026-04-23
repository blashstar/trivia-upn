<template lang="pug">
#encabezado
  .logo
    img(src="https://www.upn.edu.pe/sites/default/files/logo-posgrado-upn.svg" alt="UPN Posgrado")
  .grupo.derecha
    strong TIEMPO
    span.tiempo(:class="{ urgente: store.esUrgente }") {{ store.tiempoRestante }}
#principal
  .panel.inverso
    h2 {{ store.preguntaActual?.pregunta?.texto }}
  .panel
    p SELECCIONA SOLO #[strong UNA RESPUESTA]
  .opciones
    button.opcion(
      v-for="(opcion, index) in store.preguntaActual?.opciones"
      :key="index"
      type="button"
      @click="responder(index)"
    )
      span {{ letras[index] }}. {{ opcion.texto }}
      img(
        v-if="opcion.imagen"
        :src="opcion.imagen"
        alt=""
        @error="onImageError"
      )
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()
const letras = ['A', 'B', 'C', 'D']

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder.png'
}

function responder(index: number) {
  store.responder(index)
  router.push('/respuesta')
}
</script>

<style lang="stylus">
</style>
