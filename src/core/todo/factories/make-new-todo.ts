import { TTodo } from "../schemas/todo.contract";

export function makeNewTodo(description: string): TTodo {
  return {
    id: crypto.randomUUID(),
    description,
    createdAt: new Date().toISOString()
  }
}