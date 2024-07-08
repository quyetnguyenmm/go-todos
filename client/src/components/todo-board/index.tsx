import { useQuery } from '@tanstack/react-query';
import { todoApi } from '../../apis';
import { Todo } from '../../models';
import { TodoList } from '../todo-list';
import './style.scss';

export function TodoBoard() {
  const { data, isLoading } = useQuery<Todo[] | undefined>({
    queryKey: ['todos'],
    queryFn: todoApi.getTodoList,
  });

  const todoList = data?.filter((todo: Todo) => {
    return todo.completed === false;
  });

  const doneList = data?.filter((todo: Todo) => {
    return todo.completed === true;
  });

  if (isLoading) return;

  return (
    <div className="todo-board">
      {data?.length === 0 ? (
        <div className="board-empty flex flex-col items-center text-center">
          <span className="inline-block mb-1 font-medium text-green-4864">
            You don't have any tasks! 🚀
          </span>
          <img src="/assets/images/among-us.svg" alt="" />
        </div>
      ) : (
        <div className="board grid gap-12">
          <TodoList name="in-progress" list={todoList || []} />
          <TodoList name="done" list={doneList || []} />
        </div>
      )}
    </div>
  );
}
