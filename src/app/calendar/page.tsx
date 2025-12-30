'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addMonths, subMonths } from 'date-fns';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { Win95Button } from '@/components/Win95Button';
import { Win95ConfirmDialog } from '@/components/Win95ConfirmDialog';
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
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadTodos();

    // Request notification permission for badge support (iOS)
    requestNotificationPermission();
  }, [router]);

  useEffect(() => {
    updateAppBadge();
  }, [todos]);

  const loadTodos = () => {
    setTodos(storage.getTodos());
  };

  const requestNotificationPermission = async () => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check current permission state
    const permission = Notification.permission;

    if (permission === 'default') {
      // Show Win95 style dialog to explain why we need permission
      setShowPermissionDialog(true);
    } else if (permission === 'granted') {
      console.log('Notification permission already granted');
    } else if (permission === 'denied') {
      console.log('Notification permission denied');
    }
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted!');
        updateAppBadge();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setShowPermissionDialog(false);
    }
  };

  const updateAppBadge = () => {
    console.log('=== Badge Update Debug ===');
    console.log('Navigator object:', navigator);
    console.log('Has setAppBadge?', 'setAppBadge' in navigator);
    console.log('Notification permission:', Notification?.permission);

    // Check if Badge API is supported
    if (!('setAppBadge' in navigator)) {
      console.warn('❌ Badge API not supported on this browser/OS');
      console.log('Browser:', (navigator as any).userAgent);
      return;
    }

    try {
      const today = formatDate(new Date());
      const todayTodos = todos.filter((t) => t.date === today && !t.completed);

      console.log('Today:', today);
      console.log('All todos:', todos.length);
      console.log('Today todos:', todayTodos);
      console.log('Incomplete today:', todayTodos.length);

      if (todayTodos.length > 0) {
        (navigator as any).setAppBadge(todayTodos.length)
          .then(() => {
            console.log(`✅ Badge set successfully: ${todayTodos.length}`);
          })
          .catch((err: any) => {
            console.error('❌ Failed to set badge:', err);
          });
      } else {
        (navigator as any).clearAppBadge()
          .then(() => {
            console.log('✅ Badge cleared successfully');
          })
          .catch((err: any) => {
            console.error('❌ Failed to clear badge:', err);
          });
      }
    } catch (error) {
      console.error('❌ Error in updateAppBadge:', error);
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
    let newDate = over.id as string;

    console.log('🔄 Drag End:', { todoId, overId: over.id });

    // Get current todos from storage (source of truth)
    const currentTodos = storage.getTodos();
    const todoToMove = currentTodos.find(t => t.id === todoId);

    // Check if over.id is a todo ID (dropped on another todo) or a date string (dropped on empty space)
    // If it's a todo ID, find that todo and use its date
    const targetTodo = currentTodos.find(t => t.id === newDate);
    if (targetTodo) {
      newDate = targetTodo.date;
      console.log('📍 Dropped on todo, using its date:', newDate);
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(newDate)) {
      console.log('❌ Invalid date format:', newDate);
      return;
    }

    console.log('📋 Todo to move:', todoToMove);
    console.log('📅 New date:', newDate);
    console.log('📊 All todos before update:', currentTodos.length);

    // If the date is the same or todo not found, no need to update
    if (!todoToMove) {
      console.log('❌ Todo not found');
      return;
    }

    if (todoToMove.date === newDate) {
      console.log('⏭️ Skipping: same date');
      return;
    }

    // Create updated todos array
    const updatedTodos = currentTodos.map(t =>
      t.id === todoId ? { ...t, date: newDate } : t
    );

    console.log('📊 All todos after update:', updatedTodos.length);
    console.log('📅 Todos by date:', updatedTodos.reduce((acc, t) => {
      acc[t.date] = (acc[t.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>));

    // Update storage with the new todos array
    storage.setTodos(updatedTodos);

    // Reload from storage to ensure UI is in sync
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

  // Debug: Log todosByDate and check for date format issues
  console.log('📊 Total todos:', todos.length);
  console.log('📅 Todos by date:', Object.entries(todosByDate).map(([date, todos]) => ({
    date,
    count: todos.length,
    titles: todos.map(t => t.title)
  })));
  console.log('🗓️ All todos with dates:', todos.map(t => ({
    id: t.id,
    title: t.title,
    date: t.date,
    dateType: typeof t.date
  })));

  // Check for any invalid or unexpected date formats
  const invalidDates = todos.filter(t => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    return !datePattern.test(t.date);
  });
  if (invalidDates.length > 0) {
    console.warn('⚠️ Found todos with invalid date format:', invalidDates);
  }

  if (!user) {
    return null;
  }

  const todoIds = todos.map((t) => t.id);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todoIds}>
        <div className="min-h-screen p-2 md:p-4">
          <div className="max-w-4xl mx-auto space-y-2">
            {/* Header */}
            <div className="win95-panel p-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-lg font-bold">Scheduler 97</h1>
                  <p className="text-xs">User: {user.name}</p>
                </div>
                <div className="flex gap-2">
                  <Win95Button onClick={handleLogout} className="text-xs">
                    Logout
                  </Win95Button>
                </div>
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

        {/* Notification Permission Dialog */}
        <Win95ConfirmDialog
          open={showPermissionDialog}
          title="Enable Notifications"
          message="Scheduler 97 would like to show notifications and update the app badge with your incomplete tasks. This helps you stay on top of your schedule!"
          onConfirm={handleRequestPermission}
          onCancel={() => setShowPermissionDialog(false)}
        />
      </SortableContext>
    </DndContext>
  );
}
