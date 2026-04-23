# 📄 PRD - Trivia PWA con Nuxt 3 (Actualizado)

## 1. Resumen ejecutivo

| Campo | Valor |
|-------|-------|
| Nombre del proyecto | **Trivia Profesional PWA** |
| Tecnología | Nuxt 3 + Vue 3 + Pinia + Vite PWA |
| Plataformas | Windows (Edge/Chrome), Android (Chrome) |
| Instalación | PWA, funciona 100% offline |
| Fuente de datos | `.preguntas.json` (preguntas con imágenes) y `.cfg.json` (configuración + textos) |
| Tiempo por pregunta | 10 segundos (configurable) |

---

## 2. Requisitos funcionales

### 2.1 Pantallas del juego

| Pantalla | Descripción |
|----------|-------------|
| Portada | Muestra título y botón definidos en `.cfg.json` → `textos.portada` |
| Instrucciones | Texto fijo (no viene del JSON): explica la mecánica, el tiempo, puntuación |
| Pregunta | Muestra el texto de la pregunta, 4 opciones (cada una con texto e imagen), temporizador regresivo |
| Respuesta | Feedback con título, mensaje y botón según acierto/error (desde `.cfg.json`) |
| Resultado | Muestra título, mensaje y agradecimiento según puntaje obtenido (claves en `.cfg.json`) |

### 2.2 Flujo de navegación

```
Portada → Instrucciones → Pregunta 1 → Respuesta 1 → Pregunta 2 → … → Respuesta N → Resultado → Portada
```

- El temporizador corre en cada pregunta. Si llega a 0 → se considera respuesta incorrecta y pasa automáticamente a pantalla Respuesta (con mensaje de error).
- No se puede volver atrás a una pregunta ya respondida.

### 2.3 Carga de datos (offline first)

Ambos archivos JSON se cargan al iniciar la app y se cachean con el Service Worker.

**`.preguntas.json`** (array de objetos):

```json
[
  {
    "pregunta": { "texto": "¿QUÉ BENEFICIO APORTA ESTUDIAR UN POSGRADO...?" },
    "opciones": [
      { "texto": "ELIMINACIÓN DE PROYECTOS", "imagen": "/images/opcion1.png" },
      { "texto": "REDUCCIÓN DEL APRENDIZAJE PRÁCTICO", "imagen": "/images/opcion2.png" },
      { "texto": "FORMACIÓN ENFOCADA EN EL DESARROLLO PROFESIONAL", "imagen": "/images/opcion3.png" },
      { "texto": "MENOR INTERACCIÓN ACADÉMICA", "imagen": "/images/opcion4.png" }
    ],
    "correcta": 2   // índice base 0
  }
]
```

**`.cfg.json`** :

```json
{
  "preguntasPorJuego": 5,
  "tiempoPorPregunta": 10,
  "puntosPorAcierto": 1,
  "textos": {
    "portada": {
      "titulo": "DESBLOQUEA TU SIGUIENTE NIVEL PROFESIONAL",
      "boton": "COMIENZA AQUÍ"
    },
    "respuesta": {
      "acierto": {
        "titulo": "¡RESPUESTA CORRECTA!",
        "mensaje": "SIGUE ASÍ VAMOS ADELANTE",
        "boton": "SIGUIENTE PREGUNTA"
      },
      "error": {
        "titulo": "¡RESPUESTA INCORRECTA!",
        "mensaje": "NO TE PREOCUPES VUELVE A INTENTARLO",
        "boton": "SIGUIENTE PREGUNTA"
      }
    },
    "resultado": {
      "5": {
        "titulo": "¡FELICITACIONES!",
        "mensaje": "OBTUVISTE UN RÉCORD PERFECTO",
        "agradecimiento": "GRACIAS POR PARTICIPAR"
      },
      "0": {
        "titulo": "¡ESTUVISTE CERCA!",
        "mensaje": "NO TE DETENGAS SIGUE INTENTANDO",
        "agradecimiento": "GRACIAS POR PARTICIPAR"
      }
    }
  }
}
```

