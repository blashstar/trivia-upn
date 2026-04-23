<template>
  <div class="timer-display" :class="{ urgente: store.esUrgente }">
    <span class="timer-icono">⏱️</span>
    <span class="timer-numero">{{ store.tiempoRestante }}</span>
  </div>
</template>

<script setup lang="ts">
const store = useTriviaStore()
</script>
