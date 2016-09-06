'use strict'

import App from './src/App'
import registerScene from './src/registerScene'

import {
  defaultAppStyle,
} from './src/Navigator'

import actionType from './src/actionType'

exports.App = App
exports.registerScene = registerScene
exports.defaultAppStyle = defaultAppStyle

Object.assign(exports, actionType)
