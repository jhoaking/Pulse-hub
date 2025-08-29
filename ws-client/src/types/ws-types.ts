export interface ConnectedClient {
  socketId: string;
  fullName: string;
  roels: string[];
}
export interface ChatMessage {
  fullName: string;
  message: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  duration: string;
  priority: PriorityTask;
  isCompleted: boolean;
}

type PriorityTask = "low" | "medium" | "high";
