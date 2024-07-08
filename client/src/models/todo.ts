export type Todo = {
  _id: string;
  name: string;
  completed: boolean;
};

export type CreateTodoBody = {
  name: string;
};
