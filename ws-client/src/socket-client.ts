import { Manager, Socket } from "socket.io-client";

let socket: Socket;
const serverStatus = document.querySelector("#server-status")!;
const clientsUl = document.querySelector("#clients-ul")!;
const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
const messageInput = document.querySelector<HTMLInputElement>("#message-input")!;
const messagesUl = document.querySelector("#messages-ul")!;
const taskForm = document.querySelector<HTMLFormElement>("#task-form")!;
const taskInput = document.querySelector<HTMLInputElement>("#task-name")!;
const taskList = document.querySelector<HTMLUListElement>("#tasks-ul")!;
const totalTasks = document.querySelector("#total-tasks")!;
const completedTasks = document.querySelector("#completed-tasks")!;
const pendingTasks = document.querySelector("#pending-tasks")!;


//   Funciones helpers

const updateClients = (clients: string[]) => {
  clientsUl.innerHTML = "";
  clients.forEach((clientId) => {
    const li = document.createElement("li");
    li.textContent = clientId;
    clientsUl.appendChild(li);
  });
};

const createTaskElement = (task: { id: string; name: string; status: string }) => {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  li.textContent = `${task.name} - ${task.status}`;
  li.classList.add(task.status.toLowerCase().replace(" ", "-"));
  return li;
};

const updateCounters = () => {
  const tasks = taskList.querySelectorAll("li");
  const total = tasks.length;
  const completed = Array.from(tasks).filter((t) =>
    t.classList.contains("completed")
  ).length;
  const pending = total - completed;

  totalTasks.textContent = total.toString();
  completedTasks.textContent = completed.toString();
  pendingTasks.textContent = pending.toString();
};


//   Conexión WS

export const connectToServer = (token: string) => {
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
    extraHeaders: {
      authentication: token,
    },
  });

  socket?.removeAllListeners();
  socket = manager.socket("/");
 
  //   Eventos del server
  
  socket.on("connect", () => {
    serverStatus.textContent = "online";
  });

  socket.on("disconnect", () => {
    serverStatus.textContent = "offline";
  });

  socket.on("clients-updated", updateClients);

  socket.on("message-from-server", (payload: { fullName: string; message: string }) => {
    const li = document.createElement("li");
    li.textContent = `${payload.fullName}: ${payload.message}`;
    messagesUl.appendChild(li);
  });

  socket.on("task-created", (task: { id: string; name: string; status: string }) => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
    updateCounters();
  });

  socket.on("task-updated", (task: { id: string; name: string; status: string }) => {
    const li = taskList.querySelector<HTMLLIElement>(`[data-id="${task.id}"]`);
    if (li) {
      li.textContent = `${task.name} - ${task.status}`;
      li.className = "";
      li.classList.add(task.status.toLowerCase().replace(" ", "-"));
    }
    updateCounters();
  });

  socket.on("task-deleted", (task: { id: string }) => {
    const li = taskList.querySelector<HTMLLIElement>(`[data-id="${task.id}"]`);
    if (li) li.remove();
    updateCounters();
  });

  socket.on("error", (error) => {
    alert(error.message || "Error desconocido");
  });

  
  //   Formularios

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", { message: messageInput.value });
    messageInput.value = "";
  });

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (taskInput.value.trim().length <= 0) return;

    socket.emit("create-task", { name: taskInput.value, status: "Pending" });
    taskInput.value = "";
  });
};
