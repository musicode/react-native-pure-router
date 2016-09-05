'use strict'

import App from './src/App'
import registerScene from './src/registerScene'

import {
  defaultSceneStyle,
} from './src/Router'

import actionType from './src/actionType'

exports.App = App
exports.registerScene = registerScene
exports.defaultSceneStyle = defaultSceneStyle

Object.assign(exports, actionType)
