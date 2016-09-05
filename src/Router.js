'use strict'

import React, {
  Component,
  PropTypes,
} from 'react'

import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  NavigationExperimental,
} from 'react-native'

let {
  CardStack: NavigationCardStack,
  Card: NavigationCard,
  Header: NavigationHeader,
} = NavigationExperimental

import TabBar from 'react-native-tab-navigator'
import Button from 'react-native-pure-button'

import stack from './stack'
import actionType from './actionType'

import {
  registeredScenes,
} from './registerScene'


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  disabledButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    opacity: 0.5,
  },
  headerSibling: {
    flex: 1,
    marginTop: NavigationHeader.HEIGHT,
  }
})

export let defaultSceneStyle = {
  navBarBackgroundColor: '#f7f7f7',
  navBarTextColor: '#333',
  navBarTextFontSize: 18,
  navBarButtonColor: '#007aff',
  navBarButtonFontSize: 16,
  navBarButtonDisabledColor: '#ccc',
  navBarButtonDisabledFontSize: 16,
  navBarButtonActiveOpacity: 0.5,
  navBarButtonDisabledActiveOpacity: 1,
  navBarHidden: false,
  navBarNoBorder: false,
  tabBarHidden: false,
  statusBarHidden: false,
  statusBarTextColorScheme: 'dark',
}

function getSceneStyle(staticSceneStyle, instanceSceneStyle) {
  return Object.assign({}, defaultSceneStyle, staticSceneStyle, instanceSceneStyle)
}

function getComponent(scene) {
  return registeredScenes[scene]
}

function getOriginalComponent(scene) {
  let Component = getComponent(scene)
  return Component.WrappedComponent || Component
}

export default class Router extends Component {

  static propTypes = {
    routerState: PropTypes.object.isRequired,
    route: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  }

  state = {
    timestamp: 0,
  }

  getCurrentScene() {
    return stack.getCurrentScene(this.props.routerState)
  }

  getCurrentSceneStyle() {
    let currentScene = this.getCurrentScene()
    let { sceneStyle } = getOriginalComponent(currentScene.key)
    return getSceneStyle(sceneStyle, currentScene.sceneStyle)
  }

  updateCurrentScene(data, needRefresh = true) {
    console.log('update scene', data, needRefresh)
    stack.updateCurrentScene(this.props.routerState, data)
    if (needRefresh) {
      this.refresh()
    }
  }

  refresh() {
    this.setState({
      timestamp: Date.now(),
    })
  }

  setTitle(title = '') {
    this.updateCurrentScene({
      sceneTitle: title,
    })
  }

  setButtons(buttons) {
    let data = { }
    if ('sceneLeftButtons' in buttons) {
      data.sceneLeftButtons = buttons.sceneLeftButtons
    }
    if ('sceneRightButtons' in buttons) {
      data.sceneRightButtons = buttons.sceneRightButtons
    }
    this.updateCurrentScene(data)
  }

  setRightButtons(rightButtons) {
    this.updateCurrentScene({
      sceneRightButtons: rightButtons,
    })
  }

  setTabBadge(badge, tabIndex) {
    let { routerState } = this.props
    let { tabs } = routerState
    if (tabs) {
      if (tabIndex == null) {
        tabIndex = tabs.index
      }
      tabs.routes[tabIndex].badge = badge
      this.refresh()
    }
  }

  showNavBar() {
    this.updateCurrentScene({
      navBarHidden: false,
    })
  }

  hideNavBar() {
    this.updateCurrentScene({
      navBarHidden: true,
    })
  }

  showTabBar() {
    this.setState({
      tabBarHidden: false,
    })
  }

  hideTabBar() {
    this.setState({
      tabBarHidden: true,
    })
  }

  switchToTab(tabIndex) {
    let { tabs } = this.props.routerState
    if (tabs) {
      let { route } = this.props
      route({
        type: actionType.TAB_CHANGE,
        tab: tabs.routes[tabIndex].key,
      })
    }
  }

  pop() {
    let { onBack } = this.props
    onBack()
  }

  popToRoot() {
    let { route } = this.props
    route({
      type: action.SCENE_JUMP,
      index: 0,
    })
  }

  push(data) {
    let { route } = this.props
    route({
      type: actionType.SCENE_PUSH,
      scene: data.scene,
      sceneTitle: data.sceneTitle,
      sceneStyle: data.sceneStyle,
      sceneProps: data.sceneProps,
      direction: data.direction,
    })
  }

  renderTitle = sceneProps => {

    let currentScene = this.getCurrentScene()
    let {
      key,
      sceneTitle,
    } = currentScene

    if (!sceneTitle) {
      sceneTitle = getOriginalComponent(key).sceneTitle
    }

    if (typeof sceneTitle === 'string') {
      let {
        navBarTextColor,
        navBarTextFontSize,
      } = this.getCurrentSceneStyle()
      return (
        <NavigationHeader.Title textStyle={{
          color: navBarTextColor,
          fontSize: navBarTextFontSize,
        }}>
          {sceneTitle}
        </NavigationHeader.Title>
      )
    }

  }

