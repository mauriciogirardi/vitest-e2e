import { makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository"
import { createTodoUseCase } from "./create-todo.usecase"
import { TInvalidTodo } from "../schemas/todo.contract"

describe('createTodoUseCase (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository()
    await deleteTodoNoWhereDb()
  })

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository()
    await deleteTodoNoWhereDb()
  })

  it('should return error if validation failed', async () => {
    const result = await createTodoUseCase('') as TInvalidTodo

    expect(result.success).toBe(false)
    expect(result.errors).toHaveLength(1)
  })

  it('should return TODO created', async () => {
    const result = await createTodoUseCase('todo')

    expect(result).toStrictEqual({
      success: true,
      todo: {
        "createdAt": expect.any(String),
        "description": "todo",
        "id": expect.any(String)
      }
    })
  })

  it('should return error when create two todo with same description', async () => {
    await createTodoUseCase('todo')
    const result = await createTodoUseCase('todo') as TInvalidTodo

    expect(result.success).toBe(false)
    expect(result.errors).toHaveLength(1)
  })
})