import { revalidatePath } from 'next/cache';
import { TInvalidTodo, TValidTodo } from '../schemas/todo.contract';
import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';
import { deleteTodoAction } from './delete-todo.actions';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('deleteTodoAction (unit)', () => {
  it('should be must to call the createTodoUseCase with right values', async () => {
    const { deleteTodoUseCaseSpy } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);
    expect(deleteTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(fakeId);
  });

  it('should be must the revalidatePath when success in usecase', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const fakeId = 'any-id';
    await deleteTodoAction(fakeId);
    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  it('should be must return the some value the usecase in success', async () => {
    const { successResult } = makeTestTodoMocks();
    const fakeId = 'any-id';
    const result = await deleteTodoAction(fakeId);
    expect(result).toStrictEqual(successResult);
  });

  it('should be must return the some value the usecase in error', async () => {
    const { errorResult, deleteTodoUseCaseSpy } = makeTestTodoMocks();
    deleteTodoUseCaseSpy.mockResolvedValue(errorResult);

    const fakeId = 'any-id';
    const result = await deleteTodoAction(fakeId);
    expect(result).toStrictEqual(errorResult);
  });
});
