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

import Navigator from './Navigator'

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
    this.formatState(props)
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
    stack.callCurrentScene(this.state.navigation, 'componentWillFocus')
  }

  componentDidMount() {
    this.dispatchFocus()
    stack.callCurrentScene(this.state.navigation, 'componentDidFocus')
  }

  componentWillUpdate() {
    stack.callCurrentScene(this.state.navigation, 'componentWillFocus')
  }

  componentDidUpdate() {
    this.dispatchFocus()
    stack.callCurrentScene(this.state.navigation, 'componentDidFocus')
  }

  componentWillReceiveProps(nextProps) {
    this.formatState(nextProps)
  }

  formatState(props) {
    let navigation
    if (Array.isArray(props.tabs)) {
      let tabs = {
        index: 0,
        routes: [ ],
      }
      navigation = {
        tabs,
      }
      props.tabs.forEach((tab, index) => {
        let { scene, selected } = tab
        let current = { key: scene }
        tabs.routes.push({
          ...tab,
          ...current,
        })
        navigation[scene] = {
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
      navigation = {
        index: 0,
        routes: [
          {
            key: props.scene,
            appStyle: props.appStyle,
          }
        ],
      }
    }

    if (this.state) {
      this.setState({
        navigation,
      })
    }
    else {
      this.state = {
        navigation,
      }
    }

  }

  dispatchFocus() {
    let { dispatch } = this.props
    let { navigation } = this.state
    dispatch({
      type: actionType.SCENE_FOCUS,
      scene: stack.getCurrentScene(navigation).key,
    })
  }

  handleBackPress = () => {
    return this.navigate({
      type: actionType.SCENE_POP,
    })
  }

  navigate = action => {

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
      navigation,
    } = this.state

    let currentStack = stack.getCurrentStack(navigation)

    let getNavigationState = newStack => {
      if (newStack !== currentStack) {
        return stack.updateCurrentStack(navigation, newStack)
      }
      return newStack
    }

    switch (type) {
      case actionType.SCENE_PUSH:
        navigation = getNavigationState(
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
          navigation = getNavigationState(
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
          navigation = getNavigationState(newStack)
        }
        break

      case actionType.TAB_CHANGE:
        let newTabs = NavigationStateUtils.jumpTo(navigation.tabs, tab)
        if (newTabs !== navigation.tabs) {
          navigation = {
            ...navigation,
            tabs: newTabs,
          }
        }
        break
    }

// console.log(action, navigation)

    if (this.state.navigation !== navigation) {
      this.setState({ navigation })
      let { dispatch } = this.props
      if (typeof dispatch === 'function') {
        dispatch(action)
      }
      return true
    }

    return false

  }

  render() {
    let { navigation } = this.state
    return (
      <Navigator
        ref={ref => global.Navigator = ref}
        navigationState={navigation}
        navigate={this.navigate}
        onBack={this.handleBackPress}
      />
    )
  }

}
