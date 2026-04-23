import { defineStore } from 'pinia'
import type {
  Config,
  Pregunta,
  RespuestaUsuario,
  PantallaEstado,
} from '~/types/game'

export const useTriviaStore = defineStore('trivia', () => {
  // Estado
  const config = ref<Config | null>(null)
  const todasPreguntas = ref<Pregunta[]>([])
  const preguntasJuego = ref<Pregunta[]>([])
  const indiceActual = ref(0)
  const respuestasUsuario = ref<RespuestaUsuario[]>([])
  const pantalla = ref<PantallaEstado>('portada')
  const tiempoRestante = ref(0)
  const temporizadorActivo = ref(false)
  const ultimaRespuestaCorrecta = ref(false)

  let _intervalId: ReturnType<typeof setInterval> | null = null

  // Getters
  const preguntaActual = computed(() => preguntasJuego.value[indiceActual.value])
  const totalPreguntas = computed(() => preguntasJuego.value.length)
  const puntaje = computed(
    () => respuestasUsuario.value.filter((r) => r.correcta).length
  )
  const esUrgente = computed(() => tiempoRestante.value <= 3)
  const textoResultado = computed(() => {
    if (!config.value) return null
    const score = puntaje.value
    const maximo = config.value.preguntasPorJuego
    // Si acertó todas las preguntas del juego
    if (score === maximo) return config.value.textos.resultado[String(maximo)]
    // Si no, mostrar el mensaje de "casi"
    return config.value.textos.resultado['0']
  })

  // Acciones
  function fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  function iniciarJuego() {
    const total = config.value?.preguntasPorJuego ?? todasPreguntas.value.length
    preguntasJuego.value = fisherYatesShuffle(todasPreguntas.value).slice(
      0,
      total
    )
    indiceActual.value = 0
    respuestasUsuario.value = []
    pantalla.value = 'pregunta'
    iniciarTemporizador()
  }

  function iniciarTemporizador() {
    const tiempo = config.value?.tiempoPorPregunta ?? 10
    tiempoRestante.value = tiempo
    temporizadorActivo.value = true

    if (_intervalId) clearInterval(_intervalId)

    _intervalId = setInterval(() => {
      tiempoRestante.value--
      if (tiempoRestante.value <= 0) {
        detenerTemporizador()
        responder(null)
      }
    }, 1000)
  }

  function detenerTemporizador() {
    temporizadorActivo.value = false
    if (_intervalId) {
      clearInterval(_intervalId)
      _intervalId = null
    }
  }

  function responder(opcionIndex: number | null) {
    detenerTemporizador()

    const correcta =
      opcionIndex !== null &&
      preguntaActual.value?.correcta === opcionIndex

    ultimaRespuestaCorrecta.value = correcta

    respuestasUsuario.value.push({
      preguntaIndex: indiceActual.value,
      opcionSeleccionada: opcionIndex,
      correcta,
      tiempoRespuesta:
        (config.value?.tiempoPorPregunta ?? 10) - tiempoRestante.value,
    })

    pantalla.value = 'respuesta'
  }

  function siguientePregunta() {
    indiceActual.value++
    if (indiceActual.value >= preguntasJuego.value.length) {
      pantalla.value = 'resultados'
    } else {
      pantalla.value = 'pregunta'
      iniciarTemporizador()
    }
  }

  function reiniciar() {
    detenerTemporizador()
    pantalla.value = 'portada'
    indiceActual.value = 0
    respuestasUsuario.value = []
  }

  function volverAPortada() {
    pantalla.value = 'portada'
  }

  return {
    config,
    todasPreguntas,
    preguntasJuego,
    indiceActual,
    respuestasUsuario,
    pantalla,
    tiempoRestante,
    temporizadorActivo,
    ultimaRespuestaCorrecta,
    preguntaActual,
    totalPreguntas,
    puntaje,
    esUrgente,
    textoResultado,
    iniciarJuego,
    iniciarTemporizador,
    detenerTemporizador,
    responder,
    siguientePregunta,
    reiniciar,
    volverAPortada,
  }
})
