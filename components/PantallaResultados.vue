<template lang="pug">
.vista 
  #encabezado
    .logo
      img(src="/img/logo_negro.png" alt="UPN Posgrado")
  #principal
    .panel
      h1 {{ textos?.titulo }}
      h3 {{ textos?.mensaje }}
    .contenido(:class="textos?.clase")
      img(:src="textos?.imagen")
    button(type="button" @click="reiniciar")
      span {{ textos?.boton }}
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

const textos = computed(() => store.textoResultado ?? {
  titulo: '',
  mensaje: '',
  agradecimiento: ''
})

function reiniciar() {
  store.reiniciar()
  router.push('/portada')
}
</script>

<style lang="stylus">

.lila
  background-color color-lila

.celeste
  background-color color-celeste

</style>
