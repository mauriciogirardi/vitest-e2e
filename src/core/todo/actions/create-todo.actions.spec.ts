import { createTodoAction } from './create-todo.actions';
import { makeTestTodoMocks } from '@/core/__tests__/utils/make-test-todo-mocks';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createTodoAction (unit)', () => {
  it('should be must to call the createTodoUseCase with right values', async () => {
    const { revalidatePathMocked } = makeTestTodoMocks();
    const value = 'description';
    await createTodoAction(value);
    expect(revalidatePathMocked).toHaveBeenCalledExactlyOnceWith('/');
  });

  it('should be must the revalidatePath when success in usecase', async () => {
    const { createTodoUseCaseSpy } = makeTestTodoMocks();
    const value = 'description';
    await createTodoAction(value);
    expect(createTodoUseCaseSpy).toHaveBeenCalledExactlyOnceWith(value);
  });

  it('should be must return the some value the usecase in success', async () => {
    const { successResult } = makeTestTodoMocks();
    const value = 'description';
    const result = await createTodoAction(value);
    expect(result).toStrictEqual(successResult);
  });

  it('should be must return the some value the usecase in error', async () => {
    const { errorResult, createTodoUseCaseSpy } = makeTestTodoMocks();
    createTodoUseCaseSpy.mockResolvedValue(errorResult);

    const value = 'description';
    const result = await createTodoAction(value);
    expect(result).toStrictEqual(errorResult);
  });
});
