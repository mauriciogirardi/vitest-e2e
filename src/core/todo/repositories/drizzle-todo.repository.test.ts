import { insertTestTodos, makeTestTodoRepository } from "@/core/__tests__/utils/make-test-todo-repository"

describe('DrizzleTodoRepository (integration)', () => {
  beforeEach(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository()
    await deleteTodoNoWhereDb()
  })

  afterAll(async () => {
    const { deleteTodoNoWhereDb } = await makeTestTodoRepository()
    await deleteTodoNoWhereDb()
  })

  describe('findAll', () => {
    it('should return empty array ', async () => {
      const { repository } = await makeTestTodoRepository()
      expect(await repository.findAll()).toStrictEqual([])
    })

    it('should return all todos in order desc', async () => {
      const { repository } = await makeTestTodoRepository()
      await insertTestTodos()

      const result = await repository.findAll()
      expect(result[0].createdAt).toBe('date 4')
      expect(result[1].createdAt).toBe('date 3')
      expect(result[2].createdAt).toBe('date 2')
      expect(result[3].createdAt).toBe('date 1')
    })
  })

  describe('create', () => {
    it('should create a todo if valid data', async () => {
      const { repository, todos } = await makeTestTodoRepository()
      const newTodo = await repository.create(todos[0])

      expect(newTodo).toStrictEqual({
        success: true,
        todo: todos[0]
      })
    })

    it('should return error if have a description equal created', async () => {
      const { repository, todos } = await makeTestTodoRepository()
      await repository.create(todos[0])
      const anotherTodo = await repository.create(todos[0])

      expect(anotherTodo).toStrictEqual({
        success: false,
        errors: ['Já existe um todo com o ID ou descrição criado!']
      })
    })

    it('should return error if have a ID equal created', async () => {
      const { repository, todos } = await makeTestTodoRepository()
      await repository.create(todos[0])
      const anotherTodo = await repository.create({
        createdAt: 'createdAt',
        description: 'another description',
        id: '0'
      })

      expect(anotherTodo).toStrictEqual({
        success: false,
        errors: ['Já existe um todo com o ID ou descrição criado!']
      })
    })
  })

  describe('delete', () => {
    it('should remove a todo if exist', async () => {
      const { repository, todos } = await makeTestTodoRepository()
      const newTodo = await repository.create(todos[0])

      expect(newTodo).toStrictEqual({
        success: true,
        todo: todos[0]
      })

      await repository.remove(todos[0].id)

      expect(await repository.findAll()).toStrictEqual([])
    })

    it('should return error if remove todo exist', async () => {
      const { repository } = await makeTestTodoRepository()
      const result = await repository.remove('any')

      expect(result).toStrictEqual({
        "errors": [
          "Todo não existe!",
        ],
        "success": false,
      })
    })
  })
})