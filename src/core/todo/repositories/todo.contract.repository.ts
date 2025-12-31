import { TTodo, TTodoPresenter } from "../schemas/todo.contract";

export interface IFindAllTodoRepository {
  findAll(): Promise<TTodo[]>
}

export interface ICreateTodoRepository {
  create(todo: TTodo): Promise<TTodoPresenter>
}

export interface IDeleteTodoRepository {
  remove(id: string): Promise<TTodoPresenter>
}

export interface ITodoRepository extends IFindAllTodoRepository, ICreateTodoRepository, IDeleteTodoRepository { }