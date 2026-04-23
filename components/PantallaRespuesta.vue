<template lang="pug">
#encabezado
  .logo
    img(src="https://www.upn.edu.pe/sites/default/files/logo-posgrado-upn.svg" alt="UPN Posgrado")
#principal
  .resultado-mensaje
    .panel.inverso
      .resultado-icono {{ store.ultimaRespuestaCorrecta ? '✅' : '❌' }}
      h1(
        v-if="store.ultimaRespuestaCorrecta"
      ) {{ store.config?.textos.respuesta.acierto.titulo }}
      h1(v-else) {{ store.config?.textos.respuesta.error.titulo }}
      h4(
        v-if="store.ultimaRespuestaCorrecta"
      ) {{ store.config?.textos.respuesta.acierto.mensaje }}
      h4(v-else) {{ store.config?.textos.respuesta.error.mensaje }}
  #pie
    button(type="button" @click="siguiente")
      span(
        v-if="store.ultimaRespuestaCorrecta"
      ) {{ store.config?.textos.respuesta.acierto.boton }}
      span(v-else) {{ store.config?.textos.respuesta.error.boton }}
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

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
</style>
