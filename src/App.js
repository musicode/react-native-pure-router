'use strict'

import React, {
  Component,
  PropTypes,
} from 'react'

import {
  Platform,
  BackAndroid,
  NavigationExperimental,
} from 'react-native'

let {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental

import Router from './Router'
import * as actionType from './actionType'

export default class App extends Component {

  static propTypes = {
    tabs: PropTypes.array,
    scene: PropTypes.string,
    sceneStyle: PropTypes.object,
    dispatch: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)

    let router
    if (Array.isArray(props.tabs)) {
      let tabs = {
        index: 0,
        routes: [ ],
      }
      router = {
        tabs,
      }
      props.tabs.forEach((tab, index) => {
        let { scene, selected } = tab
        let current = { key: scene }
        tabs.routes.push({
          ...tab,
          ...current,
        })
        router[scene] = {
          index: 0,
          routes: [
            current
          ],
        }
        if (selected) {
          tabs.index = index
        }
      })
    }
    else {
      router = {
        index: 0,
        routes: [
          {
            key: props.scene,
            sceneStyle: props.sceneStyle,
          }
        ],
      }
    }

    this.state = {
      router,
    }

    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.handleBackPress)
    }
  }

  handleBackPress = () => {
    return this.route({
      type: actionType.SCENE_POP,
    })
  }

  route = action => {

    let {
      type,
      tab,
      index,
      scene,
      sceneTitle,
      sceneStyle,
    } = action

    let {
      router,
    } = this.state

    let currentStackKey
    let currentStack = router

    let { tabs } = router
    if (tabs) {
      currentStackKey = tabs.routes[tabs.index].key
      currentStack = router[currentStackKey]
    }

    let getRouter = newStack => {
      if (newStack !== currentStack) {
        if (currentStackKey) {
          return {
            ...router,
            [currentStackKey]: newStack,
          }
        }
        else {
          return newStack
        }
      }
      return router
    }

    switch (type) {
      case actionType.SCENE_PUSH:
        router = getRouter(
          NavigationStateUtils.push(currentStack, {
            key: scene,
            sceneTitle,
            sceneStyle,
          })
        )
        break

      case actionType.SCENE_POP:
        if (currentStack.index > 0) {
          router = getRouter(
            NavigationStateUtils.pop(currentStack)
          )
        }
        break

      case actionType.SCENE_JUMP:
        let newStack
        if (scene) {
          newStack = NavigationStateUtils.jumpTo(currentStack, scene)
        }
        else if (index != null) {
          newStack = NavigationStateUtils.jumpToIndex(currentStack, index)
        }
        if (newStack) {
          router = getRouter(newStack)
        }
        break

      case actionType.TAB_CHANGE:
        let newTabs = NavigationStateUtils.jumpTo(tabs, tab)
        if (newTabs !== tabs) {
          router = {
            ...router,
            tabs: newTabs,
          }
        }
        break
    }

console.log(action, router)
    if (this.state.router !== router) {
      this.setState({ router })
      let { dispatch } = this.props
      if (typeof dispatch === 'function') {
        dispatch(action)
      }
      return true
    }

    return false

  }

  render() {
    let { router } = this.state
    return (
      <Router
        routerState={router}
        route={this.route}
        onBack={this.handleBackPress}
      />
    )
  }

}
