import { TDrizzleDatabase } from "@/db/drizzle";
import { TTodo, TTodoPresenter } from "../schemas/todo.contract";
import { ITodoRepository } from "./todo.contract.repository";
import { todoTable } from "../schemas/drizzle-todo-table.schema";
import { eq } from "drizzle-orm";

export class DrizzleTodoRepository implements ITodoRepository {
  private readonly db: TDrizzleDatabase

  constructor(db: TDrizzleDatabase) {
    this.db = db
  }

  async findAll(): Promise<TTodo[]> {
    const todos = await this.db.query.todo.findMany({
      orderBy: (todo, { desc }) => [desc(todo.createdAt), desc(todo.description)]
    })
    return todos
  }

  async create(todoData: TTodo): Promise<TTodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq, or }) => or(
        eq(todoTable.id, todoData.id),
        eq(todoTable.description, todoData.description)
      )
    })

    if (!!existingTodo) {
      return {
        success: false,
        errors: ['Já existe um todo com o ID ou descrição criado!']
      }
    }

    await this.db.insert(todoTable).values(todoData)

    return {
      success: true,
      todo: todoData
    }
  }

  async remove(id: string): Promise<TTodoPresenter> {
    const existingTodo = await this.db.query.todo.findFirst({
      where: (todoTable, { eq }) => eq(todoTable.id, id),
    })

    if (!existingTodo) {
      return {
        success: false,
        errors: ['Todo não existe!']
      }
    }

    await this.db.delete(todoTable).where(eq(todoTable.id, id))

    return {
      success: true,
      todo: existingTodo
    }
  }
}