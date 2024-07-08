import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from '@styled-icons/boxicons-regular';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { todoApi } from '../../apis';
import { CreateTodoBody } from '../../models';
import { InputField } from '../form';
import './style.scss';
import { Loader } from '../common';

const schema = yup.object({
  name: yup.string().trim().required('Please enter your to-do!'),
});

export function TodoForm() {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<CreateTodoBody>({
    defaultValues: { name: '' },
    resolver: yupResolver(schema),
  });

  const { mutate: createTodo, isPending } = useMutation({
    mutationKey: ['updateTodo'],
    mutationFn: (data: CreateTodoBody) => todoApi.createTodo(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const handleFormSubmit = (value: CreateTodoBody) => {
    createTodo(value);
    reset();
  };

  return (
    <div className="todo-form mb-14">
      <div className="form-content mx-auto">
        <form className="flex" onSubmit={handleSubmit(handleFormSubmit)}>
          <InputField name="name" control={control} placeholder="Add a new task" />
          <button type="submit" className="flex-center">
            {isPending ? <Loader /> : <Plus size={22} />}
          </button>
        </form>
      </div>
    </div>
  );
}
