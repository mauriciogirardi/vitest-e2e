import { makeNewTodo } from "./make-new-todo"

describe('makeNewTodo', () => {
  it('should create a new todo', () => {
    const expectedTodo = {
      id: expect.any(String),
      description: 'my new todo',
      createdAt: expect.any(String),
    }

    const newTodo = makeNewTodo('my new todo')

    expect(newTodo).toStrictEqual(expectedTodo)
  })
})