<template lang="pug">
#pagina
  .page-container
    RouterView(v-slot="{ Component }")
      Transition(name="page")
        component(:is="Component" :key="$route.fullPath")
</template>

<script setup lang="ts">
const { cargar } = useGameData()
useFullscreenToggle()

onMounted(() => {
  cargar()
})
</script>

<style lang="stylus">
@import '/assets/css/main.styl'
</style>
