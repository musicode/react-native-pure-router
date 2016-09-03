'use strict'

import App from './src/App'
import registerScene from './src/registerScene'

import {
  defaultSceneStyle,
} from './src/Router'

import {
  SCENE_POP,
  SCENE_PUSH,
  SCENE_JUMP,
  TAB_CHANGE,
} from './src/actionType'

exports.App = App
exports.registerScene = registerScene
exports.defaultSceneStyle = defaultSceneStyle

exports.SCENE_POP = SCENE_POP
exports.SCENE_PUSH = SCENE_PUSH
exports.SCENE_JUMP = SCENE_JUMP
exports.TAB_CHANGE = TAB_CHANGE
