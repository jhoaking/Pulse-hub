import { connectToServer } from './socket-client'
import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websoccket-Client</h1>

    <span>Offline</span>

  </div>
`
connectToServer();
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
