import { User, Todo } from './types';

const USER_STORAGE_KEY = 'scheduler_user';
const TODOS_STORAGE_KEY = 'scheduler_todos';

export const storage = {
  // User methods
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem(USER_STORAGE_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Todo methods
  getTodos: (): Todo[] => {
    if (typeof window === 'undefined') return [];
    try {
      const todos = localStorage.getItem(TODOS_STORAGE_KEY);
      return todos ? JSON.parse(todos) : [];
    } catch (error) {
      console.error('Error reading todos from localStorage:', error);
      return [];
    }
  },

  setTodos: (todos: Todo[]): void => {
    if (typeof window === 'undefined') return;
    try {
      const jsonString = JSON.stringify(todos);

      // Check localStorage quota (approximate)
      const size = new Blob([jsonString]).size;
      const sizeMB = size / (1024 * 1024);

      if (sizeMB > 4) {
        console.warn('Warning: localStorage data is getting large:', sizeMB.toFixed(2), 'MB');
      }

      localStorage.setItem(TODOS_STORAGE_KEY, jsonString);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded!');
        alert('Storage is full. Please delete some tasks or images to free up space.');
      } else {
        console.error('Error saving todos to localStorage:', error);
      }
      throw error;
    }
  },

  addTodo: (todo: Todo): void => {
    const todos = storage.getTodos();
    todos.push(todo);
    storage.setTodos(todos);
  },

  updateTodo: (id: string, updates: Partial<Todo>): void => {
    const todos = storage.getTodos();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      storage.setTodos(todos);
    }
  },

  deleteTodo: (id: string): void => {
    const todos = storage.getTodos();
    storage.setTodos(todos.filter(t => t.id !== id));
  },

  getTodosByDate: (date: string): Todo[] => {
    const todos = storage.getTodos();
    return todos.filter(t => t.date === date);
  },
};
