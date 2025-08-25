import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
    extraHeaders: {
      authentication: token,
    },
  });
  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const serverStatusLabel = document.querySelector("#server-status")!;
  const clientesUl = document.querySelector("#clients-ul")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  const taskList = document.querySelector("#tasks-list")!;
  const completedCount = document.querySelector("#completed-count")!;
  const inProgressCount = document.querySelector("#in-progress-count")!;
  const delayedCount = document.querySelector("#delayed-count")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "disconnected";
  });

  socket.on(
    "clients-updated",
    (clients: { socketId: string; fullName: string; roles: string[] }[]) => {
      clientesUl.innerHTML = clients
        .map((c) => `<li>${c.fullName} (${c.roles.join(", ")})</li>`)
        .join("");
    }
  );

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;
    socket.emit("message-from-client", {
      message: messageInput.value,
    });

    messageInput.value = "";
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>
    `;
      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesUl.append(li);
    }
  );

  const updateDashboard = (task: { name: string; status: string }) => {
    const li = document.createElement("li");
    li.textContent = `${task.name} - ${task.status}`;
    li.classList.add(task.status.toLowerCase().replace(" ", "-"));
    taskList.appendChild(li);

    completedCount.textContent = taskList
      .querySelectorAll("li.completed")
      .length.toString();
    inProgressCount.textContent = taskList
      .querySelectorAll("li.in-progress")
      .length.toString();
    delayedCount.textContent = taskList
      .querySelectorAll("li.delayed")
      .length.toString();
  };
  const updateCounters = () => {
    completedCount.textContent = taskList
      .querySelectorAll("li.completed")
      .length.toString();
    inProgressCount.textContent = taskList
      .querySelectorAll("li.in-progress")
      .length.toString();
    delayedCount.textContent = taskList
      .querySelectorAll("li.delayed")
      .length.toString();
  };

  socket.on("task-created", (task) => {
    updateDashboard(task);
  });

  socket.on("task-updated", (task) => {
    // Buscar el li existente por nombre o id (si agregas id al li)
    const li = Array.from(taskList.children).find((el) =>
      el.textContent?.includes(task.name)
    );
    if (li) {
      li.textContent = `${task.name} - ${task.status}`;
      li.className = task.status.toLowerCase().replace(" ", "-");
    }
    // Actualizar contadores
    updateCounters();
  });

  socket.on("task-deleted", ({ id, name }) => {
    const li = Array.from(taskList.children).find((el) =>
      el.textContent?.includes(name)
    );
    if (li) li.remove();
    updateCounters();
  });
};
