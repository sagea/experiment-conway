import './Components/App.js'
import './Components/ConwayRenderer.js'
import './Components/TableForm.js'
import './Components/Button.js'
import { html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { render } from 'https://unpkg.com/lit-html@1.1.2/lit-html.js?module';
import { store } from './store.js'

render(
  html `<as-app .store=${store}></as-app>`,
  document.body,
)


let lastConwayTime = 0;
const animate = (time) => {
	const { playing, speed } = store.getState();
  if (playing && (time - lastConwayTime) > speed) {
  	lastConwayTime = time
    store.actions.conwayFrameLite()
  } 
	requestAnimationFrame(animate)
}
animate()
