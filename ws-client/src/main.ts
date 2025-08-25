import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>WebSocket Client & Dashboard</h1>

    <div id="connection">
      <input id="jwt-token" placeholder="JWT Token"/>
      <button id="btn-connect">Conectar</button>
      <span id="server-status">Offline</span>
    </div>

    <hr/>

    <div id="chat-section">
      <h2>Chat Global</h2>
      <form id="message-form">
        <input placeholder="message" id="message-input"/>
      </form>
      <ul id="messages-ul"></ul>
    </div>

    <hr/>

    <div id="dashboard-section">
      <h2>Dashboard de Tareas</h2>

      <div id="kpis">
        <div>Completadas: <span id="completed-count">0</span></div>
        <div>En progreso: <span id="in-progress-count">0</span></div>
        <div>Retrasadas: <span id="delayed-count">0</span></div>
      </div>

      <h3>Lista de tareas</h3>
      <ul id="tasks-list"></ul>

      <h3>Logs en vivo</h3>
      <ul id="logs-list"></ul>
    </div>
  </div>
`;

//connectToServer();
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
const jwtToken = document.querySelector<HTMLInputElement>("#jwt-token")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect.addEventListener("click", () => {
  if (jwtToken.value.trim().length <= 0)
    return alert("enter a valid jwt token");
  connectToServer(jwtToken.value.trim());
});
