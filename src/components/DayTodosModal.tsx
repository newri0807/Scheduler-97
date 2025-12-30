'use client';

import { useState, useEffect } from 'react';
import { Win95Window } from './Win95Window';
import { Todo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { storage } from '@/lib/storage';

interface DayTodosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  onTodoClick: (todo: Todo) => void;
}

export function DayTodosModal({
  open,
  onOpenChange,
  date,
  onTodoClick,
}: DayTodosModalProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Always fetch fresh data from storage when modal opens or date changes
  useEffect(() => {
    if (open && date) {
      const allTodos = storage.getTodos();
      const filteredTodos = allTodos.filter(t => t.date === date);
      setTodos(filteredTodos);
    }
  }, [open, date]);

  if (!open) return null;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md max-h-[80vh] overflow-auto">
        <Win95Window title={formattedDate} onClose={() => onOpenChange(false)}>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {todos.length === 0 ? (
              <p className="text-center text-sm py-8">No tasks for this day</p>
            ) : (
              todos.map((todo) => (
                <button
                  key={todo.id}
                  onClick={() => {
                    onTodoClick(todo);
                    onOpenChange(false);
                  }}
                  className={cn(
                    'win95-task w-full text-left touch-manipulation',
                    todo.completed && 'completed'
                  )}
                >
                  <div className="font-bold text-xs">{todo.title}</div>
                  {todo.description && (
                    <div className="text-xs text-gray-600">{todo.description}</div>
                  )}
                  <div className="text-xs mt-1">
                    {todo.completed ? '[Completed]' : '[Pending]'}
                  </div>
                </button>
              ))
            )}
          </div>
        </Win95Window>
      </div>
    </div>
  );
}
