import "./style.css";
import { connectToServer } from "./socket-client";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Socket Client</h2>
    <input id="jwtToken" placeholder="JWT token"/>
    <button id="btn-connect">Conectar</button>
    <p id="server-status">offline</p>

   <h2>Estado: <span id="server-status">offline</span></h2>

  <h3>Usuarios conectados</h3>
  <ul id="clients-ul"></ul>

  <!-- CHAT -->
  <form id="message-form">
    <input id="message-input" placeholder="Escribe mensaje" />
    <button>Enviar</button>
  </form>
  <ul id="messages-ul"></ul>

  <!-- TAREAS -->
  <h3>Tareas</h3>
  <form id="task-form">
    <input id="task-name" placeholder="Nombre de tarea" />
    <input id="task-desc" placeholder="Descripción" />
    <input id="task-duration" placeholder="Duración (10m, 2h...)" />
    <select id="task-priority">
      <option value="low">low</option>
      <option value="medium">medium</option>
      <option value="high">high</option>
    </select>
    <button>Crear tarea</button>
  </form>

  <ul id="tasks-ul"></ul>

  <h3>Logs</h3>
<ul id="logs-ul"></ul>

<div id="alert-box" style="display:none; background:red; color:white; padding:10px; margin-top:10px;"></div>

  <!-- DASHBOARD -->
  <h3>Dashboard</h3>
  <p>Total: <span id="total-tasks">0</span></p>
  <p>Completadas: <span id="completed-tasks">0</span></p>
  <p>Pendientes: <span id="pending-tasks">0</span></p>
  </div>
`;

const jwtToken = document.querySelector<HTMLInputElement>("#jwtToken")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect.addEventListener("click", () => {
  if (jwtToken.value.trim().length <= 0) return alert("Ingrese un JWT válido");
  connectToServer(jwtToken.value.trim());
});
export function renderUI(role: string[]) {
  if (role.includes("admin")) {
    // Admin puede ver todo
    document.querySelector<HTMLFormElement>("#task-form")!.style.display =
      "block";
  } else {
    // Usuario normal: no puede crear tareas
    document.querySelector<HTMLFormElement>("#task-form")!.style.display =
      "none";
  }
}
