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

import stack from './stack'
import actionType from './actionType'

export default class App extends Component {

  static propTypes = {
    tabs: PropTypes.array,
    scene: PropTypes.string,
    appStyle: PropTypes.object,
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
            appStyle: props.appStyle,
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

  componentWillMount() {
    stack.callCurrentScene(this.state.router, 'componentWillFocus')
  }

  componentDidMount() {
    stack.callCurrentScene(this.state.router, 'componentDidFocus')
  }

  componentWillUpdate() {
    stack.callCurrentScene(this.state.router, 'componentWillFocus')
  }

  componentDidUpdate() {
    stack.callCurrentScene(this.state.router, 'componentDidFocus')
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
      title,
      appStyle,
      passProps,
      direction,
    } = action

    let {
      router,
    } = this.state

    let currentStack = stack.getCurrentStack(router)

    let getRouter = newStack => {
      if (newStack !== currentStack) {
        return stack.updateCurrentStack(router, newStack)
      }
      return router
    }

    switch (type) {
      case actionType.SCENE_PUSH:
        router = getRouter(
          NavigationStateUtils.push(currentStack, {
            key: scene,
            title,
            appStyle,
            passProps,
            direction,
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
        let newTabs = NavigationStateUtils.jumpTo(router.tabs, tab)
        if (newTabs !== router.tabs) {
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
        dispatch({
          type: actionType.SCENE_FOCUS,
          scene: stack.getCurrentScene(router).key,
        })
      }
      return true
    }

    return false

  }

  render() {
    let { router } = this.state
    return (
      <Router
        ref={ref => global.Router = ref}
        routerState={router}
        route={this.route}
        onBack={this.handleBackPress}
      />
    )
  }

}