> **Nota**: Si el puntaje obtenido no existe como clave en `resultado`, se usa la clave `"0"` como fallback.

### 2.4 Lógica del juego

- Al iniciar, se seleccionan aleatoriamente `preguntasPorJuego` del total cargado (si hay más).
- Cada acierto suma `puntosPorAcierto`.
- El temporizador se muestra en cada pregunta (formato `00:00` o barra de progreso). Al terminar el tiempo, se dispara `responderConError()`.
- Después de responder (o timeout), se guarda el resultado (true/false) y se pasa a pantalla Respuesta.
- En la pantalla Respuesta, se muestra el feedback correspondiente (acierto/error) y un botón para continuar.
- Si era la última pregunta, el botón lleva a Resultado; si no, a la siguiente Pregunta.

---

## 3. Requisitos no funcionales (PWA)

### 3.1 Offline completo

- Todos los assets (HTML, JS, CSS, imágenes de opciones, JSON) deben estar cacheados.
- Estrategia `CacheFirst` para imágenes y JSON.
- El Service Worker se genera con `@vite-pwa/nuxt` y debe precachear todas las rutas de imágenes referenciadas en `.preguntas.json`.

### 3.2 Rendimiento

- El temporizador debe ser preciso (requestAnimationFrame o setInterval con corrección).
- Cambio entre pantallas < 100ms.

### 3.3 UX específica

- En la pantalla Pregunta, cada opción muestra su imagen (tamaño fijo, por ejemplo 80x80px) y texto debajo o al lado.
- La opción seleccionada debe tener feedback visual (hover, active, focus).
- El temporizador debe ser fácilmente visible (color rojo cuando queden <3 segundos).
- Si se responde antes de tiempo, el temporizador se detiene y se pasa a Respuesta inmediatamente.

---

## 4. Arquitectura técnica actualizada

### 4.1 Estructura de carpetas

```
trivia-pwa/
├── public/
│   ├── images/               # todas las imágenes de opciones
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-icon.png
├── data/
│   ├── .preguntas.json       # (se copia a public o se importa)
│   └── .cfg.json
├── stores/
│   └── trivia.js
├── components/
│   ├── PantallaPortada.vue
│   ├── PantallaInstrucciones.vue
│   ├── PantallaPregunta.vue
│   ├── PantallaRespuesta.vue
│   ├── PantallaResultado.vue
│   └── Temporizador.vue      # componente reutilizable
├── composables/
│   └── useTriviaStore.js
├── pages/
│   └── index.vue
├── nuxt.config.ts
└── package.json
```

### 4.2 Store de Pinia (esquema ampliado)

```javascript
state: {
  config: null,               // objeto .cfg.json
  todasPreguntas: [],         // array del .preguntas.json
  preguntasJuego: [],         // selección aleatoria (según preguntasPorJuego)
  indiceActual: 0,
  respuestasUsuario: [],      // boolean[]
  pantalla: 'portada',
  tiempoRestante: 10,         // para la pregunta actual
  temporizadorActivo: false,
}

getters: {
  puntaje: (state) => state.respuestasUsuario.filter(r => r === true).length * state.config.puntosPorAcierto,
  totalPreguntas: (state) => state.preguntasJuego.length,
  esUltimaPregunta: (state) => state.indiceActual === state.preguntasJuego.length - 1,
  textoResultado: (state) => {
    const puntajeClave = String(state.puntaje);
    return state.config.textos.resultado[puntajeClave] || state.config.textos.resultado["0"];
  }
}

actions: {
  async cargarConfiguracion(),
  async cargarPreguntas(),
  iniciarJuego(),            // selecciona aleatoriamente, reinicia estado
  iniciarTemporizador(),
  detenerTemporizador(),
  responder(indiceOpcion: number),
  timeoutResponder(),        // se llama cuando el tiempo llega a 0
  siguientePregunta(),
  reiniciarJuego(),
}
```

### 4.3 Manejo del temporizador

