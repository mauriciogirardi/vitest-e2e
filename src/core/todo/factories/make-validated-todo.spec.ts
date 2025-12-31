import * as sanitizeStr from "@/utils/sanitize-str"
import { makeValidatedTodo } from "./make-validated-todo"
import * as  validateTodoDescription from "../schemas/validate-todo-description"
import * as makeNewTodo from "./make-new-todo"

describe('makeValidatedTodo (unit)', () => {
  it('should must call sanitizeStr function with correctly value', () => {
    const { description, sanitizeStrSpy } = makeMocks()

    makeValidatedTodo(description)

    expect(sanitizeStrSpy).toHaveBeenCalledTimes(1)
    expect(sanitizeStrSpy).toHaveBeenCalledWith(description)
  })

  it('should must call validateTodoDescription function with return sanitizeStr', () => {
    const { description, sanitizeStrSpy, validateTodoDescriptionSpy } = makeMocks()

    const sanitizeStrReturn = 'return of sanitizeStr'
    sanitizeStrSpy.mockReturnValue(sanitizeStrReturn)

    makeValidatedTodo(description)

    expect(validateTodoDescriptionSpy).toHaveBeenCalledExactlyOnceWith(sanitizeStrReturn)
  })

  it('should must call makeNewTodo function with success', () => {
    const { description, todo } = makeMocks()

    const result = makeValidatedTodo(description)

    expect(result).toStrictEqual({
      success: true,
      todo
    })
  })

  it('should must return validateTodoDescription.error if validation failed', () => {
    const errors = ['any', 'error']
    const { description, validateTodoDescriptionSpy } = makeMocks()

    validateTodoDescriptionSpy.mockReturnValue({
      errors,
      success: false
    })

    const result = makeValidatedTodo(description)

    expect(result).toStrictEqual({
      success: false,
      errors
    })
  })
})

// Utils

const makeMocks = (description = 'abca') => {
  const todo = {
    description,
    createdAt: 'any-date',
    id: 'any-id'
  }

  const sanitizeStrSpy = vi.spyOn(sanitizeStr, 'sanitizeStr').mockReturnValue(description)

  const validateTodoDescriptionSpy = vi.spyOn(validateTodoDescription, 'validateTodoDescription').mockReturnValue({
    errors: [],
    success: true
  })

  const makeNewTodoSpy = vi.spyOn(makeNewTodo, 'makeNewTodo').mockReturnValue(todo)

  return {
    description,
    sanitizeStrSpy,
    validateTodoDescriptionSpy,
    makeNewTodoSpy,
    todo
  }
}