  renderButtons(buttons, sceneStyle) {
    if (Array.isArray(buttons) && buttons.length > 0) {

      let {
        navBarButtonColor,
        navBarButtonFontSize,
        navBarButtonDisabledColor,
        navBarButtonDisabledFontSize,
        navBarButtonActiveOpacity,
        navBarButtonDisabledActiveOpacity,
      } = sceneStyle

      return (
        <View style={styles.buttons}>
          {
            buttons.map(button => {
              let {
                id,
                title,
              } = button
              return (
                <Button
                  key={"button" + button.id}
                  style={styles.button}
                  activeOpacity={navBarButtonActiveOpacity}
                  textStyle={{
                    color: navBarButtonColor,
                    fontSize: navBarButtonFontSize,
                  }}
                  disabled={button.disabled}
                  disabledStyle={styles.disabledButton}
                  disabledActiveOpacity={navBarButtonDisabledActiveOpacity}
                  disabledTextStyle={{
                    color: navBarButtonDisabledColor,
                    fontSize: navBarButtonDisabledFontSize,
                  }}
                  onPress={() => {

                    stack.callCurrentScene(
                      this.props.routerState,
                      id
                    )

                  }}
                >
                  {button.icon || button.title}
                </Button>
              )
            })
          }
        </View>
      )
    }
  }

  renderLeftButtons = () => {

    let currentScene = this.getCurrentScene()
    let {
      key,
      sceneLeftButtons,
    } = currentScene

    if (!sceneLeftButtons) {
      sceneLeftButtons = getOriginalComponent(key).sceneLeftButtons
    }

console.log('renderLeftButtons')
    return this.renderButtons(
      sceneLeftButtons,
      this.getCurrentSceneStyle()
    )

  }

  renderRightButtons = () => {

    let currentScene = this.getCurrentScene()
    let {
      key,
      sceneRightButtons,
    } = currentScene

    if (!sceneRightButtons) {
      sceneRightButtons = getOriginalComponent(key).sceneRightButtons
    }
console.log('renderRightButtons')
    return this.renderButtons(
      sceneRightButtons,
      this.getCurrentSceneStyle()
    )

  }

  renderHeader = sceneProps => {

    let {
      navBarHidden,
      navBarBackgroundColor,
      navBarNoBorder,
      statusBarHidden,
      statusBarTextColorScheme,
    } = this.getCurrentSceneStyle()

    StatusBar.setHidden(statusBarHidden)

    if (!statusBarHidden) {
      StatusBar.setBarStyle(
        statusBarTextColorScheme === 'dark' ? 'default' : 'light-content'
      )
    }

    if (!navBarHidden) {
      let style = {
        backgroundColor: navBarBackgroundColor,
      }
      if (navBarNoBorder) {
        style.borderBottomWidth = 0
      }
      return (
        <NavigationHeader
          {...sceneProps}
          renderTitleComponent={this.renderTitle}
          renderLeftComponent={this.renderLeftButtons}
          renderRightComponent={this.renderRightButtons}
          style={style}
        />
      )
    }

  }

  renderScene = () => {

    let {
      navBarHidden,
    } = this.getCurrentSceneStyle()

    let {
      key,
      sceneProps = {},
    } = this.getCurrentScene()
console.log('renderScene')
    let Component = getComponent(key)
    let component = (
      <Component
        {...sceneProps}
        router={this}
        ref={ref => {
          if (ref) {
            this.updateCurrentScene({ ref }, false)
          }
        }}
      />
    )

    if (navBarHidden) {
      return component
    }

    return (
      <View style={styles.headerSibling}>
        {component}
      </View>
    )

  }

  renderStack(state, onBack) {
    let { timestamp } = this.state
    let direction = this.getCurrentScene().direction || 'horizontal'
    return (
      <NavigationCardStack
        timestamp={timestamp}
        direction={direction}
        onNavigateBack={onBack}
        navigationState={state}
        renderOverlay={this.renderHeader}
        renderScene={this.renderScene}
        style={styles.container}
      />
    )
  }

  renderTabs() {
    let { routerState, route, onBack } = this.props
    let { index, routes } = routerState.tabs
    return (
      <TabBar>
        {
          routes.map((item, i) => {
            return (
              <TabBar.Item
                key={item.scene}
                selected={i === index}

                title={item.title}
                titleStyle={item.titleStyle}
                selectedTitleStyle={item.selectedTitleStyle}
                renderTitle={item.renderTitle}

                badgeText={item.badge}
                renderBadge={item.renderBadge}

                renderIcon={item.renderIcon}

                style={item.style}
                selectedStyle={item.selectedStyle}

                onPress={() => route({
                  type: actionType.TAB_CHANGE,
                  tab: item.scene
                })}
              >
                {this.renderStack(routerState[item.scene], onBack)}
              </TabBar.Item>
            )
          })
        }
      </TabBar>
    )
  }

  render() {

    let {
      routerState,
      route,
      onBack,
    } = this.props

    let currentStack = stack.getCurrentStack(routerState)
    let stackElement = this.renderStack(currentStack, onBack)
console.log('render router')
    if (routerState.tabs) {

      let {
        tabBarHidden,
      } = this.getCurrentSceneStyle()

      return tabBarHidden
        ? stackElement
        : this.renderTabs()

    }
    else {
      return stackElement
    }
  }

}
