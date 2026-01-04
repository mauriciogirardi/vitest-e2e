import { makeTestTodoRepository } from '@/core/__tests__/utils/make-test-todo-repository';
import { deleteTodoUseCase } from './delete-todo.usecase';

describe('deleteTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository();
    await deleteTodoNoWhereDb();
  });

  it('should be must return error id invalid', async () => {
    const result = await deleteTodoUseCase('');

    expect(result).toStrictEqual({
      errors: ['ID invalid!'],
      success: false,
    });
  });

  it('should be must return success id exist', async () => {
    const { insertTodoDb, todos } = await makeTestTodoRepository();
    await insertTodoDb().values(todos);

    const result = await deleteTodoUseCase(todos[0].id);

    expect(result).toStrictEqual({
      todo: todos[0],
      success: true,
    });
  });

  it('should be must return error id not exist', async () => {
    const result = await deleteTodoUseCase('not-exist-todo');

    expect(result).toStrictEqual({
      errors: ['Todo não existe!'],
      success: false,
    });
  });
});
