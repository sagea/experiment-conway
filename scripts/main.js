import './Components/App.js'
import './Components/ConwayRenderer.js'
import './Components/Button.js'
import './Components/Icon.js'
import './Components/ConwayCanvas/ConwayCanvas.js'
import './modules/tools/components/Toolbox.js'
import { store } from './store.js'
import { conway } from './workers/conway/conway.js'

document.body.appendChild(document.createElement('as-app'))
let lastConwayTime = 0
const animate = async time => {
  const { playing, speed, randomForm: { variation, size }} = store.getState()
  if (playing && time - lastConwayTime > speed) {
    lastConwayTime = time
    const table = await conway()
    store.actions.setTable({ table })
  }
  requestAnimationFrame(animate)
}

animate()
