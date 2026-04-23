<template lang="pug">
#encabezado
  .logo
    img(src="https://www.upn.edu.pe/sites/default/files/logo-posgrado-upn.svg" alt="UPN Posgrado")
#principal
  .contenido
    .panel
      h1 {{ store.config?.textos.portada.titulo }}
      h4 {{ store.config?.textos.portada.subtitulo }}
  #pie
    button(type="button" @click="iniciar")
      span {{ store.config?.textos.portada.boton }}
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

function iniciar() {
  store.iniciarJuego()
  router.push('/pregunta')
}
</script>

<style lang="stylus">
</style>
