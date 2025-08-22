import { connectToServer } from './socket-client'
import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websoccket-Client</h1>

    <span id="server-status">Offline</span>

    <form id="message-form">
      <input placeholder="message" id="message-input"/>

    </form>

  </div>
`
connectToServer();
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
