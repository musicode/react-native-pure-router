'use strict'

export let registeredScenes = { }

export default function registerScene(key, SceneComponent) {
  if (registeredScenes[key]) {
    console.warn(`Register scene ${key} conflict.`)
  }
  registeredScenes[key] = SceneComponent
}
