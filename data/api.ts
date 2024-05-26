const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}/todos`);
  if (!response.ok) {
    throw new Error('Failed to fetch Todo');
  }
  return await response.json();
};

export const getTodoById = async (id: number): Promise<Todo> => {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch Todo');
    }
    return await response.json();
  };

export const createTodo = async (title: string): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, done: false }),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  return await response.json();
};

export const updateTodo = async (todo: Partial<Todo>): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos/${todo.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return await response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};
