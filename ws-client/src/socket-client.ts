// socket-client.ts
import { io, Socket } from "socket.io-client";
import { renderUI } from "./main";

let socket: Socket;

export const connectToServer = (token: string) => {
  socket = io("http://localhost:3000/ws", {
    extraHeaders: {
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
  socket.on("clients-updated", (clients: string[]) => {
    const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
    let clientsHtml = "";
    clients.forEach((clientId) => {
      clientsHtml += `<li>${clientId}</li>`;
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

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `<li><strong>${payload.fullName}:</strong> ${payload.message}</li>`;
      messagesUl.innerHTML = newMessage + messagesUl.innerHTML;
    }
  );

  // ==== TAREAS ====
  const taskForm = document.querySelector<HTMLFormElement>("#task-form")!;
  const tasksUl = document.querySelector<HTMLUListElement>("#tasks-ul")!;

  const totalTasksSpan = document.querySelector<HTMLSpanElement>(
    "#total-tasks"
  )!;
  const completedTasksSpan = document.querySelector<HTMLSpanElement>(
    "#completed-tasks"
  )!;
  const pendingTasksSpan =
    document.querySelector<HTMLSpanElement>("#pending-tasks")!;

  taskForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const name = (document.querySelector<HTMLInputElement>(
      "#task-name"
    )!).value;
    const description = (document.querySelector<HTMLInputElement>(
      "#task-desc"
    )!).value;
    const duration = (document.querySelector<HTMLInputElement>(
      "#task-duration"
    )!).value;
    const priority = (document.querySelector<HTMLSelectElement>(
      "#task-priority"
    )!).value;

    socket.emit("create-task", {
      name,
      description,
      duration,
      priority,
    });

    taskForm.reset();
  });

  // Escuchar tareas actualizadas
  socket.on("task-updated", (tasks: any[]) => {
    renderTasks(tasks);
  });

  // Escuchar tareas eliminadas
  socket.on("task-deleted", (tasks: any[]) => {
    renderTasks(tasks);
  });

  function renderTasks(tasks: any[]) {
    let html = "";
    let completed = 0;
    tasks.forEach((t) => {
      if (t.isCompleted) completed++;
      html += `<li>
          <strong>${t.name}</strong> - ${t.description} (${t.priority})
          [${t.isCompleted ? "✅" : "⏳"}]
        </li>`;
    });
    tasksUl.innerHTML = html;

    totalTasksSpan.innerText = tasks.length.toString();
    completedTasksSpan.innerText = completed.toString();
    pendingTasksSpan.innerText = (tasks.length - completed).toString();
  }

  socket.on("connect-succes", (payload) => {
    const { role} = payload
    renderUI(role)
  })
};
