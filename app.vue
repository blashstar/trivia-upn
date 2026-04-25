<template lang="pug">
#pagina
  NuxtPage
</template>

<script setup lang="ts">
const { cargar } = useGameData()
useFullscreenToggle()

// Los datos se inyectan en el build — solo inicializar el store
onMounted(() => {
  cargar()
})
</script>

<style lang="stylus">
@import '/assets/css/main.styl'
</style>
