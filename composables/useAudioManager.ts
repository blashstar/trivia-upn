import { Howl, Howler } from 'howler'
import { ref } from 'vue'

/**
 * Sound name type for all available game sounds
 */
type SoundName = 'correct' | 'incorrect' | 'results' | 'background'

/**
 * Maps sound names to their file paths in the public/sounds directory
 */
const soundMap: Record<SoundName, string> = {
  correct: '/sonido/efecto_bien.mp3',
  incorrect: '/sonido/efecto_mal.mp3',
  results: '/sonido/efecto_gana.mp3',
  background: '/sonido/background.mp3',
}

/**
 * Default volume levels for different sound types
 */
const defaultVolumes: Record<SoundName, number> = {
  correct: 0.7,
  incorrect: 0.7,
  results: 0.7,
  background: 0.3,
}

// Singleton state - shared across all components using this composable
let sounds: Record<SoundName, Howl> | null = null
const isMuted = ref(false)
const volume = ref(0.7)
let isBackgroundPlaying = false

/**
 * Initializes the Howl sound instances (singleton).
 * Safe to call multiple times - only initializes once.
 */
function initSounds(): void {
  if (sounds) return

  sounds = {} as Record<SoundName, Howl>

  for (const [name, src] of Object.entries(soundMap)) {
    const soundName = name as SoundName
    sounds[soundName] = new Howl({
      src: [src],
      volume: defaultVolumes[soundName],
      loop: soundName === 'background',
      html5: true, // Stream rather than load into memory for large files
      onloaderror: (_id, error) => {
        console.warn(`[AudioManager] Failed to load sound "${soundName}":`, error)
      },
      onplayerror: (_id, error) => {
        console.warn(`[AudioManager] Failed to play sound "${soundName}":`, error)
      },
    })
  }
}

/**
 * Vue 3 composable for managing game audio using howler.js.
 * Implements singleton pattern - all components share the same audio state.
 *
 * @example
 * ```ts
 * const { play, startBackground, toggleMute } = useAudioManager()
 *
 * // Play a sound effect
 * play('correct')
 *
 * // Start background music
 * startBackground()
 *
 * // Mute/unmute
 * toggleMute()
 * ```
 */
export function useAudioManager() {
  // Initialize sounds on first use
  initSounds()

  /**
   * Plays a sound effect by name.
   * Does nothing if muted or if sound hasn't been loaded.
   *
   * @param sound - Name of the sound to play ('correct' | 'incorrect' | 'results')
   */
  function play(sound: Exclude<SoundName, 'background'>): void {
    if (!sounds || isMuted.value) return
    sounds[sound]?.play()
  }

  /**
   * Starts playing the background music loop.
   * Does nothing if muted or if sound hasn't been loaded.
   */
  function startBackground(): void {
    if (!sounds || isMuted.value || isBackgroundPlaying) return
    isBackgroundPlaying = true
    sounds.background?.play()
  }

  /**
   * Stops the background music.
   */
  function stopBackground(): void {
    if (!sounds) return
    isBackgroundPlaying = false
    sounds.background?.stop()
  }

  /**
   * Toggles the mute state for all audio.
   * Updates the global Howler mute state.
   */
  function toggleMute(): void {
    isMuted.value = !isMuted.value
    Howler.mute(isMuted.value)
  }

  /**
   * Sets the global volume for all sounds.
   *
   * @param v - Volume level between 0 (silent) and 1 (full volume)
   */
  function setVolume(v: number): void {
    volume.value = Math.max(0, Math.min(1, v))
    Howler.volume(volume.value)
  }

  return {
    /** Whether all audio is currently muted */
isMuted,
    volume,
    isBackgroundPlaying,
    play,
    startBackground,
    stopBackground,
    toggleMute,
    setVolume,
  }
}
