import { DrizzleTodoRepository } from "@/core/todo/repositories/drizzle-todo.repository";
import { drizzleDatabase } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export async function makeTestTodoRepository() {
  const { db, todoTable } = drizzleDatabase
  const repository = new DrizzleTodoRepository(db)
  const todos = makeTestTodos()

  const insertTodoDb = () => db.insert(todoTable)
  const deleteTodoNoWhereDb = () => db.delete(todoTable)
  const deleteTodoDb = (id: string) => db.delete(todoTable).where(eq(todoTable.id, id))

  return {
    repository,
    insertTodoDb,
    deleteTodoDb,
    deleteTodoNoWhereDb,
    todos
  }
}

export const makeTestTodos = () => {
  return Array.from({ length: 5 }).map((_, index) => ({
    description: `Todo ${index}`,
    id: String(index),
    createdAt: `date ${index}`
  }))
}

export const insertTestTodos = async () => {
  const { insertTodoDb } = await makeTestTodoRepository()
  const todos = makeTestTodos()
  await insertTodoDb().values(todos)
  return todos
}