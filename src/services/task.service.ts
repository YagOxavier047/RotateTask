import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, Subtask, Priority, TaskStatus } from "@/types/task";

const TASKS_COLLECTION = "tasks";

export const taskService = {
  // Criar nova tarefa
  async createTask(
    userId: string,
    data: {
      title: string;
      description: string;
      dueDate: Date;
      priority: Priority;
      status: TaskStatus;
    }
  ): Promise<string> {
    const taskData = {
      userId,
      title: data.title,
      description: data.description,
      dueDate: Timestamp.fromDate(data.dueDate),
      priority: data.priority,
      status: data.status,
      subtasks: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
    return docRef.id;
  },

  // Buscar todas as tarefas do usuário
  async getUserTasks(userId: string): Promise<Task[]> {
    const q = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate.toDate(),
        priority: data.priority,
        status: data.status,
        subtasks: data.subtasks || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task;
    });
  },

  // Buscar tarefa por ID
  async getTaskById(taskId: string): Promise<Task | null> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toDate(),
      priority: data.priority,
      status: data.status,
      subtasks: data.subtasks || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Task;
  },

  // Atualizar tarefa
  async updateTask(
    taskId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: Priority;
      status?: TaskStatus;
      subtasks?: Subtask[];
    }
  ): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    const updateData: DocumentData = {
      updatedAt: serverTimestamp(),
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.dueDate !== undefined) updateData.dueDate = Timestamp.fromDate(data.dueDate);
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.subtasks !== undefined) updateData.subtasks = data.subtasks;

    await updateDoc(docRef, updateData);
  },

  // Deletar tarefa
  async deleteTask(taskId: string): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  },

  // Adicionar sub-tarefa
  async addSubtask(taskId: string, title: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    const updatedSubtasks = [...task.subtasks, newSubtask];
    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  },

  // Alternar status de sub-tarefa
  async toggleSubtask(taskId: string, subtaskId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  },

  // Remover sub-tarefa
  async removeSubtask(taskId: string, subtaskId: string): Promise<void> {
    const task = await this.getTaskById(taskId);
    if (!task) throw new Error("Tarefa não encontrada");

    const updatedSubtasks = task.subtasks.filter((st) => st.id !== subtaskId);
    await this.updateTask(taskId, { subtasks: updatedSubtasks });
  },

  // Calcular progresso de sub-tarefas
  calculateProgress(subtasks: Subtask[]): number {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter((st) => st.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  },
};