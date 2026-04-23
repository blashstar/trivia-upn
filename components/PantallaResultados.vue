<template lang="pug">
#encabezado
  .logo
    img(src="https://www.upn.edu.pe/sites/default/files/logo-posgrado-upn.svg" alt="UPN Posgrado")
#principal
  .resultado-mensaje
    .panel
      h1 {{ textoResultado?.titulo }}
      .score-numero {{ store.puntaje }}
      .score-total / {{ store.totalPreguntas }}
      h3 {{ textoResultado?.mensaje }}
      h4 {{ textoResultado?.agradecimiento }}
  #pie
    button(type="button" @click="reiniciar")
      span JUGAR DE NUEVO
</template>

<script setup lang="ts">
const store = useTriviaStore()
const router = useRouter()

const textoResultado = computed(() => store.textoResultado)

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
