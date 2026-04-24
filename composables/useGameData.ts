import { useTriviaStore } from '~/stores/trivia'

export function useGameData() {
  const store = useTriviaStore()
  const { $gameConfig, $todasPreguntas } = useNuxtApp()

  const cargando = ref(false)
  const error = ref<string | null>(null)

  function cargar() {
    try {
      store.config = $gameConfig as typeof store.config
      store.todasPreguntas = $todasPreguntas as typeof store.todasPreguntas
      cargando.value = false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al cargar datos'
      cargando.value = false
    }
  }

  return { cargando, error, cargar }
}
