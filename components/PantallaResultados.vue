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
import _ from 'lodash';

const store = useTriviaStore()
const router = useRouter()

const puntaje = computed(() => store.puntaje)

const textos = computed(() => {
  const cadenas = store.config?.textos.resultado;
  
  if (!cadenas) {
    return {
      titulo: '',
      mensaje: '',
      agradecimiento: ''
    };
  }
  
  const clavesOrdenadas = _.sortBy(Object.keys(cadenas).map(Number));
  const claveEncontrada = _.find(
    clavesOrdenadas, 
    (clave: number) => clave <= puntaje.value
  ) || _.first(clavesOrdenadas);
  
  return cadenas[claveEncontrada!];
});

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
