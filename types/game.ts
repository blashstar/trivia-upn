export interface Opcion {
  texto: string
  imagen?: string
}

export interface PreguntaTexto {
  texto: string
}

export interface Pregunta {
  id: number
  pregunta: PreguntaTexto
  opciones: Opcion[]
  correcta: number
}

export interface TextosFeedback {
  titulo: string
  mensaje: string
  boton: string
}

export interface TextosRespuesta {
  acierto: TextosFeedback
  error: TextosFeedback
}

export interface TextosResultado {
  titulo: string
  mensaje: string
  agradecimiento: string
  audio?: string | null
}

export interface TextosConfig {
  portada: {
    titulo: string
    boton: string
  }
  respuesta: TextosRespuesta
  resultado: Record<string, TextosResultado>
}

export interface Config {
  preguntasPorJuego: number
  tiempoPorPregunta: number
  puntosPorAcierto: number
  puntosParaGanar?: number
  textos: TextosConfig
}

export interface RespuestaUsuario {
  preguntaId: number
  preguntaIndex: number
  opcionSeleccionada: number | null
  correcta: boolean
  tiempoRespuesta: number
}

export type PantallaEstado =
  | 'portada'
  | 'pregunta'
  | 'respuesta'
  | 'resultados'
