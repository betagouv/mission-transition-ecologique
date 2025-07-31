import Config from '../config'
import ConfigBaserow from '../configBaserow'

Config.loadDotEnv()
console.log(ConfigBaserow.THEME_ID)
