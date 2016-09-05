# react-native-pure-router

## router state

tabs

```
{
  tabs: {
    index: 0,
    routes: [
      {key: 'apple'},
      {key: 'banana'},
      {key: 'orange'},
    ]
  },
  apple: {
    index: 0,
    routes: [
      {key: 'Apple Home'}
    ],
  },
  banana: {
    index: 0,
    routes: [
      {key: 'Banana Home'}
    ],
  },
  orange: {
    index: 0,
    routes: [
      {key: 'Orange Home'}
    ],
  },
}
```

notabs

```
{
  index: 0,
  routes: [

  ]
}
```

## Scene Constant

`scenes.js`

```javascript
export const SCENE_LOGIN = ''
export const SCENE_LOGIN_TITLE = 'Login'
export const SCENE_REGISTER = ''
export const SCENE_REGISTER_TITLE = 'Register'
export const SCENE_HOME = ''
export const SCENE_HOME_TITLE = 'Home'
...
```

## Scene Component
```javascript
import {
  Scene,
  action,
} from 'react-native-pure-router'

import {
  SCENE_HOME,
  SCENE_HOME_TITLE,
} from './scene'

class LoginScene extends Scene {
  // optional, override by pushScene title param
  static sceneTitle = ''

  // navigation bar buttons
  static sceneButtons = {
    leftButtons: [
      {
        title: 'Back',
        id: 'back'
      }
    ],
    rightButtons: [
      {
        title: 'Login',
        id: 'login'
      }
    ]
  }

  onWillFocus() {
    console.log('scene will focus')
  }
  onDidFocus() {
    console.log('scene did focus')
  }

  handleLoginPress = () => {
    this.route({
      type: action.PUSH,
      name: SCENE_HOME,
      title: SCENE_HOME_TITLE,
      passProps: {
        username: 'musicode',
      }
    })
  }

  render() {
    return (
      <Button
        onPress={this.handleLoginPress}
      >
        Login
      </Button>
    )
  }
}

```

## Register Scenes

```
import { registerScene } from 'react-native-pure-router'

// import scene constant
import {
  SCENE_LOGIN,
  SCENE_REGISTER,
  SCENE_HOME,
} from './scenes'

// import scene component
import LoginScene from 'LoginScene'
import RegisterScene from 'RegisterScene'
import HomeScene from 'HomeScene'

// register constant -> component
registerScene(SCENE_LOGIN, LoginScene)
registerScene(SCENE_REGISTER, RegisterScene)
registerScene(SCENE_HOME, HomeScene)
```
