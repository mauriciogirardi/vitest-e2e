import { validateTodoDescription } from "./validate-todo-description"

describe('validateTodoDescription', () => {
  it('should must return errors when description have less than 4 character', () => {
    expect(validateTodoDescription('abc')).toStrictEqual({
      errors: [
        'Descrição precisa ter mais de 3 caracteres'
      ],
      success: false
    })
  })

  it('should must return success when description have greater than 3 character', () => {
    expect(validateTodoDescription('abcd')).toStrictEqual({
      errors: [],
      success: true
    })
  })
})