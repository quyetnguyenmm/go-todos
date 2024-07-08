import { Todo } from '../../models';
import { TodoItem } from '../todo-item';
import './style.scss';

type TaskListProps = {
  name: string;
  list: Todo[];
};

export function TodoList({ name, list }: TaskListProps) {
  const nameList: { [key: string]: string } = {
    'in-progress': 'Tasks to do',
    done: 'Done',
  };

  return (
    <div>
      <div className="mb-4 font-medium text-center text-white">
        <span>{nameList[name]}</span>
        {' - '}
        <span className={`todo-num px-1.5 inline-block rounded text-fff ${name}-num`}>
          {list.length}
        </span>
      </div>

      <div className="space-y-4">
        {list.map((todo) => {
          return <TodoItem key={todo._id} todo={todo} />;
        })}
      </div>
    </div>
  );
}
