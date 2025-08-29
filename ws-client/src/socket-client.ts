import { io, Socket } from "socket.io-client";
import { renderUI } from "./main";
import type { ChatMessage, ConnectedClient, Task } from "./types/ws-types";

let socket: Socket;
let currentRoles: string[] = [];

export const connectToServer = (token: string) => {
  socket = io("http://localhost:3000/", {
    auth: {
      authentication: token,
    },
  });

  // Estado de conexión
  socket.on("connect", () => {
    document.querySelector<HTMLParagraphElement>("#server-status")!.innerText =
      "online";
  });

  socket.on("disconnect", () => {
    document.querySelector<HTMLParagraphElement>("#server-status")!.innerText =
      "offline";
  });

  // Lista de usuarios conectados
  socket.on("clients-updated", (clients: ConnectedClient[]) => {
    const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
    let clientsHtml = "";
    clients.forEach((client) => {
      clientsHtml += `<li>${client.fullName || client.socketId}</li>`;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  // ==== CHAT ====
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  messageForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (messageInput.value.trim().length === 0) return;
    socket.emit("message-from-client", { message: messageInput.value });
    messageInput.value = "";
  });

  socket.on("message-from-server", (payload: ChatMessage) => {
    const newMessage = `<li><strong>${payload.fullName}:</strong> ${payload.message}</li>`;
    messagesUl.innerHTML = newMessage + messagesUl.innerHTML;
  });

  // ==== TAREAS ====
  const taskForm = document.querySelector<HTMLFormElement>("#task-form")!;
  const tasksUl = document.querySelector<HTMLUListElement>("#tasks-ul")!;

  const totalTasksSpan =
    document.querySelector<HTMLSpanElement>("#total-tasks")!;
  const completedTasksSpan =
    document.querySelector<HTMLSpanElement>("#completed-tasks")!;
  const pendingTasksSpan =
    document.querySelector<HTMLSpanElement>("#pending-tasks")!;

  taskForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = document.querySelector<HTMLInputElement>("#task-name")!.value;
    const description =
      document.querySelector<HTMLInputElement>("#task-desc")!.value;
    const duration =
      document.querySelector<HTMLInputElement>("#task-duration")!.value;
    const priority =
      document.querySelector<HTMLSelectElement>("#task-priority")!.value;

    socket.emit("create-task", {
      name,
      description,
      duration,
      priority,
    });

    taskForm.reset();
  });

  // Escuchar tareas actualizadas
  socket.on("task-updated", (task: Task) => {
    const li = document.querySelector<HTMLLIElement>(
      `li[data-id="${task.id}"]`
    );
    if (li) {
      li.outerHTML = taskItemHTML(task); // remplaza el <li> entero
    }
  });

  // Escuchar tareas eliminadas
  socket.on("task-deleted", (tasks: Task[]) => {
    tasks.forEach((t) => {
      const li = document.querySelector<HTMLLIElement>(`li[data-id="${t.id}"]`);
      if (li) li.remove();
    });
  });

  socket.on("task-list", (tasks: Task[]) => {
    renderTasks(tasks);
  });

  function taskItemHTML(t: Task) {
    let buttons = "";
    if (!t.isCompleted) {
      // todos pueden marcar completada
      buttons += `<button class="mark-done" data-id="${t.id}">✔</button>`;
    }
    if (currentRoles.includes("admin")) {
      // solo admin puede eliminar
      buttons += `<button class="delete-task" data-id="${t.id}">🗑</button>`;
    }

    return `<li data-id="${t.id}">
      <strong>${t.name}</strong> - ${t.description} (${t.priority})
      [${t.isCompleted ? "✅" : "⏳"}]
      ${buttons}
    </li>`;
  }

  function renderTasks(tasks: Task[]) {
    let html = "";
    let completed = 0;
    tasks.forEach((t) => {
      if (t.isCompleted) completed++;
      html += taskItemHTML(t);
    });
    tasksUl.innerHTML = html;
  }

  socket.on(
    "dashboard-update",
    (data: { total: number; completed: number; pending: number }) => {
      totalTasksSpan.innerText = data.total.toString();
      completedTasksSpan.innerText = data.completed.toString();
      pendingTasksSpan.innerText = data.pending.toString();
    }
  );

  // Escuchar clicks en tareas (marcar completada / eliminar)
  tasksUl.addEventListener("click", (ev) => {
    const target = ev.target as HTMLElement;
    if (target.classList.contains("mark-done")) {
      const id = target.dataset.id!;
      socket.emit("update-task", {
        taskId: id,
        content: { isCompleted: true },
      });
    }
    if (target.classList.contains("delete-task")) {
      const id = target.dataset.id!;
      socket.emit("deleted-task", { taskId: id });
    }
  });

  socket.on("connect-success", (payload: { role: string[] }) => {
    currentRoles = payload.role;
    renderUI(payload.role);
  });
};
