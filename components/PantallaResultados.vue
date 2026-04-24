<template lang="pug">
#encabezado
  .logo
    img(src="/img/logo_negro.png" alt="UPN Posgrado")
#principal
  .panel
    h1 {{ textos?.titulo }}
    h3 {{ textos?.mensaje }}
  .contenido
    img(src="/img/ico-celebra.png")
  button(type="button" @click="reiniciar")
    span {{ textos?.agradecimiento }}
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

const textos = computed(() => {
  return {
    "titulo": "¡FELICITACIONES!",
    "mensaje": "OBTUVISTE UN RÉCORD PERFECTO",
    "agradecimiento": "GRACIAS POR PARTICIPAR"
  }
});

function reiniciar() {
  store.reiniciar()
  router.push('/portada')
}
</script>

<style lang="stylus">
.score-numero
  font-size 12vh
  font-weight 900
  color var(--color-lila)
  line-height 1
  text-align center

.score-total
  font-size 4vh
  color var(--color-negro)
  text-align center
  font-weight 700
</style>
