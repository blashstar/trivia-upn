import { defineStore } from 'pinia'
import { shuffle, sortBy, findLast, first } from 'lodash'
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
  const esUrgente = computed(() => {
    const total = config.value?.tiempoPorPregunta ?? 10
    return tiempoRestante.value < total * 0.3
  })
  const tiempoTotal = computed(() => config.value?.tiempoPorPregunta ?? 10)
  const textoResultado = computed(() => {
    if (!config.value) return null
    const score = puntaje.value
    const textos = config.value.textos.resultado
    const claves = sortBy(Object.keys(textos).map(Number))
    const clave = findLast(claves, k => k <= score) ?? first(claves)
    return textos[String(clave)] ?? null
  })

  function iniciarJuego() {
    const total = config.value?.preguntasPorJuego ?? todasPreguntas.value.length
    preguntasJuego.value = shuffle(todasPreguntas.value).slice(0, total)
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
    _intervalId = null
  }

  function detenerTemporizador() {
    temporizadorActivo.value = false
  }

  function responder(opcionIndex: number | null) {
    detenerTemporizador()

    const correcta =
      opcionIndex !== null &&
      preguntaActual.value?.correcta === opcionIndex

    ultimaRespuestaCorrecta.value = correcta

    respuestasUsuario.value.push({
      preguntaId: preguntaActual.value?.id ?? 0,
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
    tiempoTotal,
    iniciarJuego,
    iniciarTemporizador,
    detenerTemporizador,
    responder,
    siguientePregunta,
    reiniciar,
    volverAPortada,
  }
})
