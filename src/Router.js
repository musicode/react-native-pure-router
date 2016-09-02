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

import TabBar from 'react-native-pure-tabbar'
import Button from 'react-native-pure-button'

import * as actionType from './actionType'

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
  }
})

export const defaultSceneStyle = {
  navBarBackgroundColor: '#f7f7f7',
  navBarTextColor: '#000000',
  navBarTextFontSize: 20,
  navBarButtonColor: '#007aff',
  navBarButtonFontSize: 18,
  navBarButtonDisabledColor: '#ccc',
  navBarButtonDisabledFontSize: 18,
  navBarHidden: false,
  navBarNoBorder: false,
  tabBarHidden: false,
  statusBarHidden: false,
  statusBarTextColorScheme: 'dark',
}

function getSceneStyle(sceneStyle) {
  return Object.assign({}, defaultSceneStyle, sceneStyle)
}

export default class Router extends Component {

  static propTypes = {
    routerState: PropTypes.object.isRequired,
    route: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    this.currentScene = null
  }

  renderTitle = sceneProps => {

    let {
      sceneTitle,
      sceneStyle,
    } = registeredScenes[sceneProps.scene.route.key]

    if (typeof sceneTitle === 'string') {
      let {
        navBarTextColor,
        navBarTextFontSize,
      } = getSceneStyle(sceneStyle)
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
      } = getSceneStyle(sceneStyle)

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
                  disabled={button.disabled}
                  disabledTextStyle={{
                    color: navBarButtonDisabledColor,
                    fontSize: navBarButtonDisabledFontSize,
                  }}
                  textStyle={{
                    color: navBarButtonColor,
                    fontSize: navBarButtonFontSize,
                  }}
                  onPress={() => {
                    if (typeof this.currentScene[id] === 'function') {
                      this.currentScene[id]()
                    }
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

  renderLeftButtons = sceneProps => {

    let {
      sceneStyle,
      sceneLeftButtons,
    } = registeredScenes[sceneProps.scene.route.key]

    return this.renderButtons(sceneLeftButtons, sceneStyle)

  }

  renderRightButtons = sceneProps => {

    let {
      sceneStyle,
      sceneRightButtons,
    } = registeredScenes[sceneProps.scene.route.key]

    return this.renderButtons(sceneRightButtons, sceneStyle)

  }

  renderHeader = sceneProps => {
    let { sceneStyle } = registeredScenes[sceneProps.scene.route.key]

    let {
      navBarHidden,
      navBarBackgroundColor,
      navBarNoBorder,
      statusBarHidden,
      statusBarTextColorScheme,
    } = getSceneStyle(sceneStyle)

    if (statusBarHidden) {
      StatusBar.setHidden(statusBarHidden)
    }

    StatusBar.setBarStyle(
      statusBarTextColorScheme === 'dark' ? 'default' : 'light-content'
    )

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

  renderScene = sceneProps => {
    let Component = registeredScenes[sceneProps.scene.route.key]
    return (
      <Component ref={ref => {
        if (ref) {
          this.currentScene = ref
        }
      }}
      />
    )
  }

  render() {
    let {
      routerState,
      route,
      onBack,
    } = this.props
    if (routerState.tabs) {
      let { index, routes } = routerState.tabs
      let navigationState = routerState[routes[index].key]
      let { sceneStyle } = registeredScenes[
        navigationState.routes[navigationState.index].key
      ]

      let {
        tabBarHidden,
      } = getSceneStyle(sceneStyle)

      let tabBarElement
      if (!tabBarHidden) {
        tabBarElement = (
          <TabBar>
            {
              routes.map((item, i) => {
                return (
                  <TabBar.Item
                    key={item.key}
                    selected={i === index}

                    title={item.title}
                    titleStyle={item.titleStyle}
                    selectedTitleStyle={item.selectedTitleStyle}
                    renderTitle={item.renderTitle}

                    badge={item.badge}
                    renderBadge={item.renderBadge}

                    renderIcon={item.renderIcon}

                    style={item.style}
                    selectedsTyle={item.selectedStyle}

                    onPress={() => route({
                      type: actionType.TAB_CHANGE,
                      tab: item.key
                    })}
                  />
                )
              })
            }
          </TabBar>
        )
      }

      return (
        <View style={styles.container}>
          <NavigationCardStack
            onNavigateBack={onBack}
            navigationState={navigationState}
            renderOverlay={this.renderHeader}
            renderScene={this.renderScene}
            style={styles.container}
          />
          {tabBarElement}
        </View>
      )
    }
    else {
      return (
        <NavigationCardStack
          onNavigateBack={onBack}
          navigationState={routerState}
          renderOverlay={this.renderHeader}
          renderScene={this.renderScene}
        />
      )
    }
  }

}
