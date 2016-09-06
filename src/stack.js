'use strict'

function getCurrentStackKey(navigationState) {
  if (navigationState.tabs) {
    let { index, routes } = navigationState.tabs
    return routes[index].key
  }
  else {
    return ''
  }
}

function getCurrentStack(navigationState) {
  let currentStackKey = getCurrentStackKey(navigationState)
  if (currentStackKey) {
    return navigationState[currentStackKey]
  }
  return navigationState
}

function updateCurrentStack(navigationState, newStack) {
  let currentStackKey = getCurrentStackKey(navigationState)
  if (currentStackKey) {
    return {
      ...navigationState,
      [currentStackKey]: newStack
    }
  }
  return newStack
}

function getCurrentScene(navigationState) {
  let currentStack = getCurrentStack(navigationState)
  return currentStack.routes[currentStack.index]
}

function updateCurrentScene(navigationState, data) {
  let currentScene = getCurrentScene(navigationState)
  Object.assign(currentScene, data)
}

function getCurrentSceneRef(navigationState) {
  let { ref } = getCurrentScene(navigationState)
  if (ref && ref.getWrappedInstance) {
    ref = ref.getWrappedInstance()
  }
  return ref
}

function callCurrentScene(navigationState, name) {
  let ref = getCurrentSceneRef(navigationState)
  if (ref && ref[name]) {
    ref[name]()
  }
}


module.exports = {
  getCurrentStack,
  updateCurrentStack,
  getCurrentScene,
  updateCurrentScene,
  callCurrentScene,
}