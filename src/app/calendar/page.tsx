"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import CalendarComponent from "@/components/CalendarComponent";
import { Loader2 } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { EventInput, EventClickArg } from "@fullcalendar/core";

interface TaskData {
  title: string;
  description?: string;
  dueDate?: {
    toDate: () => Date;
  };
  priority: string;
  status: string;
}

// ✅ Função auxiliar FORA do componente (não causa re-render)
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#3b82f6";
  }
};

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Redirecionamento se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // ✅ Busca de tarefas - useEffect separado
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const tasksRef = collection(db, "tasks");
        const q = query(tasksRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const calendarEvents: EventInput[] = querySnapshot.docs.map((doc) => {
          const task = doc.data() as TaskData;
          return {
            id: doc.id,
            title: task.title,
            start: task.dueDate?.toDate(),
            backgroundColor: getPriorityColor(task.priority),
            borderColor: getPriorityColor(task.priority),
            extendedProps: {
              description: task.description,
              priority: task.priority,
              status: task.status,
            },
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]); // ✅ Apenas user como dependência

  const handleEventClick = (clickInfo: EventClickArg) => {
    const task = clickInfo.event;
    alert(`Tarefa: ${task.title}\nDescrição: ${task.extendedProps.description || "N/A"}`);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendário de Tarefas</h1>
        <CalendarComponent events={events} onEventClick={handleEventClick} />
      </div>
    </div>
  );
}