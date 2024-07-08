import { Check, CheckboxChecked, TrashAlt } from '@styled-icons/boxicons-regular';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../../apis';
import { Todo } from '../../models';
import { Loader } from '../common';
import './style.scss';

type TodoItem = {
  todo: Todo;
};

export function TodoItem({ todo }: TodoItem) {
  const queryClient = useQueryClient();
  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: () => todoApi.updateTodo(todo._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteTodo'],
    mutationFn: () => todoApi.deleteTodo(todo._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const renderCheckbox = () => {
    if (todo.completed)
      return (
        <CheckboxChecked size={28} className="icon cursor-pointer" onClick={() => updateTodo()} />
      );
    return <Check size={24} className="icon cursor-pointer" onClick={() => updateTodo()} />;
  };

  return (
    <div className="todo-item flex-between">
      <p className={`item-text truncate ${todo.completed ? 'done' : 'in-progress'}`}>{todo.name}</p>
      <div className="item-icons flex gap-x-2">
        <div className="flex-center">
          {isUpdating ? <Loader bgColor="#9d77cf" /> : renderCheckbox()}
        </div>

        <div className="flex-center">
          {isDeleting ? (
            <Loader bgColor="#9d77cf" />
          ) : (
            <TrashAlt size={20} className="icon cursor-pointer" onClick={() => deleteTodo()} />
          )}
        </div>
      </div>
    </div>
  );
}
