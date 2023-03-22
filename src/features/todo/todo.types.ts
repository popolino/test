export type TTodo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export interface ICreateTodoRequest extends Partial<TTodo> {
  userId: number;
  title: string;
  completed: boolean;
}

export interface IEditTodoRequest extends Partial<TTodo> {
  id: number;
  title?: string;
  completed?: boolean;
}
