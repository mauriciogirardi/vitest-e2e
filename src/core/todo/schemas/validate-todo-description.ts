type TValidateTodoDescription = {
  success: boolean
  errors: string[]
}

const MINIMUM_LENGTH = 3

export function validateTodoDescription(description: string): TValidateTodoDescription {
  const errors: string[] = []

  if (description.length <= MINIMUM_LENGTH) {
    errors.push(`Descrição precisa ter mais de ${MINIMUM_LENGTH} caracteres`)
  }

  return {
    success: errors.length === 0,
    errors
  }
}
