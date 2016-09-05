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

function getCurrentScene(routerState) {
  let currentStack = getCurrentStack(routerState)
  return currentStack.routes[currentStack.index]
}

function updateCurrentScene(routerState, data) {
  let currentScene = getCurrentScene(routerState)
  Object.assign(currentScene, data)
}

function getCurrentSceneRef(routerState) {
  let { ref } = getCurrentScene(routerState)
  if (ref && ref.getWrappedInstance) {
    ref = ref.getWrappedInstance()
  }
  return ref
}

function callCurrentScene(routerState, name) {
  let ref = getCurrentSceneRef(routerState)
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