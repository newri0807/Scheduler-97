'use client';

import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Image as ImageIcon, GripVertical } from 'lucide-react';
import { Todo } from '@/lib/types';
import { formatDate, isSameMonth, isToday } from '@/lib/date-utils';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  days: Date[];
  currentMonth: Date;
  todosByDate: { [date: string]: Todo[] };
  onDateClick: (date: Date) => void;
  onMoreClick: (date: string) => void;
  onTodoClick: (todo: Todo) => void;
}

function DraggableTodo({
  todo,
  onTodoClick,
}: {
  todo: Todo;
  onTodoClick: (todo: Todo) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only trigger if not dragging
    if (!isDragging) {
      onTodoClick(todo);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'win95-task touch-manipulation flex items-center gap-0.5 relative',
        todo.completed && 'completed'
      )}
    >
      {/* Drag handle - left side with grip icon */}
      <div
        {...listeners}
        className="flex-shrink-0 cursor-move px-0.5 hover:bg-gray-300 transition-colors"
        title="Drag to move"
      >
        <GripVertical className="w-3 h-3 text-gray-600" />
      </div>

      {/* Clickable content area */}
      <div
        onClick={handleClick}
        className="flex items-center gap-1 flex-1 cursor-pointer min-w-0"
        title={todo.title} // Show full title on hover
      >
        {todo.images && todo.images.length > 0 && (
          <ImageIcon className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="truncate flex-1 text-xs">
          {todo.title}
        </span>
      </div>
    </div>
  );
}

function DroppableDay({
  date,
  currentMonth,
  todos,
  onDateClick,
  onMoreClick,
  onTodoClick,
}: {
  date: Date;
  currentMonth: Date;
  todos: Todo[];
  onDateClick: (date: Date) => void;
  onMoreClick: (dateStr: string) => void;
  onTodoClick: (todo: Todo) => void;
}) {
  const dateStr = formatDate(date);
  const { setNodeRef, isOver } = useDroppable({ id: dateStr });

  const visibleTodos = todos.slice(0, 3);
  const remainingCount = Math.max(0, todos.length - 3);

  // Debug logging for dates with more than 3 todos
  if (todos.length > 3) {
    console.log(`🔍 DroppableDay ${dateStr}:`, {
      totalTodos: todos.length,
      visibleTodos: visibleTodos.length,
      remainingCount,
      todoTitles: todos.map(t => t.title)
    });
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'win95-inset min-h-[100px] p-1 cursor-pointer touch-manipulation',
        !isSameMonth(date, currentMonth) && 'opacity-50',
        isOver && 'bg-blue-100',
        isToday(date) && 'bg-yellow-100'
      )}
      onClick={() => onDateClick(date)}
    >
      <div
        className={cn(
          'text-xs font-bold mb-1',
          isToday(date) && 'text-blue-800'
        )}
      >
        {date.getDate()}
      </div>

      <div className="space-y-1">
        {visibleTodos.map((todo) => (
          <DraggableTodo key={todo.id} todo={todo} onTodoClick={onTodoClick} />
        ))}

        {remainingCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoreClick(dateStr);
            }}
            className="text-xs font-bold underline hover:text-blue-800 touch-manipulation"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
}

export function CalendarGrid({
  days,
  currentMonth,
  todosByDate,
  onDateClick,
  onMoreClick,
  onTodoClick,
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="win95-panel p-2">
      {/* Week days header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold bg-[#c0c0c0] py-1 border border-black"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = formatDate(day);
          const todos = todosByDate[dateStr] || [];

          // Debug log for all dates with todos
          if (todos.length > 0) {
            console.log(`📆 ${dateStr}: ${todos.length} todo(s)`, todos.map(t => ({ title: t.title, completed: t.completed })));
          }

          return (
            <DroppableDay
              key={dateStr}
              date={day}
              currentMonth={currentMonth}
              todos={todos}
              onDateClick={onDateClick}
              onMoreClick={onMoreClick}
              onTodoClick={onTodoClick}
            />
          );
        })}
      </div>
    </div>
  );
}
