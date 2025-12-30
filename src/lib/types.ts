export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string; // ISO string format
  completed: boolean;
  createdAt: string;
  images?: string[]; // Array of base64 encoded images
}

export interface TodosByDate {
  [date: string]: Todo[];
}