- En `PantallaPregunta.vue`, al montarse se llama `store.iniciarTemporizador()`.
- Cada segundo se resta `tiempoRestante`. Si llega a 0, se llama `store.timeoutResponder()` (que registra error y cambia a pantalla Respuesta).
- Si el usuario responde antes, se detiene el temporizador con `store.detenerTemporizador()`.

---

## 5. Configuración PWA (offline con imágenes dinámicas)

### 5.1 `nuxt.config.ts` (extracto)

```typescript
pwa: {
  workbox: {
    globPatterns: ['**/*.{js,css,html,json,png,svg,jpg,gif}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
      },
      {
        // Cachear imágenes de opciones
        urlPattern: /\/images\/.*\.(png|jpg|svg)/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: { maxEntries: 50 },
        },
      },
      {
        // Cachear los JSON
        urlPattern: /\/data\/.*\.json/i,
        handler: 'CacheFirst',
      },
    ],
  },
}
```

> **Importante**: Las rutas de imágenes en `.preguntas.json` deben ser relativas a `public/` (ej: `/images/opcion1.png`). El Service Worker las interceptará y cacheará.

### 5.2 Carga inicial de datos

En el store, usar `fetch` para cargar los JSON desde rutas estáticas (ej: `/data/.preguntas.json`). Como están cacheados, funcionan offline.

---

## 6. Casos de prueba adicionales (tiempo e imágenes)

| ID | Caso | Resultado esperado |
|----|------|-------------------|
| TC-15 | Usuario no responde y se acaba el tiempo | Se muestra pantalla Respuesta con mensaje de error |
| TC-16 | Usuario responde antes del tiempo | El temporizador se detiene, se muestra Respuesta correcta/incorrecta |
| TC-17 | Imagen de opción no existe offline | Debe mostrar un placeholder (ícono de error) |
| TC-18 | Al terminar el juego con 5 aciertos (perfecto) | Muestra textos de resultado clave "5" |
| TC-19 | Al terminar con 3 aciertos (no existe clave "3") | Usa fallback "0" |

---

## 7. Entregables actualizados

- Código que carga `.preguntas.json` y `.cfg.json` desde la carpeta `public/data/` (o desde `/data`).
- Las imágenes de opciones deben incluirse en `public/images/`.
- El componente `PantallaPregunta` debe mostrar imagen + texto por cada opción (diseño grid flexible).
- El temporizador se implementa con `setInterval` y se limpia correctamente en `onUnmounted`.
- El README debe explicar cómo sustituir los archivos JSON y añadir nuevas imágenes.

---

## 9. Convenciones de diseño (extraídas de ref/)

### 9.1 Estructura HTML de cada pantalla

Todas las pantallas comparten la misma estructura base:

```
#pagina
  #encabezado
    .logo
      img(src="logo-upn.svg")
    .grupo.derecha          ← solo en pantalla Pregunta
      strong ETIQUETA
      span.tiempo 00:00
  #principal
    .panel / .panel.inverso  ← contenido textual
    .opciones                ← grid de opciones (solo pregunta)
  #pie                       ← botones de acción (solo portada, respuesta, resultado)
    button(type="button")
```

### 9.2 Layout y dimensiones

| Propiedad | Valor |
|-----------|-------|
| Aspect ratio | `9 / 16` (vertical, tipo kiosco) |
| Altura | `100vh` / `100dvh` |
| Ancho | `auto`, centrado con `margin-inline: auto` |
| Max-width | `100vw` |
| Font-size base | `2vh` (todo escala con viewport height) |
| Overflow | `hidden` en `#pagina` |

### 9.3 Paleta de colores

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-amarillo` | `#FDBA30` | Encabezado, pie, botones |
| `--color-lila` | `#9501FC` | Opción 1 |
| `--color-celeste` | `#10B5FB` | Opción 2 |
| `--color-fuchsia` | `#FC00D5` | Opción 3, timer urgente |
| `--color-negro` | `#000000` | Fondo body, opción 4, panel inverso |
| `--color-blanco` | `#FFFFFF` | Fondo #pagina, texto panel |
| `--color-gris` | `#808080` | Fondo .contenido |

