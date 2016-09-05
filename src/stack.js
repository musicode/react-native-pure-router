'use strict'

function getCurrentStackKey(routerState) {
  if (routerState.tabs) {
    let { index, routes } = routerState.tabs
    return routes[index].key
  }
  else {
    return ''
  }
}

function getCurrentStack(routerState) {
  let currentStackKey = getCurrentStackKey(routerState)
  if (currentStackKey) {
    return routerState[currentStackKey]
  }
  return routerState
}

function getCurrentScene(routerState) {
  let currentStack = getCurrentStack(routerState)
  return currentStack.routes[currentStack.index]
}

function getCurrentSceneRef(routerState) {
  let { ref } = getCurrentScene(routerState)
  if (ref && ref.getWrappedInstance) {
    ref = ref.getWrappedInstance()
  }
  return ref
}

function updateCurrentScene(routerState, data) {
  let currentScene = getCurrentScene(routerState)
  Object.assign(currentScene, data)
}

function updateCurrentStack(routerState, newStack) {
  let currentStackKey = getCurrentStackKey(routerState)
  if (currentStackKey) {
    return {
      ...routerState,
      [currentStackKey]: newStack
    }
  }
  return newStack
}


module.exports = {
  getCurrentStack,
  updateCurrentStack,
  getCurrentScene,
  getCurrentSceneRef,
  updateCurrentScene,
}