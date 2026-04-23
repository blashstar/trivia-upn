import cfg from '../.cfg.json'
import preguntas from '../.preguntas.json'
import type { Config, Pregunta } from '~/types/game'

export default defineNuxtPlugin(() => {
  const config = cfg as unknown as Config
  const todasPreguntas = preguntas as unknown as Pregunta[]

  return {
    provide: {
      config,
      todasPreguntas,
    },
  }
})
