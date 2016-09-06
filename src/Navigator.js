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
  }
})

export let defaultAppStyle = {
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

function getAppStyle(staticAppStyle, instanceAppStyle) {
  return Object.assign({}, defaultAppStyle, staticAppStyle, instanceAppStyle)
}

function getComponent(scene) {
  return registeredScenes[scene]
}

function getOriginalComponent(scene) {
  let Component = getComponent(scene)
  return Component.WrappedComponent || Component
}

export default class Navigator extends Component {

  static propTypes = {
    navigationState: PropTypes.object.isRequired,
    navigate: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  }

  state = {
    timestamp: 0,
  }

  getCurrentScene() {
    return stack.getCurrentScene(this.props.navigationState)
  }

  getCurrentAppStyle() {
    let currentScene = this.getCurrentScene()
    let { appStyle } = getOriginalComponent(currentScene.key)
    return getAppStyle(appStyle, currentScene.appStyle)
  }

  updateCurrentScene(data, needRefresh = true) {
    // console.log('update scene', data, needRefresh)
    stack.updateCurrentScene(this.props.navigationState, data)
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
      title: title,
    })
  }

  setButtons(buttons) {
    this.updateCurrentScene(buttons)
  }

  setTabBadge(badge, tabIndex) {
    let { navigationState } = this.props
    let { tabs } = navigationState
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
    let { tabs } = this.props.navigationState
    if (tabs) {
      let { navigate } = this.props
      navigate({
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
    let { navigate } = this.props
    navigate({
      type: action.SCENE_JUMP,
      index: 0,
    })
  }

  push(data) {
    let { navigate } = this.props
    navigate({
      type: actionType.SCENE_PUSH,
      scene: data.scene,
      title: data.title,
      appStyle: data.appStyle,
      passProps: data.passProps,
      direction: data.direction,
    })
  }

  renderTitle = sceneProps => {

    let currentScene = this.getCurrentScene()
    let {
      key,
      title,
    } = currentScene

    if (!title) {
      title = getOriginalComponent(key).title
    }

    if (typeof title === 'string') {
      let {
        navBarTextColor,
        navBarTextFontSize,
      } = this.getCurrentAppStyle()
      return (
        <NavigationHeader.Title textStyle={{
          color: navBarTextColor,
          fontSize: navBarTextFontSize,
        }}>
          {title}
        </NavigationHeader.Title>
      )
    }

  }

  renderButtons(buttons, appStyle) {
    if (Array.isArray(buttons) && buttons.length > 0) {

      let {
        navBarButtonColor,
        navBarButtonFontSize,
        navBarButtonDisabledColor,
        navBarButtonDisabledFontSize,
        navBarButtonActiveOpacity,
        navBarButtonDisabledActiveOpacity,
      } = appStyle

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
                      this.props.navigationState,
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
      leftButtons,
    } = currentScene

    if (!leftButtons) {
      leftButtons = getOriginalComponent(key).leftButtons
    }

// console.log('renderLeftButtons')
    return this.renderButtons(
      leftButtons,
      this.getCurrentAppStyle()
    )

  }

  renderRightButtons = () => {

    let currentScene = this.getCurrentScene()
    let {
      key,
      rightButtons,
    } = currentScene

    if (!rightButtons) {
      rightButtons = getOriginalComponent(key).rightButtons
    }
// console.log('renderRightButtons')
    return this.renderButtons(
      rightButtons,
      this.getCurrentAppStyle()
    )

  }

  renderHeader = sceneProps => {

    let {
      navBarHidden,
      navBarBackgroundColor,
      navBarNoBorder,
      statusBarHidden,
      statusBarTextColorScheme,
    } = this.getCurrentAppStyle()

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
    } = this.getCurrentAppStyle()

    let {
      key,
      passProps = {},
    } = this.getCurrentScene()
// console.log('renderScene')
    let Component = getComponent(key)
    return (
      <Component
        {...passProps}
        navigator={this}
        ref={ref => {
          if (ref) {
            this.updateCurrentScene({ ref }, false)
          }
        }}
      />
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
        renderHeader={this.renderHeader}
        renderScene={this.renderScene}
        style={styles.container}
      />
    )
  }

  renderTabs() {
    let { navigationState, navigate, onBack } = this.props
    let { index, routes } = navigationState.tabs
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
                renderSelectedIcon={() => item.renderIcon(true)}

                style={item.style}
                selectedStyle={item.selectedStyle}

                onPress={() => navigate({
                  type: actionType.TAB_CHANGE,
                  tab: item.scene
                })}
              >
                {this.renderStack(navigationState[item.scene], onBack)}
              </TabBar.Item>
            )
          })
        }
      </TabBar>
    )
  }

  render() {

    let {
      navigationState,
      onBack,
    } = this.props

    let currentStack = stack.getCurrentStack(navigationState)
    let stackElement = this.renderStack(currentStack, onBack)
// console.log('render navigator')
    if (navigationState.tabs) {

      let {
        tabBarHidden,
      } = this.getCurrentAppStyle()

      return tabBarHidden
        ? stackElement
        : this.renderTabs()

    }
    else {
      return stackElement
    }
  }

}
