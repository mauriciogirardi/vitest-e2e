import { TInvalidTodo, TValidTodo } from '@/core/todo/schemas/todo.contract';
import { revalidatePath } from 'next/cache';
import * as createTodoUseCaseMod from '@/core/todo/usecases/create-todo.usecase';
import * as deleteTodoUseCaseMod from '@/core/todo/usecases/delete-todo.usecase';

export const makeTestTodoMocks = () => {
  const successResult = {
    success: true,
    todo: {
      id: 'id',
      description: 'description',
      createdAt: 'createdAt',
    },
  } as TValidTodo;

  const errorResult = {
    success: false,
    errors: ['any', 'error'],
  } as TInvalidTodo;

  const createTodoUseCaseSpy = vi
    .spyOn(createTodoUseCaseMod, 'createTodoUseCase')
    .mockResolvedValue(successResult);

  const deleteTodoUseCaseSpy = vi
    .spyOn(deleteTodoUseCaseMod, 'deleteTodoUseCase')
    .mockResolvedValue(successResult);

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    successResult,
    errorResult,
    createTodoUseCaseSpy,
    revalidatePathMocked,
    deleteTodoUseCaseSpy,
  };
};
