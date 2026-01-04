import { revalidatePath } from 'next/cache';
import { TInvalidTodo, TValidTodo } from '../schemas/todo.contract';
import * as createTodoUseCaseMod from '../usecases/create-todo.usecase';
import { createTodoAction } from './create-todo.actions';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createTodoAction (unit)', () => {
  it('should be must to call the createTodoUseCase with right values', async () => {
    const { revalidatePathMocked } = makeMocks();
    const value = 'description';
    await createTodoAction(value);
    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  it('should be must the revalidatePath when success in usecase', async () => {
    const { createTodoUseCaseSpy } = makeMocks();
    const value = 'description';
    await createTodoAction(value);
    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(value);
  });

  it('should be must return the some value the usecase in success', async () => {
    const { successResult } = makeMocks();
    const value = 'description';
    const result = await createTodoAction(value);
    expect(result).toStrictEqual(successResult);
  });

  it('should be must return the some value the usecase in error', async () => {
    const { errorResult, createTodoUseCaseSpy } = makeMocks();
    createTodoUseCaseSpy.mockResolvedValue(errorResult);

    const value = 'description';
    const result = await createTodoAction(value);
    expect(result).toStrictEqual(errorResult);
  });
});

const makeMocks = () => {
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

  const revalidatePathMocked = vi.mocked(revalidatePath);

  return {
    successResult,
    errorResult,
    createTodoUseCaseSpy,
    revalidatePathMocked,
  };
};
