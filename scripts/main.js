import './Components/App.js'
import './Components/ConwayRenderer.js'
import './Components/Button.js'
import './Components/Icon.js'
import './Components/ConwayCanvas/ConwayCanvas.js'
import './modules/tools/components/Toolbox.js'
import { html } from 'https://unpkg.com/lit-element@2.2.1?module'
import { render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js?module'
import { store } from './store.js'
import { conway } from './workers/conway/conway.js'

const app = html`
<as-app .store=${store}></as-app>
`
render(
  app,
  document.body.appendChild(document.createElement('div')),
)

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
