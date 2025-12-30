'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addMonths, subMonths } from 'date-fns';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Win95Button } from '@/components/Win95Button';
import { CalendarGrid } from '@/components/CalendarGrid';
import { TodoDialog } from '@/components/TodoDialog';
import { AddTodoDialog } from '@/components/AddTodoDialog';
import { DayTodosModal } from '@/components/DayTodosModal';
import { storage } from '@/lib/storage';
import { Todo, User } from '@/lib/types';
import { getCalendarDays, formatDisplayDate, formatDate } from '@/lib/date-utils';

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showTodoDialog, setShowTodoDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadTodos();
  }, [router]);

  useEffect(() => {
    updateAppBadge();
  }, [todos]);

  const loadTodos = () => {
    setTodos(storage.getTodos());
  };

  const updateAppBadge = () => {
    if ('setAppBadge' in navigator) {
      const today = formatDate(new Date());
      const todayTodos = todos.filter((t) => t.date === today && !t.completed);
      if (todayTodos.length > 0) {
        (navigator as any).setAppBadge(todayTodos.length);
      } else {
        (navigator as any).clearAppBadge();
      }
    }
  };

  const handleLogout = () => {
    storage.removeUser();
    router.push('/login');
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDate(date));
    setShowAddDialog(true);
  };

  const handleMoreClick = (date: string) => {
    setSelectedDate(date);
    setShowDayModal(true);
  };

  const handleTodoClick = (todo: Todo) => {
    // Fetch fresh data from storage to ensure latest state
    const todos = storage.getTodos();
    const freshTodo = todos.find(t => t.id === todo.id) || todo;

    setSelectedTodo(freshTodo);
    setShowTodoDialog(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const todoId = active.id as string;
    const newDate = over.id as string;

    // Update the todo's date in storage
    storage.updateTodo(todoId, { date: newDate });
    loadTodos();
  };

  const days = getCalendarDays(currentMonth);

  const todosByDate = todos.reduce((acc, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {} as { [date: string]: Todo[] });

  if (!user) {
    return null;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((t) => t.id)}>
        <div className="min-h-screen p-2 md:p-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Header */}
            <div className="win95-panel p-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-lg font-bold">Scheduler 97</h1>
                  <p className="text-xs">User: {user.name}</p>
                </div>
                <Win95Button onClick={handleLogout} className="text-xs">
                  Logout
                </Win95Button>
              </div>

              {/* Month navigation */}
              <div className="flex items-center justify-between gap-2">
                <Win95Button onClick={handlePrevMonth} className="px-2">
                  &lt;
                </Win95Button>
                <h2 className="text-sm font-bold flex-1 text-center">
                  {formatDisplayDate(currentMonth)}
                </h2>
                <Win95Button onClick={handleNextMonth} className="px-2">
                  &gt;
                </Win95Button>
              </div>
            </div>

            {/* Calendar */}
            <CalendarGrid
              days={days}
              currentMonth={currentMonth}
              todosByDate={todosByDate}
              onDateClick={handleDateClick}
              onMoreClick={handleMoreClick}
              onTodoClick={handleTodoClick}
            />

            {/* Add Task Button */}
            <div className="flex justify-center">
              <Win95Button
                onClick={() => {
                  setSelectedDate(formatDate(new Date()));
                  setShowAddDialog(true);
                }}
                variant="primary"
                className="px-8"
              >
                Add New Task
              </Win95Button>
            </div>
          </div>
        </div>

        {/* Modals and Dialogs */}
        {selectedDate && (
          <>
            <AddTodoDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              date={selectedDate}
              onAdd={loadTodos}
            />
            <DayTodosModal
              open={showDayModal}
              onOpenChange={setShowDayModal}
              date={selectedDate}
              todos={todosByDate[selectedDate] || []}
              onTodoClick={handleTodoClick}
            />
          </>
        )}
        {selectedTodo && (
          <TodoDialog
            open={showTodoDialog}
            onOpenChange={(open) => {
              setShowTodoDialog(open);
              if (!open) {
                // Reset selectedTodo when dialog closes
                setTimeout(() => setSelectedTodo(null), 200);
              }
            }}
            todo={selectedTodo}
            onUpdate={loadTodos}
          />
        )}
      </SortableContext>
    </DndContext>
  );
}