### 9.4 Tipografía

| Elemento | Tamaño | Peso |
|----------|--------|------|
| `h1` | `7.2vh` | 900 (Black) |
| `h2` | `5vh` | 900 (Black) |
| `h3` | `3.6vh` | 700 (Bold) |
| `h4` | `3.6vh` | 400 (Book) |
| `p` | `2.6vh` | 400 (Book) |
| Botones | `3vh` | 700 (Bold) |
| Opciones | `2.5vh` | 700 (Bold) |
| Timer | `3vh` | 700 (Bold) |
| Timer label | `1.8vh` | 700 (Bold) |

**Fuente**: Sharp Grotesk (4 pesos: Light 300, Book 400, Bold 700, Black 900)
**Formatos**: woff2 (primario), woff (fallback)
**Estilo**: `text-wrap: balance`, `text-align: center`, `line-height: 1.1`

### 9.5 Componentes de UI

#### Encabezado (`#encabezado`)
- Fondo amarillo (`--color-amarillo`)
- Altura mínima: `10vh`
- Padding: `2.5vh`
- Logo UPN a la izquierda: altura `5vh`
- Grupo derecha (timer): alineado a la derecha, con label `strong` + `.tiempo`

#### Paneles (`.panel`)
- Fondo blanco, texto negro, centrado
- Padding: `2.5vh`, gap: `1vh`
- Variante `.inverso`: fondo negro, texto blanco

#### Opciones (`.opciones`)
- Grid 2x2: `grid-template-columns: 1fr 1fr`, `grid-template-rows: 1fr 1fr`
- Cada `.opcion`: grid con `grid-template-rows: 1fr auto`
- Colores por posición:
  - 1ra: lila (`#9501FC`)
  - 2da: celeste (`#10B5FB`)
  - 3ra: fuchsia (`#FC00D5`)
  - 4ta: negro (`#000000`)
- Texto: alineado arriba (`align-self: start`)
- Imagen: `12vh` cuadrada, `object-fit: contain`
- Padding: `2.5vh 1vh`
- Texto en mayúsculas, `text-wrap: balance`

#### Botones
- Fondo amarillo, texto negro
- Altura mínima: `10vh`
- Font-size: `3vh`, font-weight: 700
- Feedback `:active`: `filter: brightness(0.9)`

#### Timer (`.tiempo`)
- `font-variant-numeric: tabular-nums lining-nums` (evita salto de dígitos)
- Estado urgente (≤3s): color fuchsia + animación parpadeo

### 9.6 Transiciones

| Propiedad | Valor |
|-----------|-------|
| Enter | `0.2s ease-out`, de `opacity: 0` + `translateX(2vh)` |
| Leave | `0.15s ease-in`, a `opacity: 0` + `translateX(-2vh)` |
| Modo | `out-in` |

### 9.7 Convención de nombres

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| IDs | `#encabezado`, `#principal`, `#pie`, `#pagina` | Semánticos en español |
| Clases | `.panel`, `.opcion`, `.contenido` | Sustantivos en español |
| Modificadores | `.inverso`, `.derecha`, `.urgente` | Adjetivos |
| Componentes Vue | `PantallaPregunta`, `Temporizador` | PascalCase, español |
| Variables Stylus | `color-amarillo`, `ancho-tableta` | kebab-case, español |

### 9.8 Texto de la interfaz

- **Todo en MAYÚSCULAS** (títulos, opciones, botones, labels)
- Sin puntuación final en títulos ni botones
- Signos de exclamación en feedback (`¡RESPUESTA CORRECTA!`)
- Lenguaje motivacional y positivo

---

## 10. Comandos de construcción y prueba offline

```bash
# Generar la PWA
npm run generate

# Servir localmente para probar offline (desconectando red)
npx serve .output/public

# Construir para producción (óptimo)
npm run build
```
