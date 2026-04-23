<template lang="pug">
#pagina
  Transition(name="slide-fade" mode="out-in")
    NuxtPage
</template>

<script setup lang="ts">
const { cargar } = useGameData()

// Los datos se inyectan en el build — solo inicializar el store
onMounted(() => {
  cargar()
})
</script>

<style lang="stylus">
@import '/assets/css/main.styl'
</style>
